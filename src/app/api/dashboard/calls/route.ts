import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { callLogs, organizations, users } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

async function getOrgId(userId: string) {
  // Ensure user exists in our DB
  const existingUser = await db.select({ id: users.id }).from(users).where(eq(users.id, userId)).limit(1);
  if (existingUser.length === 0) {
    const clerkUser = await currentUser();
    await db.insert(users).values({
      id: userId,
      email: clerkUser?.emailAddresses?.[0]?.emailAddress || "unknown@email.com",
      name: clerkUser?.firstName || null,
    }).onConflictDoNothing();
  }

  const org = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.ownerId, userId))
    .limit(1);

  if (org.length === 0) {
    const [newOrg] = await db
      .insert(organizations)
      .values({ name: "Personal", ownerId: userId })
      .returning({ id: organizations.id });
    return newOrg.id;
  }

  return org[0].id;
}

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
