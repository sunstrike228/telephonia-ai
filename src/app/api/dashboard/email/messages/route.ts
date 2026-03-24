import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { getOrgId } from "@/lib/auth";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);

    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "50", 10)));
    const offset = (page - 1) * limit;

    // Count total
    const [totalRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(messages)
      .where(and(eq(messages.orgId, orgId), eq(messages.channel, "email")));

    // Fetch messages
    const rows = await db
      .select({
        id: messages.id,
        leadId: messages.leadId,
        content: messages.content,
        status: messages.status,
        metadata: messages.metadata,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(and(eq(messages.orgId, orgId), eq(messages.channel, "email")))
      .orderBy(desc(messages.createdAt))
      .limit(limit)
      .offset(offset);

    return Response.json({
      messages: rows.map((r) => ({
        id: r.id,
        leadId: r.leadId,
        content: r.content,
        status: r.status,
        metadata: r.metadata as { subject?: string; to?: string } | null,
        createdAt: r.createdAt.toISOString(),
      })),
      total: totalRow.count,
      page,
      limit,
    });
  } catch (error) {
    console.error("Failed to fetch email messages:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
