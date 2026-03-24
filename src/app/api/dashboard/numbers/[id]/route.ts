import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { phoneNumbers } from "@/db/schema";
import { getOrgId } from "@/lib/auth";
import { eq, and } from "drizzle-orm";
import Twilio from "twilio";

function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  return Twilio(sid, token);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const orgId = await getOrgId(userId);

    const [row] = await db
      .select()
      .from(phoneNumbers)
      .where(and(eq(phoneNumbers.id, id), eq(phoneNumbers.orgId, orgId)))
      .limit(1);

    if (!row) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(row);
  } catch (error) {
    console.error("Failed to fetch phone number:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const orgId = await getOrgId(userId);
    const body = await request.json();
    const { label, campaignId } = body;

    const updateData: Record<string, unknown> = {};
    if (label !== undefined) updateData.label = label || null;
    if (campaignId !== undefined) updateData.campaignId = campaignId || null;

    if (Object.keys(updateData).length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    const [row] = await db
      .update(phoneNumbers)
      .set(updateData)
      .where(and(eq(phoneNumbers.id, id), eq(phoneNumbers.orgId, orgId)))
      .returning();

    if (!row) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(row);
  } catch (error) {
    console.error("Failed to update phone number:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const orgId = await getOrgId(userId);

    // Get the number first to release it from Twilio
    const [existing] = await db
      .select()
      .from(phoneNumbers)
      .where(and(eq(phoneNumbers.id, id), eq(phoneNumbers.orgId, orgId)))
      .limit(1);

    if (!existing) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    // Try to release from Twilio
    if (existing.provider === "twilio") {
      const client = getTwilioClient();
      if (client) {
        try {
          // Find the Twilio SID for this number
          const twilioNumbers = await client.incomingPhoneNumbers.list({
            phoneNumber: existing.number,
          });
          if (twilioNumbers.length > 0) {
            await client.incomingPhoneNumbers(twilioNumbers[0].sid).remove();
          }
        } catch (err) {
          console.error("Failed to release number from Twilio:", err);
          // Continue with DB deletion even if Twilio release fails
        }
      }
    }

    // Delete from DB
    const [row] = await db
      .delete(phoneNumbers)
      .where(and(eq(phoneNumbers.id, id), eq(phoneNumbers.orgId, orgId)))
      .returning();

    if (!row) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete phone number:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
