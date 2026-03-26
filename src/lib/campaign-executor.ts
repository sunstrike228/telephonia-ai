import { db } from "@/db";
import { campaigns, leads, messages, scripts, voiceConfigs, channelConfigs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { buildSystemPrompt, buildEmailPrompt, type Channel } from "@/lib/prompts";
import { checkUsageLimits } from "@/lib/usage";
import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

const TELEGRAM_WORKER_URL =
  "https://telephonia-telegram-worker-production.up.railway.app/api/send";
const VOICE_AGENT_URL =
  "https://telephonia-voice-agent-production.up.railway.app/api/call";

// Delays in ms between leads per channel
const CHANNEL_DELAYS: Record<string, number> = {
  telegram: 60_000,
  email: 3_000,
  voice: 5_000,
};

export interface ExecutionProgress {
  campaignId: string;
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
  results: LeadResult[];
}

export interface LeadResult {
  leadId: string;
  leadName: string;
  channel: string;
  status: "sent" | "failed" | "skipped";
  error?: string;
}

interface CampaignRow {
  id: string;
  orgId: string;
  name: string;
  scriptId: string | null;
  voiceConfigId: string | null;
  status: string;
  channels: unknown;
  channelPriority: unknown;
  settings: unknown;
}

interface LeadRow {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  telegramUsername: string | null;
  company: string | null;
  status: string;
}

interface ScriptRow {
  id: string;
  name: string;
  content: string;
  objectionHandlers: unknown;
}

interface VoiceConfigRow {
  language: string;
  personality: string;
}

async function sendTelegram(
  telegramUsername: string,
  message: string,
  orgId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(TELEGRAM_WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        telegramUsername,
        message,
        orgId,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Unknown error" }));
      return { success: false, error: data.error || `HTTP ${res.status}` };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

async function sendEmail(
  toEmail: string,
  subject: string,
  body: string,
  orgId: string,
  leadId: string,
  campaignId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get email config for sender info
    const configs = await db
      .select()
      .from(channelConfigs)
      .where(
        and(
          eq(channelConfigs.orgId, orgId),
          eq(channelConfigs.channel, "email")
        )
      )
      .limit(1);

    const emailConfig = configs[0]?.config as {
      fromEmail?: string;
      fromName?: string;
      replyTo?: string;
    } | null;

    const fromEmail = emailConfig?.fromEmail || "noreply@projectnoir.xyz";
    const fromName = emailConfig?.fromName || "Project Noir";
    const replyTo = emailConfig?.replyTo || fromEmail;

    const resendClient = getResend();
    if (!resendClient) throw new Error("Resend API key not configured");
    const { data, error } = await resendClient.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [toEmail],
      replyTo,
      subject,
      html: body.replace(/\n/g, "<br />"),
    });

    if (error) {
      // Log failed message
      await db.insert(messages).values({
        orgId,
        leadId,
        campaignId,
        channel: "email",
        direction: "outbound",
        status: "failed",
        content: body,
        metadata: { subject, toEmail, error: error.message },
      });
      return { success: false, error: error.message };
    }

    // Log successful message
    await db.insert(messages).values({
      orgId,
      leadId,
      campaignId,
      channel: "email",
      direction: "outbound",
      status: "sent",
      content: body,
      metadata: { subject, toEmail, resendId: data?.id },
    });

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Email send error",
    };
  }
}

async function sendVoiceCall(
  phone: string,
  systemPrompt: string,
  orgId: string,
  leadId: string,
  campaignId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(VOICE_AGENT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        systemPrompt,
        orgId,
        leadId,
        campaignId,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Unknown error" }));
      // Log failed message
      await db.insert(messages).values({
        orgId,
        leadId,
        campaignId,
        channel: "voice",
        direction: "outbound",
        status: "failed",
        content: systemPrompt,
        metadata: { phone, error: data.error || `HTTP ${res.status}` },
      });
      return { success: false, error: data.error || `HTTP ${res.status}` };
    }

    // Log successful message
    await db.insert(messages).values({
      orgId,
      leadId,
      campaignId,
      channel: "voice",
      direction: "outbound",
      status: "sent",
      content: systemPrompt,
      metadata: { phone },
    });

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Voice call error",
    };
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function executeCampaign(
  campaignId: string,
  orgId: string
): Promise<ExecutionProgress> {
  // 1. Load campaign
  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(and(eq(campaigns.id, campaignId), eq(campaigns.orgId, orgId)))
    .limit(1);

  if (!campaign) {
    throw new Error("Campaign not found");
  }

  const campaignData = campaign as unknown as CampaignRow;
  const channelPriority = (
    Array.isArray(campaignData.channelPriority)
      ? campaignData.channelPriority
      : ["telegram", "voice", "email"]
  ) as string[];

  // 2. Load script if assigned
  let scriptData: ScriptRow | null = null;
  if (campaignData.scriptId) {
    const [s] = await db
      .select()
      .from(scripts)
      .where(eq(scripts.id, campaignData.scriptId))
      .limit(1);
    if (s) {
      scriptData = s as unknown as ScriptRow;
    }
  }

  // 3. Load voice config if assigned
  let voiceConfig: VoiceConfigRow | null = null;
  if (campaignData.voiceConfigId) {
    const [v] = await db
      .select()
      .from(voiceConfigs)
      .where(eq(voiceConfigs.id, campaignData.voiceConfigId))
      .limit(1);
    if (v) {
      voiceConfig = v as unknown as VoiceConfigRow;
    }
  }

  const language = voiceConfig?.language || "en";
  const personality = voiceConfig?.personality || "professional";
  const scriptContent = scriptData?.content || "";
  const objectionHandlers = Array.isArray(scriptData?.objectionHandlers)
    ? (scriptData.objectionHandlers as string[])
    : [];

  // 4. Load leads assigned to this campaign
  const campaignLeads = await db
    .select()
    .from(leads)
    .where(and(eq(leads.campaignId, campaignId), eq(leads.orgId, orgId)));

  if (campaignLeads.length === 0) {
    throw new Error("No leads assigned to this campaign");
  }

  // 5. Update campaign status to active
  await db
    .update(campaigns)
    .set({ status: "active", updatedAt: new Date() })
    .where(eq(campaigns.id, campaignId));

  const progress: ExecutionProgress = {
    campaignId,
    total: campaignLeads.length,
    processed: 0,
    succeeded: 0,
    failed: 0,
    results: [],
  };

  // 6. Process each lead sequentially
  for (const lead of campaignLeads) {
    // Check usage limits before processing each lead
    const usageCheck = await checkUsageLimits(orgId);
    if (!usageCheck.allowed) {
      // Stop the campaign — usage limit reached
      await db
        .update(campaigns)
        .set({ status: "paused", updatedAt: new Date() })
        .where(eq(campaigns.id, campaignId));

      // Mark remaining leads as skipped
      const remaining = campaignLeads.length - progress.processed;
      for (let i = 0; i < remaining; i++) {
        progress.results.push({
          leadId: (campaignLeads[progress.processed + i] as unknown as LeadRow).id,
          leadName: "Skipped",
          channel: "none",
          status: "skipped",
          error: usageCheck.reason || "Usage limit reached",
        });
        progress.failed++;
        progress.processed++;
      }
      return progress;
    }

    const leadData = lead as unknown as LeadRow;
    const leadName = [leadData.firstName, leadData.lastName]
      .filter(Boolean)
      .join(" ") || "Unknown";

    let sent = false;
    let lastResult: LeadResult | null = null;

    // Try each channel in priority order
    for (const channel of channelPriority) {
      // Check if lead has contact info for this channel
      if (channel === "telegram" && !leadData.telegramUsername) {
        continue;
      }
      if (channel === "email" && !leadData.email) {
        continue;
      }
      if (channel === "voice" && !leadData.phone) {
        continue;
      }

      // Build prompt for this channel
      const systemPrompt = buildSystemPrompt({
        channel: channel as Channel,
        script: scriptContent,
        objectionHandlers,
        personality,
        language,
        leadContext: {
          firstName: leadData.firstName || undefined,
          lastName: leadData.lastName || undefined,
          company: leadData.company || undefined,
        },
      });

      let result: { success: boolean; error?: string };

      if (channel === "telegram") {
        result = await sendTelegram(
          leadData.telegramUsername!,
          systemPrompt,
          orgId
        );

        // Log telegram message
        await db.insert(messages).values({
          orgId,
          leadId: leadData.id,
          campaignId,
          channel: "telegram",
          direction: "outbound",
          status: result.success ? "sent" : "failed",
          content: systemPrompt,
          metadata: {
            telegramUsername: leadData.telegramUsername,
            ...(result.error ? { error: result.error } : {}),
          },
        });
      } else if (channel === "email") {
        const emailPrompt = buildEmailPrompt({
          channel: "email",
          script: scriptContent,
          objectionHandlers,
          personality,
          language,
          leadContext: {
            firstName: leadData.firstName || undefined,
            lastName: leadData.lastName || undefined,
            company: leadData.company || undefined,
          },
          emailType: "initial",
          dayNumber: 1,
        });

        result = await sendEmail(
          leadData.email!,
          emailPrompt.subject,
          emailPrompt.body,
          orgId,
          leadData.id,
          campaignId
        );
      } else if (channel === "voice") {
        result = await sendVoiceCall(
          leadData.phone!,
          systemPrompt,
          orgId,
          leadData.id,
          campaignId
        );
      } else {
        continue;
      }

      lastResult = {
        leadId: leadData.id,
        leadName,
        channel,
        status: result.success ? "sent" : "failed",
        error: result.error,
      };

      if (result.success) {
        sent = true;
        // Update lead status to contacted
        await db
          .update(leads)
          .set({ status: "contacted" })
          .where(eq(leads.id, leadData.id));
        break; // Success — don't try other channels
      }

      // Channel failed — try next channel in priority
    }

    if (!sent && !lastResult) {
      // No channel had contact info
      lastResult = {
        leadId: leadData.id,
        leadName,
        channel: "none",
        status: "skipped",
        error: "No contact information for any configured channel",
      };
    }

    if (lastResult) {
      progress.results.push(lastResult);
      if (lastResult.status === "sent") {
        progress.succeeded++;
      } else {
        progress.failed++;
      }
    }

    progress.processed++;

    // Delay between leads
    if (progress.processed < progress.total) {
      const lastChannel = lastResult?.channel || "email";
      const delayMs = CHANNEL_DELAYS[lastChannel] || 3_000;
      // Use a shorter delay for the executor (min 2s) to not block too long
      await delay(Math.min(delayMs, 5_000));
    }
  }

  // 7. Update campaign status to completed
  await db
    .update(campaigns)
    .set({ status: "completed", updatedAt: new Date() })
    .where(eq(campaigns.id, campaignId));

  return progress;
}
