import { db } from "@/db";
import { messages, leads, channelConfigs } from "@/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { Resend } from "resend";
import { generateEmailReply } from "./email-conversation";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

const MAX_AUTO_REPLIES_PER_DAY = 10;

interface InboundEmailData {
  fromEmail: string;
  subject: string;
  body: string;
  html?: string;
  headers?: Record<string, string>;
}

/**
 * Process an inbound email reply from a lead.
 * Finds the lead, logs the inbound message, generates an AI reply, and sends it.
 */
export async function processInboundEmail(data: InboundEmailData): Promise<{
  success: boolean;
  error?: string;
  messageId?: string;
  replyMessageId?: string;
}> {
  const { fromEmail, subject, body, html } = data;

  try {
    // 1. Find the lead by email
    const leadRows = await db
      .select({
        id: leads.id,
        orgId: leads.orgId,
        firstName: leads.firstName,
        lastName: leads.lastName,
        company: leads.company,
        email: leads.email,
        campaignId: leads.campaignId,
      })
      .from(leads)
      .where(eq(leads.email, fromEmail.toLowerCase()))
      .limit(1);

    if (leadRows.length === 0) {
      console.log(`No lead found for email: ${fromEmail}`);
      return { success: false, error: "Lead not found" };
    }

    const lead = leadRows[0];
    const orgId = lead.orgId;

    // 2. Log the inbound message
    const [inboundMsg] = await db
      .insert(messages)
      .values({
        orgId,
        leadId: lead.id,
        campaignId: lead.campaignId || null,
        channel: "email",
        direction: "inbound",
        status: "delivered",
        content: body,
        metadata: {
          subject,
          fromEmail,
          html: html?.substring(0, 5000), // Truncate HTML to avoid huge metadata
        },
      })
      .returning();

    // 3. Check rate limit: max auto-replies per lead per day
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const [replyCount] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(messages)
      .where(
        and(
          eq(messages.orgId, orgId),
          eq(messages.leadId, lead.id),
          eq(messages.channel, "email"),
          eq(messages.direction, "outbound"),
          gte(messages.createdAt, dayAgo),
          // Only count auto-replies (have autoReply in metadata)
        )
      );

    if (replyCount.count >= MAX_AUTO_REPLIES_PER_DAY) {
      console.log(
        `Rate limit reached for lead ${lead.id}: ${replyCount.count} replies in last 24h`
      );
      return {
        success: true,
        messageId: inboundMsg.id,
        error: "Rate limit reached, inbound logged but no auto-reply sent",
      };
    }

    // 4. Generate AI reply
    const reply = await generateEmailReply(orgId, lead.id, body, subject, {
      firstName: lead.firstName,
      lastName: lead.lastName,
      company: lead.company,
      email: lead.email,
    });

    // 5. Get email config for sender info
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

    const senderEmail = emailConfig?.fromEmail || "noreply@projectnoir.xyz";
    const senderName = emailConfig?.fromName || "Project Noir";
    const replyTo = emailConfig?.replyTo || senderEmail;

    // 6. Send the reply via Resend
    const { data: resendData, error: resendError } = await resend.emails.send({
      from: `${senderName} <${senderEmail}>`,
      to: [fromEmail],
      replyTo,
      subject: reply.subject,
      html: reply.body.replace(/\n/g, "<br />"),
    });

    if (resendError) {
      console.error("Failed to send auto-reply:", resendError);

      // Log failed outbound
      await db.insert(messages).values({
        orgId,
        leadId: lead.id,
        campaignId: lead.campaignId || null,
        channel: "email",
        direction: "outbound",
        status: "failed",
        content: reply.body,
        parentId: inboundMsg.id,
        metadata: {
          subject: reply.subject,
          toEmail: fromEmail,
          autoReply: true,
          error: resendError.message,
        },
      });

      return {
        success: false,
        messageId: inboundMsg.id,
        error: `Failed to send reply: ${resendError.message}`,
      };
    }

    // 7. Log successful outbound reply
    const [replyMsg] = await db
      .insert(messages)
      .values({
        orgId,
        leadId: lead.id,
        campaignId: lead.campaignId || null,
        channel: "email",
        direction: "outbound",
        status: "sent",
        content: reply.body,
        parentId: inboundMsg.id,
        metadata: {
          subject: reply.subject,
          toEmail: fromEmail,
          resendId: resendData?.id,
          autoReply: true,
        },
      })
      .returning();

    console.log(
      `Auto-reply sent to ${fromEmail} for lead ${lead.id}, message ${replyMsg.id}`
    );

    return {
      success: true,
      messageId: inboundMsg.id,
      replyMessageId: replyMsg.id,
    };
  } catch (error) {
    console.error("Error processing inbound email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
