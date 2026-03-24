import { db } from "@/db";
import { users, callLogs, messages, organizations } from "@/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";

const PLAN_LIMITS: Record<
  string,
  { minutes: number; telegram: number; emails: number }
> = {
  free: { minutes: 0, telegram: 0, emails: 0 },
  starter: { minutes: 500, telegram: 100, emails: 500 },
  growth: { minutes: 2000, telegram: 500, emails: 2000 },
  enterprise: { minutes: 999999, telegram: 999999, emails: 999999 },
};

export interface UsageCheckResult {
  allowed: boolean;
  reason?: string;
  usage: { minutes: number; telegram: number; emails: number };
  limits: { minutes: number; telegram: number; emails: number };
}

export async function checkUsageLimits(
  orgId: string
): Promise<UsageCheckResult> {
  // Find org owner to get their plan
  const [org] = await db
    .select({ ownerId: organizations.ownerId })
    .from(organizations)
    .where(eq(organizations.id, orgId))
    .limit(1);

  if (!org) {
    return {
      allowed: false,
      reason: "Organization not found",
      usage: { minutes: 0, telegram: 0, emails: 0 },
      limits: PLAN_LIMITS.free,
    };
  }

  const [user] = await db
    .select({ plan: users.plan })
    .from(users)
    .where(eq(users.id, org.ownerId))
    .limit(1);

  const plan = user?.plan || "free";
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  // Current month start
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Voice minutes (duration in seconds)
  const [minutesResult] = await db
    .select({
      total: sql<number>`coalesce(sum(${callLogs.duration}), 0)::int`,
    })
    .from(callLogs)
    .where(
      and(eq(callLogs.orgId, orgId), gte(callLogs.startedAt, monthStart))
    );
  const minutes = Math.ceil((minutesResult?.total || 0) / 60);

  // Telegram messages
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
  const telegram = telegramResult?.count || 0;

  // Email messages
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

  const usage = { minutes, telegram, emails };

  // Check limits
  if (minutes >= limits.minutes) {
    return {
      allowed: false,
      reason: `Voice minutes limit reached (${minutes}/${limits.minutes})`,
      usage,
      limits,
    };
  }
  if (telegram >= limits.telegram) {
    return {
      allowed: false,
      reason: `Telegram message limit reached (${telegram}/${limits.telegram})`,
      usage,
      limits,
    };
  }
  if (emails >= limits.emails) {
    return {
      allowed: false,
      reason: `Email limit reached (${emails}/${limits.emails})`,
      usage,
      limits,
    };
  }

  return { allowed: true, usage, limits };
}
