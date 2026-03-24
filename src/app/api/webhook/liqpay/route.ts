import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifySignature, decodeData } from "@/lib/liqpay";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data = formData.get("data") as string;
    const signature = formData.get("signature") as string;

    if (!data || !signature) {
      return Response.json(
        { error: "Missing data or signature" },
        { status: 400 }
      );
    }

    // Verify signature
    if (!verifySignature(data, signature)) {
      console.error("LiqPay webhook: invalid signature");
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = decodeData(data) as {
      status: string;
      order_id: string;
      amount: number;
      currency: string;
      action: string;
      payment_id: number;
      description: string;
    };

    console.log("LiqPay webhook received:", payload.status, payload.order_id);

    // Parse order_id: liqpay_{userId}_{planId}_{timestamp}
    const orderParts = payload.order_id.split("_");
    if (orderParts.length < 4 || orderParts[0] !== "liqpay") {
      console.error("LiqPay webhook: invalid order_id format:", payload.order_id);
      return Response.json({ error: "Invalid order_id" }, { status: 400 });
    }

    // userId may contain underscores (e.g., user_2abc...) so we need to handle that
    // Format: liqpay_{userId}_{planId}_{timestamp}
    // planId is one of: starter, growth, enterprise
    // timestamp is a number
    // So we parse from the end
    const timestamp = orderParts[orderParts.length - 1];
    const planId = orderParts[orderParts.length - 2] as
      | "starter"
      | "growth"
      | "enterprise";
    const userId = orderParts.slice(1, orderParts.length - 2).join("_");

    if (!userId || !["starter", "growth", "enterprise"].includes(planId)) {
      console.error("LiqPay webhook: could not parse order_id:", payload.order_id);
      return Response.json({ error: "Invalid order data" }, { status: 400 });
    }

    // Handle different statuses
    // https://www.liqpay.ua/documentation/api/callback
    switch (payload.status) {
      case "subscribed":
      case "success": {
        // Activate subscription
        await db
          .update(users)
          .set({
            plan: planId,
          })
          .where(eq(users.id, userId));

        console.log(
          `LiqPay: User ${userId} upgraded to ${planId} (payment ${payload.payment_id})`
        );
        break;
      }

      case "failure":
      case "error": {
        console.error(
          `LiqPay: Payment failed for user ${userId}, order ${payload.order_id}`
        );
        break;
      }

      case "reversed": {
        // Payment reversed — downgrade to free
        await db
          .update(users)
          .set({ plan: "free" })
          .where(eq(users.id, userId));

        console.log(`LiqPay: Payment reversed for user ${userId}, downgraded to free`);
        break;
      }

      case "unsubscribed": {
        // Subscription canceled
        await db
          .update(users)
          .set({ plan: "free" })
          .where(eq(users.id, userId));

        console.log(`LiqPay: User ${userId} unsubscribed, downgraded to free`);
        break;
      }

      default: {
        console.log(`LiqPay: Unhandled status "${payload.status}" for order ${payload.order_id}`);
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("LiqPay webhook error:", error);
    return Response.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
