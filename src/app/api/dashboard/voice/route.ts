import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { voiceConfigs, organizations, users } from "@/db/schema";
import { eq } from "drizzle-orm";

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

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);

    const rows = await db
      .select()
      .from(voiceConfigs)
      .where(eq(voiceConfigs.orgId, orgId))
      .limit(1);

    if (rows.length === 0) {
      // Create default config
      const [created] = await db
        .insert(voiceConfigs)
        .values({
          orgId,
          selectedVoices: ["olena"],
          language: "uk",
          personality: "professional",
        })
        .returning();

      return Response.json(created);
    }

    return Response.json(rows[0]);
  } catch (error) {
    console.error("Failed to fetch voice config:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { selectedVoices, language, personality } = body;

    const orgId = await getOrgId(userId);

    // Check if config exists
    const existing = await db
      .select({ id: voiceConfigs.id })
      .from(voiceConfigs)
      .where(eq(voiceConfigs.orgId, orgId))
      .limit(1);

    if (existing.length === 0) {
      // Create new
      const [created] = await db
        .insert(voiceConfigs)
        .values({
          orgId,
          selectedVoices: selectedVoices || ["olena"],
          language: language || "uk",
          personality: personality || "professional",
          voiceId: Array.isArray(selectedVoices) && selectedVoices.length > 0 ? selectedVoices[0] : "olena",
        })
        .returning();

      return Response.json(created);
    }

    // Update existing
    const [updated] = await db
      .update(voiceConfigs)
      .set({
        selectedVoices: selectedVoices || ["olena"],
        language: language || "uk",
        personality: personality || "professional",
        voiceId: Array.isArray(selectedVoices) && selectedVoices.length > 0 ? selectedVoices[0] : "olena",
      })
      .where(eq(voiceConfigs.orgId, orgId))
      .returning();

    return Response.json(updated);
  } catch (error) {
    console.error("Failed to save voice config:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
