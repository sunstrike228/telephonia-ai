import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users, callLogs, messages } from "@/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { getOrgId } from "@/lib/auth";

const PLAN_LIMITS: Record<
  string,
  { minutes: number; telegram: number; emails: number }
> = {
  free: { minutes: 0, telegram: 0, emails: 0 },
  starter: { minutes: 500, telegram: 100, emails: 500 },
  growth: { minutes: 2000, telegram: 500, emails: 2000 },
  enterprise: { minutes: 999999, telegram: 999999, emails: 999999 },
};

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);

    // Get user plan
    const [user] = await db
      .select({ plan: users.plan })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const plan = user?.plan || "free";

    // Current month start
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Voice minutes this month (from call_logs, duration in seconds)
    const [minutesResult] = await db
      .select({
        total: sql<number>`coalesce(sum(${callLogs.duration}), 0)::int`,
      })
      .from(callLogs)
      .where(
        and(eq(callLogs.orgId, orgId), gte(callLogs.startedAt, monthStart))
      );
    const minutes = Math.ceil((minutesResult?.total || 0) / 60);

    // Telegram messages this month
    const [telegramResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(messages)
      .where(
        and(
          eq(messages.orgId, orgId),
          eq(messages.channel, "telegram"),
          gte(messages.createdAt, monthStart)
        )
      );
    const telegramMessages = telegramResult?.count || 0;

    // Email messages this month
    const [emailResult] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(messages)
      .where(
        and(
          eq(messages.orgId, orgId),
          eq(messages.channel, "email"),
          gte(messages.createdAt, monthStart)
        )
      );
    const emails = emailResult?.count || 0;

    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

    return Response.json({
      minutes,
      telegramMessages,
      emails,
      plan,
      limits,
    });
  } catch (error) {
    console.error("Usage fetch error:", error);
    return Response.json({ error: "Failed to fetch usage" }, { status: 500 });
  }
}
