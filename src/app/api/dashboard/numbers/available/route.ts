import { auth } from "@clerk/nextjs/server";
import { getOrgId } from "@/lib/auth";
import Twilio from "twilio";

function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  return Twilio(sid, token);
}

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Validate org access
    await getOrgId(userId);

    const client = getTwilioClient();
    if (!client) {
      return Response.json(
        { error: "Twilio is not configured. Please add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN." },
        { status: 400 }
      );
    }

    const url = new URL(request.url);
    const country = url.searchParams.get("country") || "US";
    const areaCode = url.searchParams.get("areaCode") || undefined;

    const params: { limit: number; areaCode?: number } = { limit: 20 };
    if (areaCode) {
      params.areaCode = parseInt(areaCode, 10);
    }

    const available = await client
      .availablePhoneNumbers(country)
      .local.list(params);

    const numbers = available.map((n) => ({
      phoneNumber: n.phoneNumber,
      friendlyName: n.friendlyName,
      locality: n.locality,
      region: n.region,
      capabilities: {
        voice: n.capabilities.voice,
        sms: n.capabilities.sms,
        mms: n.capabilities.mms,
      },
    }));

    return Response.json({ numbers });
  } catch (error) {
    console.error("Failed to search available numbers:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
