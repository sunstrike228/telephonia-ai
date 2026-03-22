import { pgTable, text, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";

export const orgRoleEnum = pgEnum("org_role", ["owner", "admin", "member"]);

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  ownerId: text("owner_id").references(() => users.id).notNull(),
  clerkOrgId: text("clerk_org_id").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orgMembers = pgTable("org_members", {
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  userId: text("user_id").references(() => users.id).notNull(),
  role: orgRoleEnum("role").default("member").notNull(),
});
