import { Webhook } from "svix";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { processInboundEmail } from "@/lib/email-inbound";

export const runtime = "nodejs";

// Resend webhook event types
type ResendEventType =
  | "email.sent"
  | "email.delivered"
  | "email.opened"
  | "email.clicked"
  | "email.bounced"
  | "email.complained"
  | "email.received";

interface ResendWebhookPayload {
  type: ResendEventType;
  data: {
    // For delivery/tracking events
    email_id?: string;
    // For inbound emails
    from?: string;
    to?: string[];
    subject?: string;
    text?: string;
    html?: string;
    headers?: Record<string, string>[];
  };
}

// Map Resend event types to our message status
const EVENT_TO_STATUS: Partial<Record<ResendEventType, string>> = {
  "email.delivered": "delivered",
  "email.opened": "read",
  "email.bounced": "failed",
  "email.complained": "failed",
};

/**
 * Verify webhook signature using Svix (Resend uses Svix for webhook signing).
 */
function verifyWebhook(
  payload: string,
  headers: Headers
): ResendWebhookPayload | null {
  const secret = process.env.RESEND_WEBHOOK_SECRET;

  if (!secret) {
    console.warn("RESEND_WEBHOOK_SECRET not configured, skipping verification");
    // In development, allow unverified webhooks
    try {
      return JSON.parse(payload) as ResendWebhookPayload;
    } catch {
      return null;
    }
  }

  try {
    const wh = new Webhook(secret);
    const svixId = headers.get("svix-id") || "";
    const svixTimestamp = headers.get("svix-timestamp") || "";
    const svixSignature = headers.get("svix-signature") || "";

    const verified = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ResendWebhookPayload;

    return verified;
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return null;
  }
}

/**
 * Update message status based on delivery/tracking events.
 * Finds the message by Resend email ID stored in metadata.
 */
async function handleTrackingEvent(
  eventType: ResendEventType,
  emailId: string
): Promise<void> {
  const newStatus = EVENT_TO_STATUS[eventType];
  if (!newStatus) return;

  // Find messages with this Resend ID in metadata
  // We need to search by metadata->resendId
  const rows = await db
    .select({ id: messages.id, status: messages.status, metadata: messages.metadata })
    .from(messages)
    .where(eq(messages.channel, "email"))
    .limit(100);

  for (const row of rows) {
    const meta = row.metadata as Record<string, unknown> | null;
    if (meta?.resendId === emailId) {
      // Only update if it's a progression (don't downgrade status)
      const statusOrder = ["pending", "sent", "delivered", "read"];
      const currentIdx = statusOrder.indexOf(row.status);
      const newIdx = statusOrder.indexOf(newStatus);

      if (newStatus === "failed" || newIdx > currentIdx) {
        await db
          .update(messages)
          .set({
            status: newStatus as "pending" | "sent" | "delivered" | "read" | "replied" | "failed",
          })
          .where(eq(messages.id, row.id));

        console.log(
          `Updated message ${row.id} status: ${row.status} -> ${newStatus}`
        );
      }
      break;
    }
  }
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    // Verify webhook signature
    const event = verifyWebhook(rawBody, request.headers);
    if (!event) {
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log(`Resend webhook received: ${event.type}`);

    // Handle inbound email (reply from lead)
    if (event.type === "email.received") {
      const { from, subject, text, html, headers } = event.data;

      if (!from) {
        return Response.json({ error: "Missing from field" }, { status: 400 });
      }

      // Extract clean email address (handle "Name <email>" format)
      const emailMatch = from.match(/<(.+?)>/) || [null, from];
      const cleanEmail = (emailMatch[1] || from).trim().toLowerCase();

      const headersObj: Record<string, string> = {};
      if (Array.isArray(headers)) {
        for (const h of headers) {
          Object.assign(headersObj, h);
        }
      }

      const result = await processInboundEmail({
        fromEmail: cleanEmail,
        subject: subject || "(no subject)",
        body: text || "",
        html: html || undefined,
        headers: headersObj,
      });

      return Response.json({
        received: true,
        type: event.type,
        ...result,
      });
    }

    // Handle tracking events (delivered, opened, clicked, bounced, complained)
    if (event.data.email_id) {
      await handleTrackingEvent(event.type, event.data.email_id);
    }

    return Response.json({ received: true, type: event.type });
  } catch (error) {
    console.error("Resend webhook error:", error);
    return Response.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
