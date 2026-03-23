import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { channelConfigs } from "@/db/schema";
import { getOrgId } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);

    const configs = await db
      .select()
      .from(channelConfigs)
      .where(eq(channelConfigs.orgId, orgId));

    return Response.json({ configs });
  } catch (error) {
    console.error("Failed to fetch channel configs:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);
    const body = await request.json();
    const { channel, config } = body;

    if (!channel || !config) {
      return Response.json(
        { error: "Missing required fields: channel, config" },
        { status: 400 }
      );
    }

    // Check if config exists for this org + channel
    const existing = await db
      .select({ id: channelConfigs.id })
      .from(channelConfigs)
      .where(
        and(
          eq(channelConfigs.orgId, orgId),
          eq(channelConfigs.channel, channel)
        )
      )
      .limit(1);

    if (existing.length === 0) {
      // Insert new
      const [created] = await db
        .insert(channelConfigs)
        .values({
          orgId,
          channel,
          config,
          status: "active",
        })
        .returning();

      return Response.json(created);
    }

    // Update existing
    const [updated] = await db
      .update(channelConfigs)
      .set({ config })
      .where(
        and(
          eq(channelConfigs.orgId, orgId),
          eq(channelConfigs.channel, channel)
        )
      )
      .returning();

    return Response.json(updated);
  } catch (error) {
    console.error("Failed to save channel config:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
