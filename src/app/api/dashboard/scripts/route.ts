import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { scripts } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getOrgId } from "@/lib/auth";

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
