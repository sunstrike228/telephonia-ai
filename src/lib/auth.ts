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
