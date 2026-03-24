import { pgTable, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const planEnum = pgEnum("plan", ["free", "starter", "growth", "enterprise"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email").notNull(),
  name: text("name"),
  plan: planEnum("plan").default("free").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  onboardingDone: boolean("onboarding_done").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
