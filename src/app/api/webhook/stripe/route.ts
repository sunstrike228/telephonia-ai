import Stripe from "stripe";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

const PRICE_TO_PLAN: Record<string, "starter" | "growth" | "enterprise"> = {
  price_starter_monthly_40: "starter",
  price_growth_monthly_99: "growth",
  price_enterprise_monthly_299: "enterprise",
};

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.planId as
          | "starter"
          | "growth"
          | "enterprise"
          | undefined;

        if (userId && planId) {
          await db
            .update(users)
            .set({
              plan: planId,
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: session.subscription as string,
            })
            .where(eq(users.id, userId));
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        // Find user by Stripe customer ID
        const [user] = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .limit(1);

        if (user) {
          const priceId = subscription.items.data[0]?.price?.id;
          const plan = priceId ? PRICE_TO_PLAN[priceId] : undefined;

          const updateData: Record<string, unknown> = {
            stripeSubscriptionId: subscription.id,
          };
          if (plan) {
            updateData.plan = plan;
          }
          if (
            subscription.status === "canceled" ||
            subscription.status === "unpaid"
          ) {
            updateData.plan = "free";
            updateData.stripeSubscriptionId = null;
          }

          await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, user.id));
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId =
          typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

        const [user] = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.stripeCustomerId, customerId))
          .limit(1);

        if (user) {
          await db
            .update(users)
            .set({
              plan: "free",
              stripeSubscriptionId: null,
            })
            .where(eq(users.id, user.id));
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string"
            ? invoice.customer
            : invoice.customer?.id;

        if (customerId) {
          console.error(
            `Payment failed for customer ${customerId}, invoice ${invoice.id}`
          );
          // Optionally downgrade after repeated failures
          // For now just log it — Stripe will retry
        }
        break;
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
