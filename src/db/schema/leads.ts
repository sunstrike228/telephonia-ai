import { pgTable, text, uuid, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { campaigns } from "./campaigns";

export const leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "qualified", "converted", "rejected"]);

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  campaignId: uuid("campaign_id").references(() => campaigns.id),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phone: text("phone").notNull(),
  email: text("email"),
  company: text("company"),
  metadata: jsonb("metadata").default({}),
  status: leadStatusEnum("status").default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
