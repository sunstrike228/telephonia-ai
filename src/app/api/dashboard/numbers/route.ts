import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { phoneNumbers } from "@/db/schema";
import { getOrgId } from "@/lib/auth";
import { eq } from "drizzle-orm";
import Twilio from "twilio";

function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  return Twilio(sid, token);
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);

    const numbers = await db
      .select()
      .from(phoneNumbers)
      .where(eq(phoneNumbers.orgId, orgId));

    return Response.json({ numbers });
  } catch (error) {
    console.error("Failed to fetch phone numbers:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);
    const body = await request.json();
    const { phoneNumber, label } = body;

    if (!phoneNumber) {
      return Response.json(
        { error: "Missing required field: phoneNumber" },
        { status: 400 }
      );
    }

    const client = getTwilioClient();
    if (!client) {
      return Response.json(
        { error: "Twilio is not configured. Please add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN." },
        { status: 400 }
      );
    }

    // Purchase the number via Twilio
    let purchased;
    try {
      purchased = await client.incomingPhoneNumbers.create({
        phoneNumber,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown Twilio error";
      return Response.json(
        { error: `Twilio purchase failed: ${message}` },
        { status: 400 }
      );
    }

    // Save to DB
    const [row] = await db
      .insert(phoneNumbers)
      .values({
        orgId,
        number: purchased.phoneNumber,
        label: label || null,
        provider: "twilio",
        status: "active",
      })
      .returning();

    return Response.json(row, { status: 201 });
  } catch (error) {
    console.error("Failed to purchase phone number:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
