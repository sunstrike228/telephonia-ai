import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { campaigns, leads } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { getOrgId } from "@/lib/auth";

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
      })
      .from(campaigns)
      .where(and(eq(campaigns.id, id), eq(campaigns.orgId, orgId)))
      .limit(1);

    if (!row) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    // Get lead stats
    const [leadStats] = await db
      .select({
        total: sql<number>`count(*)`,
        contacted: sql<number>`count(*) filter (where ${leads.status} = 'contacted')`,
        qualified: sql<number>`count(*) filter (where ${leads.status} = 'qualified')`,
        converted: sql<number>`count(*) filter (where ${leads.status} = 'converted')`,
        rejected: sql<number>`count(*) filter (where ${leads.status} = 'rejected')`,
      })
      .from(leads)
      .where(eq(leads.campaignId, id));

    return Response.json({
      ...row,
      stats: {
        total: Number(leadStats.total),
        contacted: Number(leadStats.contacted),
        qualified: Number(leadStats.qualified),
        converted: Number(leadStats.converted),
        rejected: Number(leadStats.rejected),
      },
    });
  } catch (error) {
    console.error("Failed to fetch campaign:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
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
    const { name, status, channels, channelPriority, scheduledAt, settings } = body;

    if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
      return Response.json({ error: "Name cannot be empty" }, { status: 400 });
    }

    if (status !== undefined) {
      const validStatuses = ["draft", "active", "paused", "completed"];
      if (!validStatuses.includes(status)) {
        return Response.json({ error: "Invalid status" }, { status: 400 });
      }
    }

    if (channels !== undefined) {
      const validChannels = ["voice", "telegram", "email"];
      if (!Array.isArray(channels) || !channels.every((c: string) => validChannels.includes(c))) {
        return Response.json({ error: "Invalid channels" }, { status: 400 });
      }
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name.trim();
    if (status !== undefined) updateData.status = status;
    if (channels !== undefined) updateData.channels = channels;
    if (channelPriority !== undefined) updateData.channelPriority = channelPriority;
    if (scheduledAt !== undefined) updateData.scheduledAt = scheduledAt ? new Date(scheduledAt) : null;
    if (settings !== undefined) updateData.settings = settings;

    const [row] = await db
      .update(campaigns)
      .set(updateData)
      .where(and(eq(campaigns.id, id), eq(campaigns.orgId, orgId)))
      .returning();

    if (!row) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(row);
  } catch (error) {
    console.error("Failed to update campaign:", error);
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

    const [row] = await db
      .delete(campaigns)
      .where(and(eq(campaigns.id, id), eq(campaigns.orgId, orgId)))
      .returning();

    if (!row) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete campaign:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
