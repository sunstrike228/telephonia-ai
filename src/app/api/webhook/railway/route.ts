import { db } from "@/db";
import { callLogs, organizations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get("authorization");
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (!webhookSecret || authHeader !== `Bearer ${webhookSecret}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      orgId,
      direction,
      fromNumber,
      toNumber,
      duration,
      status,
      transcript,
      summary,
      sentiment,
    } = body;

    // Validate required fields
    if (!orgId || !direction) {
      return Response.json(
        { error: "Missing required fields: orgId, direction" },
        { status: 400 }
      );
    }

    // Validate orgId exists
    const [org] = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.id, orgId))
      .limit(1);

    if (!org) {
      return Response.json({ error: "Organization not found" }, { status: 404 });
    }

    // Validate direction
    if (!["inbound", "outbound"].includes(direction)) {
      return Response.json(
        { error: "Invalid direction. Must be 'inbound' or 'outbound'" },
        { status: 400 }
      );
    }

    // Validate sentiment if provided
    const validSentiments = ["positive", "negative", "neutral"];
    const callSentiment = sentiment && validSentiments.includes(sentiment) ? sentiment : null;

    // Validate status if provided
    const validStatuses = ["completed", "failed", "no_answer", "voicemail", "busy", "in_progress"];
    const callStatus = status && validStatuses.includes(status) ? status : "completed";

    // Build flat transcription text from transcript array
    let transcriptionText = "";
    if (Array.isArray(transcript)) {
      transcriptionText = transcript
        .map((msg: { role: string; content: string }) => `${msg.role}: ${msg.content}`)
        .join("\n");
    }

    const now = new Date();
    const startedAt = duration ? new Date(now.getTime() - duration * 1000) : now;

    const [row] = await db
      .insert(callLogs)
      .values({
        orgId,
        direction,
        fromNumber: fromNumber || null,
        toNumber: toNumber || null,
        duration: typeof duration === "number" ? duration : null,
        status: callStatus,
        startedAt,
        endedAt: now,
        transcript: Array.isArray(transcript) ? transcript : [],
        transcription: transcriptionText || null,
        summary: summary || null,
        sentiment: callSentiment,
      })
      .returning({ id: callLogs.id });

    return Response.json({ success: true, callId: row.id }, { status: 201 });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
