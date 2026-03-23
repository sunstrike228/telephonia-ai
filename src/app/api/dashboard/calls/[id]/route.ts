import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { callLogs, organizations } from "@/db/schema";
import { eq, and } from "drizzle-orm";

async function getOrgId(userId: string) {
  const org = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.ownerId, userId))
    .limit(1);

  if (org.length === 0) return null;
  return org[0].id;
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
    if (!orgId) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const [row] = await db
      .select()
      .from(callLogs)
      .where(and(eq(callLogs.id, id), eq(callLogs.orgId, orgId)))
      .limit(1);

    if (!row) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(row);
  } catch (error) {
    console.error("Failed to fetch call:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
