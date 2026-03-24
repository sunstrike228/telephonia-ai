import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  keyHash: text("key_hash").notNull(),
  prefix: text("prefix").notNull(), // first 12 chars for display
  last4: text("last4").notNull().default(""), // last 4 chars for display
  lastUsedAt: timestamp("last_used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});
