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
    const leadId = url.searchParams.get("leadId");

    // Build where conditions
    const conditions = [eq(messages.orgId, orgId), eq(messages.channel, "email")];
    if (leadId) {
      conditions.push(eq(messages.leadId, leadId));
    }

    // Count total
    const [totalRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(messages)
      .where(and(...conditions));

    // Fetch messages (both inbound and outbound for full conversation view)
    const rows = await db
      .select({
        id: messages.id,
        leadId: messages.leadId,
        direction: messages.direction,
        content: messages.content,
        status: messages.status,
        metadata: messages.metadata,
        parentId: messages.parentId,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(and(...conditions))
      .orderBy(desc(messages.createdAt))
      .limit(limit)
      .offset(offset);

    return Response.json({
      messages: rows.map((r) => ({
        id: r.id,
        leadId: r.leadId,
        direction: r.direction,
        content: r.content,
        status: r.status,
        metadata: r.metadata as {
          subject?: string;
          toEmail?: string;
          fromEmail?: string;
          autoReply?: boolean;
        } | null,
        parentId: r.parentId,
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
