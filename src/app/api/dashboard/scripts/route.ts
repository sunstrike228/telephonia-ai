import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { scripts, organizations, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

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

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);
    const rows = await db
      .select()
      .from(scripts)
      .where(eq(scripts.orgId, orgId))
      .orderBy(desc(scripts.updatedAt));

    return Response.json(rows);
  } catch (error) {
    console.error("Failed to fetch scripts:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, content, objectionHandlers } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    const orgId = await getOrgId(userId);

    const [row] = await db
      .insert(scripts)
      .values({
        orgId,
        name: name.trim(),
        content: content || "",
        objectionHandlers: objectionHandlers || [],
      })
      .returning();

    return Response.json(row, { status: 201 });
  } catch (error) {
    console.error("Failed to create script:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
