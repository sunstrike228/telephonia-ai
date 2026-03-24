import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Stripe from "stripe";

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
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user || !user.stripeCustomerId) {
      return Response.json(
        { error: "No active subscription found. Please subscribe first." },
        { status: 400 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const origin =
      request.headers.get("origin") || "https://telephonia.ai";

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${origin}/dashboard/billing`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("Portal error:", error);
    return Response.json({ error: "Failed to create portal session" }, { status: 500 });
  }
}
