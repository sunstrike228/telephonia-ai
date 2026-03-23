import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { campaigns, leads } from "@/db/schema";
import { eq, desc, sql, and } from "drizzle-orm";
import { getOrgId } from "@/lib/auth";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "25")));
    const status = url.searchParams.get("status") || "";
    const offset = (page - 1) * limit;

    const conditions = [eq(campaigns.orgId, orgId)];

    if (status && status !== "all") {
      conditions.push(
        eq(campaigns.status, status as "draft" | "active" | "paused" | "completed")
      );
    }

    const whereClause = and(...conditions);

    // Get campaigns with lead counts
    const rows = await db
      .select({
        id: campaigns.id,
        orgId: campaigns.orgId,
        name: campaigns.name,
        scriptId: campaigns.scriptId,
        voiceConfigId: campaigns.voiceConfigId,
        status: campaigns.status,
        channels: campaigns.channels,
        channelPriority: campaigns.channelPriority,
        scheduledAt: campaigns.scheduledAt,
        settings: campaigns.settings,
        createdAt: campaigns.createdAt,
        updatedAt: campaigns.updatedAt,
        leadCount: sql<number>`(SELECT count(*) FROM leads WHERE leads.campaign_id = ${campaigns.id})`.as("lead_count"),
      })
      .from(campaigns)
      .where(whereClause)
      .orderBy(desc(campaigns.createdAt))
      .limit(limit)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(campaigns)
      .where(whereClause);

    const total = Number(countResult.count);

    return Response.json({
      campaigns: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
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
    const { name, scriptId, channels, channelPriority, scheduledAt, settings } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    if (channels && !Array.isArray(channels)) {
      return Response.json({ error: "Channels must be an array" }, { status: 400 });
    }

    const validChannels = ["voice", "telegram", "email"];
    if (channels && !channels.every((c: string) => validChannels.includes(c))) {
      return Response.json({ error: "Invalid channel type" }, { status: 400 });
    }

    const [row] = await db
      .insert(campaigns)
      .values({
        orgId,
        name: name.trim(),
        scriptId: scriptId || null,
        channels: channels || ["voice"],
        channelPriority: channelPriority || ["telegram", "voice", "email"],
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        settings: settings || {},
      })
      .returning();

    return Response.json(row, { status: 201 });
  } catch (error) {
    console.error("Failed to create campaign:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
