import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getOrgId } from "@/lib/auth";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await getOrgId(userId);

    const rows = await db
      .select({ onboardingDone: users.onboardingDone })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const onboardingDone = rows.length > 0 ? rows[0].onboardingDone : false;

    return Response.json({ onboardingDone });
  } catch (error) {
    console.error("Failed to fetch onboarding status:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await getOrgId(userId);

    await db
      .update(users)
      .set({ onboardingDone: true })
      .where(eq(users.id, userId));

    return Response.json({ success: true, onboardingDone: true });
  } catch (error) {
    console.error("Failed to complete onboarding:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
