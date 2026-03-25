# Project Noir -- Technical Architecture

Detailed technical architecture documentation for the Project Noir AI outreach platform.

---

## System Diagram

```
+-----------------------------------------------------------------------------------+
|                              CLIENTS                                              |
|                                                                                   |
|   Browser (Landing)     Browser (Dashboard)      Twilio       Stripe/LiqPay      |
+--------+----------------+-----+------------------+---+--------+---+--------------+
         |                      |                      |              |
         v                      v                      v              v
+--------+----------------------+----------------------+--------------+-------------+
|                          VERCEL (Next.js 16)                                      |
|                                                                                   |
|  +----------------+  +-----------------------+  +------------------------------+  |
|  | Landing Page   |  | Dashboard Pages       |  | API Routes (37 endpoints)    |  |
|  | (public)       |  | (Clerk-protected)     |  |                              |  |
|  |                |  |                       |  | /api/dashboard/*  (Clerk)    |  |
|  | hero, pricing, |  | campaigns, leads,     |  | /api/webhook/*    (Signature)|  |
|  | features, FAQ  |  | scripts, voice, calls,|  | /api/demo/*       (Public)   |  |
|  |                |  | telegram, email,       |  |                              |  |
|  |                |  | analytics, billing,    |  |                              |  |
|  |                |  | settings, numbers      |  |                              |  |
|  +----------------+  +-----------------------+  +------+-----------+-----------+  |
|                                                        |           |              |
+--------------------------------------------------------+-----------+--------------+
                                                         |           |
            +--------------------------------------------+           |
            |                                                        |
            v                                                        v
+---------------------------+                          +---------------------------+
|   RAILWAY: Voice Agent    |                          | RAILWAY: Telegram Worker   |
|   (Python, port 7860)     |                          | (Python, port 7861)        |
|                           |                          |                            |
|   POST /api/call          |                          | POST /api/send             |
|   POST /api/config        |                          | POST /api/accounts/add     |
|   GET  /api/config        |                          | POST /api/accounts/:id/    |
|   GET  /api/health        |                          |      verify                |
|                           |                          | GET  /api/accounts         |
|   Pipecat Pipeline:       |                          | GET  /api/health           |
|   Audio -> Deepgram STT   |                          |                            |
|   -> GPT-4o (OpenRouter)  |                          | Telethon Client Pool       |
|   -> ElevenLabs TTS       |                          | Auto account selection     |
|   -> Audio Out            |                          | Rate limiting + delays     |
|                           |                          |                            |
+-------------+-------------+                          +-------------+--------------+
              |                                                      |
              |          +---------------------------+               |
              +--------->|   NEON PostgreSQL          |<-------------+
                         |   (Serverless)             |
                         |                            |
                         |   13 tables:               |
                         |   users, organizations,    |
                         |   org_members, scripts,    |
                         |   voice_configs,           |
                         |   phone_numbers,           |
                         |   campaigns, leads,        |
                         |   call_logs, messages,     |
                         |   telegram_accounts,       |
                         |   channel_configs,         |
                         |   api_keys                 |
                         +---------------------------+
```

---

## Data Flow Diagrams

### Voice Call Flow

```
User clicks "Execute Campaign"
         |
         v
Dashboard API: POST /api/dashboard/campaigns/[id]/execute
         |
         v
campaign-executor.ts: executeCampaign()
         |
         v
For each lead with a phone number:
         |
         v
campaign-executor.ts: sendVoiceCall()
    |
    |  HTTP POST /api/call
    v
Voice Agent (Railway):
    |
    |  Twilio REST API: client.calls.create()
    v
Twilio:
    |
    |  Connects call, opens WebSocket to Voice Agent
    v
Voice Agent Pipeline:
    |
    |  Audio In -> Silero VAD -> Deepgram STT
    |  -> LLM Context Aggregator -> GPT-4o (OpenRouter)
    |  -> TranscriptCollector -> ElevenLabs TTS -> Audio Out
    v
On call disconnect:
    |
    |  TranscriptCollector.get_transcript()
    |  save_call_log() -> INSERT INTO call_logs
    v
Neon PostgreSQL: call_logs table updated
```

### Telegram Message Flow

```
User clicks "Execute Campaign"
         |
         v
Dashboard API: POST /api/dashboard/campaigns/[id]/execute
         |
         v
campaign-executor.ts: executeCampaign()
         |
         v
For each lead with a telegram_username:
         |
         v
campaign-executor.ts: sendTelegram()
    |
    |  HTTP POST /api/send
    v
Telegram Worker (Railway):
    |
    |  manager.get_available_account(orgId)
    |     -> Selects account with fewest daily sends
    |     -> Checks daily limit not exceeded
    v
    |  Random delay (30-90 seconds)
    v
    |  manager.send_message()
    |     -> client.get_entity(username)
    |     -> client.send_message(entity, message)
    |     -> db.increment_daily_sent()
    v
    |  db.log_message() -> INSERT INTO messages
    v
Dashboard: campaign-executor logs result
    |
    |  INSERT INTO messages (from campaign-executor side too)
    |  UPDATE leads SET status = 'contacted'
    v
Neon PostgreSQL: messages + leads tables updated
```

### Email Flow

```
User clicks "Execute Campaign"
         |
         v
Dashboard API: POST /api/dashboard/campaigns/[id]/execute
         |
         v
campaign-executor.ts: executeCampaign()
         |
         v
For each lead with an email:
         |
         v
campaign-executor.ts: sendEmail()
    |
    |  Load channel_configs for org (email sender settings)
    |  buildEmailPrompt() -> Generates subject + body template
    v
Resend API: resend.emails.send()
    |
    |  from: configured sender (or noreply@projectnoir.ai)
    |  to: lead's email address
    |  subject + html body
    v
On success:
    |  INSERT INTO messages (status: 'sent')
    v
On failure:
    |  INSERT INTO messages (status: 'failed')
    v
Neon PostgreSQL: messages table updated
```

### AI Email Generation Flow (Manual)

```
User opens Email page in dashboard
    |
    |  Fills in lead name, company, selects script, email type
    v
Dashboard: POST /api/dashboard/email/generate
    |
    |  Load script content from DB
    |  Load voice config (language, personality)
    |  buildEmailPrompt() -> Build prompt template
    v
OpenRouter API (Gemini 2.0 Flash):
    |
    |  Generate personalized email subject + body
    |  Parse JSON response: { "subject": "...", "body": "..." }
    v
Dashboard: Returns generated email for user review
    |
    |  User edits and clicks "Send"
    v
Dashboard: POST /api/dashboard/email/send
    |
    |  Resend API sends the email
    |  Result logged to messages table
    v
Neon PostgreSQL: messages table updated
```

---

## Campaign Execution Flow (Detailed)

```
POST /api/dashboard/campaigns/[id]/execute
    |
    v
1. Load campaign (verify ownership via orgId)
2. Validate: not already active/completed, has assigned leads
    |
    v
3. Load campaign config:
   - channelPriority: ["telegram", "voice", "email"] (configurable)
   - scriptId -> load script content + objection handlers
   - voiceConfigId -> load language + personality
    |
    v
4. Load all leads WHERE campaign_id = [id] AND org_id = [orgId]
    |
    v
5. UPDATE campaigns SET status = 'active'
    |
    v
6. FOR EACH lead:
   |
   |  a. checkUsageLimits(orgId)
   |     -> Count voice minutes, telegram msgs, emails this month
   |     -> Compare against plan limits
   |     -> If exceeded: pause campaign, skip remaining leads
   |
   |  b. FOR EACH channel in channelPriority:
   |     |
   |     |  Check if lead has contact info for this channel:
   |     |    telegram -> telegramUsername required
   |     |    voice    -> phone required
   |     |    email    -> email required
   |     |
   |     |  If not available -> skip to next channel
   |     |
   |     |  buildSystemPrompt() -> Channel-specific AI prompt
   |     |
   |     |  Dispatch to service:
   |     |    telegram -> POST telegram-worker/api/send
   |     |    voice    -> POST voice-agent/api/call
   |     |    email    -> Resend API directly
   |     |
   |     |  Log result to messages table
   |     |
   |     |  If SUCCESS:
   |     |    UPDATE leads SET status = 'contacted'
   |     |    BREAK (don't try other channels)
   |     |
   |     |  If FAILED:
   |     |    Try next channel in priority
   |
   |  c. Apply inter-lead delay:
   |     telegram: 60s, voice: 5s, email: 3s (capped at 5s)
   |
   v
7. UPDATE campaigns SET status = 'completed'
8. Return ExecutionProgress { total, processed, succeeded, failed, results[] }
```

---

## Authentication Flow

```
User visits /dashboard
    |
    v
Clerk Middleware (middleware.ts):
    |
    |  isPublicRoute? -> "/" , "/sign-in", "/sign-up", "/api/webhook/*"
    |    YES -> Allow through
    |    NO  -> auth.protect() -> Redirect to /sign-in if not authenticated
    v
User signs in via Clerk (email, OAuth, etc.)
    |
    v
First API request to any /api/dashboard/* route:
    |
    |  auth() -> Extract userId from Clerk session
    |  getOrgId(userId):
    |    1. Check if user exists in 'users' table
    |       NOT FOUND -> Create user from Clerk profile
    |    2. Check if org exists for this user
    |       NOT FOUND -> Create "Personal" org
    |    3. Return orgId
    v
All subsequent queries are scoped: WHERE org_id = [orgId]
```

---

## Payment Flow

### Stripe (International)

```
User selects plan on /dashboard/billing
    |
    v
POST /api/dashboard/billing/checkout { planId: "starter" }
    |
    |  Find/create Stripe customer
    |  Create Checkout Session with price_id
    v
Redirect to Stripe Checkout
    |
    v
User completes payment on Stripe
    |
    v
Stripe sends webhook: checkout.session.completed
    |
    v
POST /api/webhook/stripe
    |
    |  Verify webhook signature
    |  Extract userId, planId from session metadata
    |  UPDATE users SET plan = [planId], stripe_customer_id, stripe_subscription_id
    v
User redirected to /dashboard/billing?success=true

--- Subscription lifecycle ---

Stripe: customer.subscription.updated
    -> Update plan based on price_id
    -> If status = canceled/unpaid -> downgrade to free

Stripe: customer.subscription.deleted
    -> Downgrade to free, clear subscription ID

Stripe: invoice.payment_failed
    -> Log error (Stripe retries automatically)
```

### LiqPay (Ukraine)

```
User selects plan + LiqPay payment
    |
    v
POST /api/dashboard/billing/liqpay { planId: "starter" }
    |
    |  Create order_id: "liqpay_{userId}_{planId}_{timestamp}"
    |  Build LiqPay payment form data + signature
    v
Client-side LiqPay form submission
    |
    v
LiqPay processes payment
    |
    v
LiqPay sends webhook (POST form data)
    |
    v
POST /api/webhook/liqpay
    |
    |  Verify signature: SHA1(private_key + data + private_key)
    |  Decode base64 data payload
    |  Parse order_id -> extract userId, planId
    |
    |  status = "subscribed" or "success" -> UPDATE plan
    |  status = "reversed" or "unsubscribed" -> Downgrade to free
    |  status = "failure" -> Log error
    v
User redirected to /dashboard/billing?success=true
```

---

## Database Schema Relationships

```
users (PK: id = Clerk user ID)
  |
  |-- 1:N --> organizations (owner_id -> users.id)
  |              |
  |              |-- 1:N --> org_members (org_id -> organizations.id, user_id -> users.id)
  |              |-- 1:N --> scripts (org_id)
  |              |-- 1:N --> voice_configs (org_id)
  |              |-- 1:N --> phone_numbers (org_id)
  |              |-- 1:N --> campaigns (org_id)
  |              |     |
  |              |     |-- N:1 --> scripts (script_id)
  |              |     |-- N:1 --> voice_configs (voice_config_id)
  |              |     |-- 1:N --> leads (campaign_id)
  |              |     |-- 1:N --> call_logs (campaign_id)
  |              |     +-- 1:N --> messages (campaign_id)
  |              |
  |              |-- 1:N --> leads (org_id)
  |              |     |
  |              |     |-- 1:N --> call_logs (lead_id)
  |              |     +-- 1:N --> messages (lead_id)
  |              |
  |              |-- 1:N --> call_logs (org_id)
  |              |     +-- N:1 --> phone_numbers (phone_number_id)
  |              |
  |              |-- 1:N --> messages (org_id)
  |              |-- 1:N --> telegram_accounts (assigned_org_id)
  |              |-- 1:N --> channel_configs (org_id)  [unique: org_id + channel]
  |              +-- 1:N --> api_keys (org_id)
```

### Multi-Tenancy

All data is scoped to an organization (`org_id`). The `getOrgId()` helper in `src/lib/auth.ts` ensures:

1. Every authenticated user has a row in the `users` table
2. Every user has at least one organization ("Personal")
3. All API queries filter by `org_id` to enforce data isolation

---

## Key Technical Decisions

### Why Neon PostgreSQL (Serverless)?

- Zero cold-start connection pooling via `@neondatabase/serverless`
- Compatible with Vercel's serverless function model
- Drizzle ORM provides type-safe queries with excellent DX
- All three services share the same database for data consistency

### Why OpenRouter instead of direct OpenAI?

- Single API key provides access to multiple LLM providers
- Easy to switch between GPT-4o, Claude, Gemini without code changes
- Built-in fallback and load balancing across providers

### Why Pipecat for Voice?

- Purpose-built framework for real-time voice AI pipelines
- Native integration with Deepgram, ElevenLabs, and OpenAI
- Handles audio streaming, VAD, and turn-taking automatically
- Supports multiple transport modes (Twilio, Daily.co, WebSocket)

### Why Telethon (user accounts) instead of Telegram Bot API?

- Bot API cannot initiate DMs to users who haven't started the bot
- User accounts can message anyone by username (critical for outreach)
- Account pooling distributes risk and increases throughput

### Why Dual Payment Processors?

- Stripe for international customers (USD)
- LiqPay for Ukrainian customers (UAH) -- Stripe has limited UA support
- Both update the same `users.plan` field via webhooks
