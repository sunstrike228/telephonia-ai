import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { scripts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getOrgId } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const orgId = await getOrgId(userId);

    const [row] = await db
      .select()
      .from(scripts)
      .where(and(eq(scripts.id, id), eq(scripts.orgId, orgId)))
      .limit(1);

    if (!row) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(row);
  } catch (error) {
    console.error("Failed to fetch script:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const orgId = await getOrgId(userId);

    const body = await request.json();
    const { name, content, objectionHandlers } = body;

    if (name !== undefined && (typeof name !== "string" || name.trim().length === 0)) {
      return Response.json({ error: "Name cannot be empty" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (name !== undefined) updateData.name = name.trim();
    if (content !== undefined) updateData.content = content;
    if (objectionHandlers !== undefined) updateData.objectionHandlers = objectionHandlers;

    const [row] = await db
      .update(scripts)
      .set(updateData)
      .where(and(eq(scripts.id, id), eq(scripts.orgId, orgId)))
      .returning();

    if (!row) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(row);
  } catch (error) {
    console.error("Failed to update script:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const orgId = await getOrgId(userId);

    const [row] = await db
      .delete(scripts)
      .where(and(eq(scripts.id, id), eq(scripts.orgId, orgId)))
      .returning();

    if (!row) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete script:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
