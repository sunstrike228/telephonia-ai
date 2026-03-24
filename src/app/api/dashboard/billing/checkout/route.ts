import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getOrgId } from "@/lib/auth";
import Stripe from "stripe";

const PLAN_PRICES: Record<string, { priceId: string; amount: number }> = {
  starter: { priceId: "price_starter_monthly_40", amount: 4000 },
  growth: { priceId: "price_growth_monthly_99", amount: 9900 },
  enterprise: { priceId: "price_enterprise_monthly_299", amount: 29900 },
};

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return Response.json(
      { error: "Stripe is not configured. Set STRIPE_SECRET_KEY." },
      { status: 503 }
    );
  }

  try {
    const { planId } = (await request.json()) as { planId: string };

    if (!planId || !PLAN_PRICES[planId]) {
      return Response.json(
        { error: "Invalid plan. Choose starter, growth, or enterprise." },
        { status: 400 }
      );
    }

    const orgId = await getOrgId(userId);

    // Get user for email and existing Stripe customer
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    // Create or reuse Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId, orgId },
      });
      customerId = customer.id;
      await db
        .update(users)
        .set({ stripeCustomerId: customerId })
        .where(eq(users.id, userId));
    }

    const plan = PLAN_PRICES[planId];
    const origin =
      request.headers.get("origin") || "https://projectnoir.ai";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: `${origin}/dashboard/billing?success=true`,
      cancel_url: `${origin}/dashboard/billing?canceled=true`,
      metadata: { userId, orgId, planId },
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return Response.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
