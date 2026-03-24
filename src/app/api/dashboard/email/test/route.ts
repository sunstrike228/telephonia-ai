import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { channelConfigs } from "@/db/schema";
import { getOrgId } from "@/lib/auth";
import { Resend } from "resend";
import { eq, and } from "drizzle-orm";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);
    const user = await currentUser();
    const userEmail = user?.emailAddresses?.[0]?.emailAddress;

    if (!userEmail) {
      return Response.json(
        { error: "No email address found on your account" },
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

    if (!emailConfig?.fromEmail) {
      return Response.json(
        { error: "Email not configured. Please save your email settings first." },
        { status: 400 }
      );
    }

    const fromEmail = emailConfig.fromEmail;
    const fromName = emailConfig.fromName || "Project Noir";
    const replyTo = emailConfig.replyTo || fromEmail;

    const { error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: [userEmail],
      replyTo,
      subject: "Project Noir Test Email",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #111; margin-bottom: 16px;">Email Configuration Test</h2>
          <p style="color: #555; line-height: 1.6;">
            This is a test email from <strong>Project Noir</strong>. If you received this, your email integration is working correctly.
          </p>
          <div style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 8px; font-size: 14px; color: #666;">
            <p style="margin: 0 0 8px 0;"><strong>From:</strong> ${fromName} &lt;${fromEmail}&gt;</p>
            <p style="margin: 0 0 8px 0;"><strong>Reply-To:</strong> ${replyTo}</p>
            <p style="margin: 0;"><strong>To:</strong> ${userEmail}</p>
          </div>
        </div>
      `,
    });

    if (error) {
      return Response.json(
        { error: `Resend error: ${error.message}` },
        { status: 500 }
      );
    }

    return Response.json({ success: true, to: userEmail });
  } catch (error) {
    console.error("Failed to send test email:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
