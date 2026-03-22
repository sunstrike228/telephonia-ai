import { pgTable, text, uuid, boolean, real, timestamp } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const voiceConfigs = pgTable("voice_configs", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  voiceId: text("voice_id").notNull().default("B31Kx7rXmNnYqp1QWHR2"),
  voiceName: text("voice_name").default("Default Ukrainian"),
  language: text("language").default("uk").notNull(),
  personality: text("personality").default("professional").notNull(),
  speed: real("speed").default(1.0).notNull(),
  isDefault: boolean("is_default").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
