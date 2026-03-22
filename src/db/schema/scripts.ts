import { pgTable, text, uuid, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const scripts = pgTable("scripts", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  name: text("name").notNull(),
  content: text("content").notNull().default(""),
  objectionHandlers: jsonb("objection_handlers").default([]),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
