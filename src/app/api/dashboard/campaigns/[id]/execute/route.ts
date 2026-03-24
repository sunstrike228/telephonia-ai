import { auth } from "@clerk/nextjs/server";
import { getOrgId } from "@/lib/auth";
import { executeCampaign } from "@/lib/campaign-executor";
import { db } from "@/db";
import { campaigns, leads } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function POST(
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

    // Verify campaign exists and belongs to org
    const [campaign] = await db
      .select({
        id: campaigns.id,
        status: campaigns.status,
      })
      .from(campaigns)
      .where(and(eq(campaigns.id, id), eq(campaigns.orgId, orgId)))
      .limit(1);

    if (!campaign) {
      return Response.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (campaign.status === "active") {
      return Response.json(
        { error: "Campaign is already running" },
        { status: 400 }
      );
    }

    if (campaign.status === "completed") {
      return Response.json(
        { error: "Campaign is already completed" },
        { status: 400 }
      );
    }

    // Check campaign has assigned leads
    const [leadCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(leads)
      .where(and(eq(leads.campaignId, id), eq(leads.orgId, orgId)));

    if (Number(leadCount.count) === 0) {
      return Response.json(
        { error: "No leads assigned to this campaign. Assign leads first." },
        { status: 400 }
      );
    }

    // Execute the campaign (runs synchronously for now)
    const progress = await executeCampaign(id, orgId);

    return Response.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error("Failed to execute campaign:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return Response.json({ error: message }, { status: 500 });
  }
}
