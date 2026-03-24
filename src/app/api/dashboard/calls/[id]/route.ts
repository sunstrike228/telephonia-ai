import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { callLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";
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
