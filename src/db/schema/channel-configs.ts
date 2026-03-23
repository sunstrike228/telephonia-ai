import { pgTable, text, uuid, timestamp, jsonb, pgEnum, unique } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const channelConfigStatusEnum = pgEnum("channel_config_status", ["active", "inactive"]);

export const channelConfigs = pgTable("channel_configs", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  channel: text("channel").notNull(),
  config: jsonb("config").notNull(),
  status: channelConfigStatusEnum("channel_config_status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  unique("channel_configs_org_channel_unique").on(table.orgId, table.channel),
]);
