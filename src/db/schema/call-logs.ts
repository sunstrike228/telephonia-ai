import { pgTable, text, uuid, integer, real, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { leads } from "./leads";
import { campaigns } from "./campaigns";
import { phoneNumbers } from "./phone-numbers";

export const callDirectionEnum = pgEnum("call_direction", ["outbound", "inbound"]);
export const callStatusEnum = pgEnum("call_status", ["completed", "failed", "no_answer", "voicemail", "busy", "in_progress"]);
export const callSentimentEnum = pgEnum("call_sentiment", ["positive", "negative", "neutral"]);

export const callLogs = pgTable("call_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  orgId: uuid("org_id").references(() => organizations.id).notNull(),
  leadId: uuid("lead_id").references(() => leads.id),
  campaignId: uuid("campaign_id").references(() => campaigns.id),
  phoneNumberId: uuid("phone_number_id").references(() => phoneNumbers.id),
  direction: callDirectionEnum("direction").notNull(),
  status: callStatusEnum("status").default("completed").notNull(),
  fromNumber: text("from_number"),
  toNumber: text("to_number"),
  duration: integer("duration"), // seconds
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
  transcription: text("transcription"),
  transcript: jsonb("transcript").default([]), // [{role, content}]
  summary: text("summary"),
  sentiment: callSentimentEnum("call_sentiment"),
  sentimentScore: real("sentiment"), // -1.0 to 1.0 (legacy)
  score: real("score"), // 0 to 100
  recordingUrl: text("recording_url"),
  metadata: jsonb("metadata").default({}),
});
