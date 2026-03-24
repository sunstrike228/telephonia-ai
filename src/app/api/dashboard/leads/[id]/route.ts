import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
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
      .from(leads)
      .where(and(eq(leads.id, id), eq(leads.orgId, orgId)))
      .limit(1);

    if (!row) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(row);
  } catch (error) {
    console.error("Failed to fetch lead:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
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
    const { firstName, lastName, phone, email, telegramUsername, company, status, timezone } = body;

    if (status !== undefined) {
      const validStatuses = ["new", "contacted", "qualified", "converted", "rejected"];
      if (!validStatuses.includes(status)) {
        return Response.json({ error: "Invalid status" }, { status: 400 });
      }
    }

    const updateData: Record<string, unknown> = {};
    if (firstName !== undefined) updateData.firstName = firstName || null;
    if (lastName !== undefined) updateData.lastName = lastName || null;
    if (phone !== undefined) updateData.phone = phone || null;
    if (email !== undefined) updateData.email = email || null;
    if (telegramUsername !== undefined) updateData.telegramUsername = telegramUsername || null;
    if (company !== undefined) updateData.company = company || null;
    if (status !== undefined) updateData.status = status;
    if (timezone !== undefined) updateData.timezone = timezone || null;

    if (Object.keys(updateData).length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    const [row] = await db
      .update(leads)
      .set(updateData)
      .where(and(eq(leads.id, id), eq(leads.orgId, orgId)))
      .returning();

    if (!row) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json(row);
  } catch (error) {
    console.error("Failed to update lead:", error);
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
      .delete(leads)
      .where(and(eq(leads.id, id), eq(leads.orgId, orgId)))
      .returning();

    if (!row) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete lead:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
