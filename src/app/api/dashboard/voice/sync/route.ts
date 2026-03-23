import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { voiceConfigs, scripts, organizations, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

async function getOrgId(userId: string) {
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

const RAILWAY_URL = process.env.RAILWAY_VOICE_AGENT_URL || "https://telephonia-voice-agent-production.up.railway.app";

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);

    // Get voice config
    const voiceRows = await db
      .select()
      .from(voiceConfigs)
      .where(eq(voiceConfigs.orgId, orgId))
      .limit(1);

    const voiceConfig = voiceRows[0] || null;

    // Get the most recent (or default) script
    const scriptRows = await db
      .select()
      .from(scripts)
      .where(eq(scripts.orgId, orgId))
      .orderBy(desc(scripts.updatedAt))
      .limit(1);

    const activeScript = scriptRows[0] || null;

    // Build payload for Railway voice agent
    const payload = {
      script: activeScript?.content || "",
      objectionHandlers: Array.isArray(activeScript?.objectionHandlers)
        ? activeScript.objectionHandlers
        : [],
      voiceId: voiceConfig?.voiceId || "olena",
      language: voiceConfig?.language || "uk",
      personality: voiceConfig?.personality || "professional",
    };

    // Send to Railway
    const railwayRes = await fetch(`${RAILWAY_URL}/api/config`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!railwayRes.ok) {
      const errText = await railwayRes.text();
      console.error("Railway sync failed:", railwayRes.status, errText);
      return Response.json(
        { error: "Failed to sync with voice agent", details: errText },
        { status: 502 }
      );
    }

    const result = await railwayRes.json().catch(() => ({}));

    return Response.json({ success: true, synced: payload, agentResponse: result });
  } catch (error) {
    console.error("Failed to sync voice config:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
