import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { campaigns } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getOrgId } from "@/lib/auth";

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
    const [existing] = await db
      .select({ id: campaigns.id, status: campaigns.status })
      .from(campaigns)
      .where(and(eq(campaigns.id, id), eq(campaigns.orgId, orgId)))
      .limit(1);

    if (!existing) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    if (existing.status !== "active") {
      return Response.json({ error: "Campaign is not active" }, { status: 400 });
    }

    const [row] = await db
      .update(campaigns)
      .set({ status: "paused", updatedAt: new Date() })
      .where(and(eq(campaigns.id, id), eq(campaigns.orgId, orgId)))
      .returning();

    return Response.json(row);
  } catch (error) {
    console.error("Failed to pause campaign:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
