import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { organizations, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getOrgId(userId: string): Promise<string> {
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

  // Check for existing org
  const org = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(eq(organizations.ownerId, userId))
    .limit(1);

  if (org.length > 0) {
    return org[0].id;
  }

  // Create new org - re-check after insert to handle race conditions
  // (concurrent requests could both see org.length === 0)
  try {
    const [newOrg] = await db
      .insert(organizations)
      .values({ name: "Personal", ownerId: userId })
      .returning({ id: organizations.id });
    return newOrg.id;
  } catch {
    // Race condition: another request created the org first. Re-fetch.
    const retryOrg = await db
      .select({ id: organizations.id })
      .from(organizations)
      .where(eq(organizations.ownerId, userId))
      .limit(1);
    if (retryOrg.length > 0) {
      return retryOrg[0].id;
    }
    throw new Error("Failed to create or find organization");
  }
}
