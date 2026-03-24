import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq, desc, ilike, or, sql, and } from "drizzle-orm";
import { getOrgId } from "@/lib/auth";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);
    const url = new URL(request.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "25")));
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const offset = (page - 1) * limit;

    const conditions = [eq(leads.orgId, orgId)];

    if (search) {
      // Escape LIKE special characters to prevent pattern injection
      const escapedSearch = search.replace(/[%_\\]/g, "\\$&");
      conditions.push(
        or(
          ilike(leads.firstName, `%${escapedSearch}%`),
          ilike(leads.lastName, `%${escapedSearch}%`),
          ilike(leads.email, `%${escapedSearch}%`),
          ilike(leads.phone, `%${escapedSearch}%`),
          ilike(leads.company, `%${escapedSearch}%`),
          ilike(leads.telegramUsername, `%${escapedSearch}%`),
        )!
      );
    }

    if (status && status !== "all") {
      conditions.push(eq(leads.status, status as "new" | "contacted" | "qualified" | "converted" | "rejected"));
    }

    const whereClause = and(...conditions);

    const [rows, countResult] = await Promise.all([
      db
        .select()
        .from(leads)
        .where(whereClause)
        .orderBy(desc(leads.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(leads)
        .where(whereClause),
    ]);

    const total = Number(countResult[0].count);

    return Response.json({
      leads: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);
    const body = await request.json();
    const { firstName, lastName, phone, email, telegramUsername, company, timezone } = body;

    if (!firstName && !lastName && !phone && !email && !telegramUsername) {
      return Response.json({ error: "At least one contact field is required" }, { status: 400 });
    }

    const [row] = await db
      .insert(leads)
      .values({
        orgId,
        firstName: firstName || null,
        lastName: lastName || null,
        phone: phone || null,
        email: email || null,
        telegramUsername: telegramUsername || null,
        company: company || null,
        timezone: timezone || null,
      })
      .returning();

    return Response.json(row, { status: 201 });
  } catch (error) {
    console.error("Failed to create lead:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
