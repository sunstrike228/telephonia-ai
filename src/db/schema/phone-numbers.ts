import { pgTable, text, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const numberStatusEnum = pgEnum("number_status", ["active", "inactive", "pending"]);

export const phoneNumbers = pgTable("phone_numbers", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  number: text("number").notNull().unique(),
  label: text("label"),
  provider: text("provider").default("twilio").notNull(),
  status: numberStatusEnum("status").default("active").notNull(),
  campaignId: uuid("campaign_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
