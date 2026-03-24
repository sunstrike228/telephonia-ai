import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { telegramAccounts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getOrgId } from "@/lib/auth";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);

    const accounts = await db
      .select({
        id: telegramAccounts.id,
        phone: telegramAccounts.phone,
        username: telegramAccounts.username,
        displayName: telegramAccounts.displayName,
        status: telegramAccounts.status,
        dailyMessageCount: telegramAccounts.dailyMessageCount,
        maxDailyMessages: telegramAccounts.maxDailyMessages,
        lastMessageAt: telegramAccounts.lastMessageAt,
        createdAt: telegramAccounts.createdAt,
      })
      .from(telegramAccounts)
      .where(eq(telegramAccounts.assignedOrgId, orgId))
      .orderBy(desc(telegramAccounts.createdAt));

    return Response.json({ accounts });
  } catch (error) {
    console.error("Failed to fetch telegram accounts:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
