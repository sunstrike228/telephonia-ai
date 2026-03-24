import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { messages, channelConfigs } from "@/db/schema";
import { getOrgId } from "@/lib/auth";
import { Resend } from "resend";
import { eq, and } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);
    const body = await request.json();
    const { leadId, campaignId, subject, body: emailBody, toEmail } = body;

    if (!leadId || !subject || !emailBody || !toEmail) {
      return Response.json(
        { error: "Missing required fields: leadId, subject, body, toEmail" },
        { status: 400 }
      );
    }

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

    const fromEmail = emailConfig?.fromEmail || "noreply@projectnoir.ai";
    const fromName = emailConfig?.fromName || "Project Noir";
    const replyTo = emailConfig?.replyTo || fromEmail;

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [toEmail],
      replyTo,
      subject,
      html: emailBody.replace(/\n/g, "<br />"),
    });

    if (error) {
      // Log failed message
      await db.insert(messages).values({
        orgId,
        leadId,
        campaignId: campaignId || null,
        channel: "email",
        direction: "outbound",
        status: "failed",
        content: emailBody,
        metadata: { subject, toEmail, error: error.message },
      });

      return Response.json(
        { error: `Failed to send email: ${error.message}` },
        { status: 500 }
      );
    }

    // Log successful message
    const [message] = await db
      .insert(messages)
      .values({
        orgId,
        leadId,
        campaignId: campaignId || null,
        channel: "email",
        direction: "outbound",
        status: "sent",
        content: emailBody,
        metadata: { subject, toEmail, resendId: data?.id },
      })
      .returning();

    return Response.json({ success: true, messageId: message.id, resendId: data?.id });
  } catch (error) {
    console.error("Failed to send email:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
