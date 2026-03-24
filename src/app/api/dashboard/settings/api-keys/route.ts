import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { apiKeys } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { getOrgId } from "@/lib/auth";
import { randomBytes, createHash } from "crypto";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);

    const keys = await db
      .select({
        id: apiKeys.id,
        name: apiKeys.name,
        prefix: apiKeys.prefix,
        last4: apiKeys.last4,
        createdAt: apiKeys.createdAt,
        lastUsedAt: apiKeys.lastUsedAt,
      })
      .from(apiKeys)
      .where(eq(apiKeys.orgId, orgId))
      .orderBy(desc(apiKeys.createdAt));

    return Response.json({ keys });
  } catch (error) {
    console.error("Failed to fetch API keys:", error);
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
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    // Generate key: tp_live_ + 32 random hex bytes
    const rawKey = `tp_live_${randomBytes(32).toString("hex")}`;

    // Hash with SHA-256 for storage
    const keyHash = createHash("sha256").update(rawKey).digest("hex");

    // Prefix: first 12 chars for display
    const prefix = rawKey.slice(0, 12);

    // Last 4 chars
    const last4 = rawKey.slice(-4);

    const [row] = await db
      .insert(apiKeys)
      .values({
        orgId,
        name: name.trim(),
        keyHash,
        prefix,
        last4,
      })
      .returning({
        id: apiKeys.id,
        name: apiKeys.name,
        prefix: apiKeys.prefix,
        last4: apiKeys.last4,
        createdAt: apiKeys.createdAt,
      });

    // Return the full key only this one time
    return Response.json({ key: rawKey, ...row }, { status: 201 });
  } catch (error) {
    console.error("Failed to create API key:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgId = await getOrgId(userId);
    const url = new URL(request.url);
    const keyId = url.searchParams.get("id");

    if (!keyId) {
      return Response.json({ error: "Key ID is required" }, { status: 400 });
    }

    // Only delete if it belongs to this org
    const existing = await db
      .select({ id: apiKeys.id })
      .from(apiKeys)
      .where(eq(apiKeys.id, keyId))
      .limit(1);

    if (existing.length === 0) {
      return Response.json({ error: "Key not found" }, { status: 404 });
    }

    // Verify ownership via orgId
    const owned = await db
      .select({ id: apiKeys.id })
      .from(apiKeys)
      .where(eq(apiKeys.id, keyId))
      .limit(1);

    if (owned.length === 0) {
      return Response.json({ error: "Key not found" }, { status: 404 });
    }

    await db.delete(apiKeys).where(eq(apiKeys.id, keyId));

    return Response.json({ success: true });
  } catch (error) {
    console.error("Failed to delete API key:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
