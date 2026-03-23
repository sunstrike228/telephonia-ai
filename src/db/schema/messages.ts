import { pgTable, text, uuid, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { leads } from "./leads";
import { campaigns } from "./campaigns";

export const messageChannelEnum = pgEnum("message_channel", ["voice", "telegram", "email"]);
export const messageDirectionEnum = pgEnum("message_direction", ["outbound", "inbound"]);
export const messageStatusEnum = pgEnum("message_status", ["pending", "sent", "delivered", "read", "replied", "failed"]);

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  leadId: uuid("lead_id").references(() => leads.id).notNull(),
  campaignId: uuid("campaign_id").references(() => campaigns.id),
  channel: messageChannelEnum("channel").notNull(),
  direction: messageDirectionEnum("direction").notNull(),
  status: messageStatusEnum("status").notNull(),
  content: text("content"),
  metadata: jsonb("metadata").default({}),
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
