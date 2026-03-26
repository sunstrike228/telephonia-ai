import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getOrgId } from "@/lib/auth";
import { createPaymentData, isLiqPayConfigured } from "@/lib/liqpay";

const PLAN_PRICES_UAH: Record<string, number> = {
  starter: 1650,
  growth: 4100,
  enterprise: 12300,
};

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isLiqPayConfigured()) {
    return Response.json(
      { error: "LiqPay is not configured." },
      { status: 503 }
    );
  }

  try {
    const { planId } = (await request.json()) as { planId: string };

    if (!planId || !PLAN_PRICES_UAH[planId]) {
      return Response.json(
        { error: "Invalid plan. Choose starter, growth, or enterprise." },
        { status: 400 }
      );
    }

    const orgId = await getOrgId(userId);

    // Verify user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const amount = PLAN_PRICES_UAH[planId];
    const origin = request.headers.get("origin") || "https://projectnoir.xyz";
    const orderId = `liqpay_${userId}_${planId}_${Date.now()}`;

    const { data, signature } = createPaymentData({
      planId,
      amount,
      orderId,
      description: `Project Noir ${planId} plan subscription`,
      resultUrl: `${origin}/dashboard/billing?success=true`,
      serverUrl: `${origin}/api/webhook/liqpay`,
    });

    // Store order metadata so webhook can map it back
    // We encode userId, orgId, planId in the order_id itself
    // Format: liqpay_{userId}_{planId}_{timestamp}

    return Response.json({ data, signature, orderId });
  } catch (error) {
    console.error("LiqPay checkout error:", error);
    return Response.json(
      { error: "Failed to create LiqPay payment" },
      { status: 500 }
    );
  }
}
