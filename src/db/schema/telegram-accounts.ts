import { pgTable, text, uuid, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const telegramAccountStatusEnum = pgEnum("telegram_account_status", ["warming_up", "active", "assigned", "banned", "cooldown"]);

export const telegramAccounts = pgTable("telegram_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  phone: text("phone").notNull().unique(),
  sessionString: text("session_string").notNull(),
  displayName: text("display_name"),
  username: text("username"),
  status: telegramAccountStatusEnum("status").default("warming_up").notNull(),
  assignedOrgId: uuid("assigned_org_id").references(() => organizations.id),
  dailyMessageCount: integer("daily_message_count").default(0).notNull(),
  maxDailyMessages: integer("max_daily_messages").default(10).notNull(),
  lastMessageAt: timestamp("last_message_at"),
  warmupStartedAt: timestamp("warmup_started_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
