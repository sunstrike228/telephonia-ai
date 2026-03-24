import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { leads, campaigns } from "@/db/schema";
import { eq, and, inArray, sql, desc } from "drizzle-orm";
import { getOrgId } from "@/lib/auth";

export async function GET(
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

    // Verify campaign belongs to org
    const [campaign] = await db
      .select({ id: campaigns.id })
      .from(campaigns)
      .where(and(eq(campaigns.id, id), eq(campaigns.orgId, orgId)))
      .limit(1);

    if (!campaign) {
      return Response.json({ error: "Campaign not found" }, { status: 404 });
    }

    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "100")));
    const offset = (page - 1) * limit;

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(leads)
        .where(and(eq(leads.campaignId, id), eq(leads.orgId, orgId)))
        .orderBy(desc(leads.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(leads)
        .where(and(eq(leads.campaignId, id), eq(leads.orgId, orgId))),
    ]);

    return Response.json({
      leads: rows,
      total: Number(countResult[0].count),
    });
  } catch (error) {
    console.error("Failed to fetch campaign leads:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
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

    // Verify campaign belongs to org
    const [campaign] = await db
      .select({ id: campaigns.id })
      .from(campaigns)
      .where(and(eq(campaigns.id, id), eq(campaigns.orgId, orgId)))
      .limit(1);

    if (!campaign) {
      return Response.json({ error: "Campaign not found" }, { status: 404 });
    }

    const body = await request.json();
    const { leadIds } = body;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return Response.json(
        { error: "leadIds must be a non-empty array" },
        { status: 400 }
      );
    }

    // Only assign leads that belong to this org and are not already assigned to another campaign
    const assignable = await db
      .select({ id: leads.id })
      .from(leads)
      .where(
        and(
          eq(leads.orgId, orgId),
          inArray(leads.id, leadIds)
        )
      );

    const assignableIds = assignable.map((l) => l.id);

    if (assignableIds.length === 0) {
      return Response.json(
        { error: "No valid leads found to assign" },
        { status: 400 }
      );
    }

    // Assign leads to campaign
    await db
      .update(leads)
      .set({ campaignId: id })
      .where(
        and(eq(leads.orgId, orgId), inArray(leads.id, assignableIds))
      );

    return Response.json({
      success: true,
      assigned: assignableIds.length,
    });
  } catch (error) {
    console.error("Failed to assign leads:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
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

    // Verify campaign belongs to org
    const [campaign] = await db
      .select({ id: campaigns.id })
      .from(campaigns)
      .where(and(eq(campaigns.id, id), eq(campaigns.orgId, orgId)))
      .limit(1);

    if (!campaign) {
      return Response.json({ error: "Campaign not found" }, { status: 404 });
    }

    const body = await request.json();
    const { leadIds } = body;

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return Response.json(
        { error: "leadIds must be a non-empty array" },
        { status: 400 }
      );
    }

    // Remove campaign assignment (set campaignId to null)
    await db
      .update(leads)
      .set({ campaignId: null })
      .where(
        and(
          eq(leads.orgId, orgId),
          eq(leads.campaignId, id),
          inArray(leads.id, leadIds)
        )
      );

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to remove leads:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
