import { pgTable, text, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { scripts } from "./scripts";
import { voiceConfigs } from "./voice-configs";

export const campaignStatusEnum = pgEnum("campaign_status", ["draft", "active", "paused", "completed"]);

export const campaigns = pgTable("campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  scriptId: uuid("script_id").references(() => scripts.id),
  voiceConfigId: uuid("voice_config_id").references(() => voiceConfigs.id),
  status: campaignStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
