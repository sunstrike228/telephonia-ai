import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { callLogs, messages, campaigns, leads } from "@/db/schema";
import { eq, desc, sql, and, gte } from "drizzle-orm";
import { getOrgId } from "@/lib/auth";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // --- Total calls ---
    const [callTotal] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(callLogs)
      .where(eq(callLogs.orgId, orgId));

    // --- Calls by status ---
    const callsByStatus = await db
      .select({
        status: callLogs.status,
        count: sql<number>`count(*)::int`,
      })
      .from(callLogs)
      .where(eq(callLogs.orgId, orgId))
      .groupBy(callLogs.status);

    // --- Average call duration ---
    const [avgDuration] = await db
      .select({ avg: sql<number>`coalesce(avg(${callLogs.duration}), 0)::int` })
      .from(callLogs)
      .where(and(eq(callLogs.orgId, orgId), eq(callLogs.status, "completed")));

    // --- Total messages by channel ---
    const messagesByChannel = await db
      .select({
        channel: messages.channel,
        count: sql<number>`count(*)::int`,
      })
      .from(messages)
      .where(eq(messages.orgId, orgId))
      .groupBy(messages.channel);

    // --- Messages by status (per channel) ---
    const messagesByStatusChannel = await db
      .select({
        channel: messages.channel,
        status: messages.status,
        count: sql<number>`count(*)::int`,
      })
      .from(messages)
      .where(eq(messages.orgId, orgId))
      .groupBy(messages.channel, messages.status);

    // --- Activity over last 7 days by channel ---
    const callActivity = await db
      .select({
        day: sql<string>`to_char(${callLogs.startedAt}, 'YYYY-MM-DD')`,
        count: sql<number>`count(*)::int`,
      })
      .from(callLogs)
      .where(and(eq(callLogs.orgId, orgId), gte(callLogs.startedAt, sevenDaysAgo)))
      .groupBy(sql`to_char(${callLogs.startedAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${callLogs.startedAt}, 'YYYY-MM-DD')`);

    const telegramActivity = await db
      .select({
        day: sql<string>`to_char(${messages.createdAt}, 'YYYY-MM-DD')`,
        count: sql<number>`count(*)::int`,
      })
      .from(messages)
      .where(and(eq(messages.orgId, orgId), eq(messages.channel, "telegram"), gte(messages.createdAt, sevenDaysAgo)))
      .groupBy(sql`to_char(${messages.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${messages.createdAt}, 'YYYY-MM-DD')`);

    const emailActivity = await db
      .select({
        day: sql<string>`to_char(${messages.createdAt}, 'YYYY-MM-DD')`,
        count: sql<number>`count(*)::int`,
      })
      .from(messages)
      .where(and(eq(messages.orgId, orgId), eq(messages.channel, "email"), gte(messages.createdAt, sevenDaysAgo)))
      .groupBy(sql`to_char(${messages.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${messages.createdAt}, 'YYYY-MM-DD')`);

    // --- Top campaigns by contacts reached ---
    const topCampaigns = await db
      .select({
        id: campaigns.id,
        name: campaigns.name,
        channels: campaigns.channels,
        status: campaigns.status,
      })
      .from(campaigns)
      .where(eq(campaigns.orgId, orgId))
      .orderBy(desc(campaigns.createdAt))
      .limit(10);

    // For each campaign, get contacts reached and response info
    const campaignStats = await Promise.all(
      topCampaigns.map(async (c) => {
        const [callCount] = await db
          .select({ count: sql<number>`count(distinct ${callLogs.leadId})::int` })
          .from(callLogs)
          .where(and(eq(callLogs.orgId, orgId), eq(callLogs.campaignId, c.id)));

        const [msgCount] = await db
          .select({ count: sql<number>`count(distinct ${messages.leadId})::int` })
          .from(messages)
          .where(and(eq(messages.orgId, orgId), eq(messages.campaignId, c.id)));

        const [repliedCount] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(messages)
          .where(and(
            eq(messages.orgId, orgId),
            eq(messages.campaignId, c.id),
            eq(messages.status, "replied")
          ));

        const [completedCalls] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(callLogs)
          .where(and(
            eq(callLogs.orgId, orgId),
            eq(callLogs.campaignId, c.id),
            eq(callLogs.status, "completed")
          ));

        const totalReached = (callCount?.count || 0) + (msgCount?.count || 0);
        const totalResponses = (repliedCount?.count || 0) + (completedCalls?.count || 0);

        return {
          id: c.id,
          name: c.name,
          channels: c.channels,
          status: c.status,
          contactsReached: totalReached,
          responseRate: totalReached > 0 ? Math.round((totalResponses / totalReached) * 100) : 0,
        };
      })
    );

    // Sort by contacts reached descending
    campaignStats.sort((a, b) => b.contactsReached - a.contactsReached);

    // --- Lead status breakdown ---
    const leadStatuses = await db
      .select({
        status: leads.status,
        count: sql<number>`count(*)::int`,
      })
      .from(leads)
      .where(eq(leads.orgId, orgId))
      .groupBy(leads.status);

    const [leadsTotal] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(leads)
      .where(eq(leads.orgId, orgId));

    // --- Recent activity (last 10 across channels) ---
    const recentCalls = await db
      .select({
        id: callLogs.id,
        leadId: callLogs.leadId,
        toNumber: callLogs.toNumber,
        status: callLogs.status,
        startedAt: callLogs.startedAt,
        duration: callLogs.duration,
      })
      .from(callLogs)
      .where(eq(callLogs.orgId, orgId))
      .orderBy(desc(callLogs.startedAt))
      .limit(10);

    const recentMessages = await db
      .select({
        id: messages.id,
        leadId: messages.leadId,
        channel: messages.channel,
        status: messages.status,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(eq(messages.orgId, orgId))
      .orderBy(desc(messages.createdAt))
      .limit(10);

    // Resolve lead names for recent activity
    const allLeadIds = [
      ...recentCalls.map((c) => c.leadId).filter(Boolean),
      ...recentMessages.map((m) => m.leadId).filter(Boolean),
    ];
    const uniqueLeadIds = [...new Set(allLeadIds)] as string[];

    let leadMap: Record<string, { firstName: string | null; lastName: string | null; phone: string | null }> = {};
    if (uniqueLeadIds.length > 0) {
      const leadRows = await db
        .select({
          id: leads.id,
          firstName: leads.firstName,
          lastName: leads.lastName,
          phone: leads.phone,
        })
        .from(leads)
        .where(sql`${leads.id} = ANY(${uniqueLeadIds})`);

      for (const l of leadRows) {
        leadMap[l.id] = { firstName: l.firstName, lastName: l.lastName, phone: l.phone };
      }
    }

    // Merge and sort recent activity
    type ActivityItem = {
      id: string;
      channel: "voice" | "telegram" | "email";
      action: string;
      leadName: string;
      leadPhone: string | null;
      time: string;
      linkType: "call" | "message";
    };

    const activity: ActivityItem[] = [
      ...recentCalls.map((c) => {
        const lead = c.leadId ? leadMap[c.leadId] : null;
        return {
          id: c.id,
          channel: "voice" as const,
          action: c.status === "completed" ? "Called" : `Call ${c.status}`,
          leadName: lead ? `${lead.firstName || ""} ${lead.lastName || ""}`.trim() || c.toNumber || "Unknown" : c.toNumber || "Unknown",
          leadPhone: lead?.phone || c.toNumber || null,
          time: c.startedAt.toISOString(),
          linkType: "call" as const,
        };
      }),
      ...recentMessages.map((m) => {
        const lead = leadMap[m.leadId];
        return {
          id: m.id,
          channel: m.channel as "telegram" | "email",
          action: m.channel === "telegram" ? "Sent message" : "Sent email",
          leadName: lead ? `${lead.firstName || ""} ${lead.lastName || ""}`.trim() || "Unknown" : "Unknown",
          leadPhone: lead?.phone || null,
          time: m.createdAt.toISOString(),
          linkType: "message" as const,
        };
      }),
    ];

    activity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
    const recentActivity = activity.slice(0, 10);

    // --- Build activity chart data (last 7 days) ---
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split("T")[0]);
    }

    const callMap: Record<string, number> = {};
    for (const row of callActivity) callMap[row.day] = row.count;
    const telegramMap: Record<string, number> = {};
    for (const row of telegramActivity) telegramMap[row.day] = row.count;
    const emailMap: Record<string, number> = {};
    for (const row of emailActivity) emailMap[row.day] = row.count;

    const activityChart = days.map((day) => ({
      day,
      voice: callMap[day] || 0,
      telegram: telegramMap[day] || 0,
      email: emailMap[day] || 0,
    }));

    // --- Compute channel summaries ---
    const telegramTotal = messagesByChannel.find((m) => m.channel === "telegram")?.count || 0;
    const emailTotal = messagesByChannel.find((m) => m.channel === "email")?.count || 0;

    const telegramStatuses = messagesByStatusChannel.filter((m) => m.channel === "telegram");
    const emailStatuses = messagesByStatusChannel.filter((m) => m.channel === "email");

    const telegramDelivered = telegramStatuses.find((s) => s.status === "delivered")?.count || 0;
    const telegramRead = telegramStatuses.find((s) => s.status === "read")?.count || 0;
    const telegramReplied = telegramStatuses.find((s) => s.status === "replied")?.count || 0;

    const emailDelivered = emailStatuses.find((s) => s.status === "delivered")?.count || 0;
    const emailRead = emailStatuses.find((s) => s.status === "read")?.count || 0;
    const emailReplied = emailStatuses.find((s) => s.status === "replied")?.count || 0;

    const callsCompleted = callsByStatus.find((s) => s.status === "completed")?.count || 0;

    return Response.json({
      voice: {
        total: callTotal.count,
        avgDuration: avgDuration.avg,
        completionRate: callTotal.count > 0 ? Math.round((callsCompleted / callTotal.count) * 100) : 0,
        byStatus: callsByStatus,
      },
      telegram: {
        total: telegramTotal,
        deliveredRate: telegramTotal > 0 ? Math.round(((telegramDelivered + telegramRead + telegramReplied) / telegramTotal) * 100) : 0,
        replyRate: telegramTotal > 0 ? Math.round((telegramReplied / telegramTotal) * 100) : 0,
        byStatus: telegramStatuses,
      },
      email: {
        total: emailTotal,
        openRate: emailTotal > 0 ? Math.round(((emailRead + emailReplied) / emailTotal) * 100) : 0,
        replyRate: emailTotal > 0 ? Math.round((emailReplied / emailTotal) * 100) : 0,
        byStatus: emailStatuses,
      },
      activityChart,
      topCampaigns: campaignStats.slice(0, 5),
      leadStatuses: {
        total: leadsTotal.count,
        breakdown: leadStatuses,
      },
      recentActivity,
    });
  } catch (error) {
    console.error("Failed to fetch analytics:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
