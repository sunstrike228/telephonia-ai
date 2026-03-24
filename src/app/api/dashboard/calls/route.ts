import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { callLogs } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
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
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "50")));
    const offset = (page - 1) * limit;

    const rows = await db
      .select({
        id: callLogs.id,
        direction: callLogs.direction,
        status: callLogs.status,
        fromNumber: callLogs.fromNumber,
        toNumber: callLogs.toNumber,
        duration: callLogs.duration,
        startedAt: callLogs.startedAt,
        summary: callLogs.summary,
        sentiment: callLogs.sentiment,
      })
      .from(callLogs)
      .where(eq(callLogs.orgId, orgId))
      .orderBy(desc(callLogs.startedAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(callLogs)
      .where(eq(callLogs.orgId, orgId));

    return Response.json({
      calls: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch calls:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
