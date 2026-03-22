import { pgTable, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const planEnum = pgEnum("plan", ["starter", "growth", "enterprise"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk user ID
  email: text("email").notNull(),
  name: text("name"),
  plan: planEnum("plan").default("starter").notNull(),
  onboardingDone: boolean("onboarding_done").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
