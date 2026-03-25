import { Layers, Database, Shield, ArrowRight, Server, Zap } from "lucide-react";

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[rgba(0,0,0,0.95)] overflow-hidden my-6">
      {title && (
        <div className="px-4 py-2.5 border-b border-white/[0.06] text-xs font-mono text-white/40">
          {title}
        </div>
      )}
      <pre className="p-4 overflow-x-auto text-xs text-white/60 font-mono leading-relaxed">
        {children}
      </pre>
    </div>
  );
}

function Heading2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-display text-2xl font-bold text-white mt-14 mb-4 scroll-mt-20">
      <a href={`#${id}`} className="hover:text-[#ff4d4d] transition-colors duration-200">
        {children}
      </a>
    </h2>
  );
}

function Heading3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="font-display text-lg font-semibold text-white mt-10 mb-3 scroll-mt-20">
      <a href={`#${id}`} className="hover:text-[#ff4d4d] transition-colors duration-200">
        {children}
      </a>
    </h3>
  );
}

export default function ArchitecturePage() {
  return (
    <div>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
          <Layers className="w-3.5 h-3.5" />
          Architecture
        </div>
        <h1 className="font-display text-4xl font-bold text-white tracking-tight mb-4">
          Technical Architecture
        </h1>
        <p className="text-lg text-white/50 leading-relaxed">
          Detailed technical architecture of the Project Noir AI outreach platform, including
          system diagrams, data flows, and key technical decisions.
        </p>
      </div>

      {/* Table of Contents */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-10">
        <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">On this page</p>
        <nav className="space-y-1.5">
          {[
            ["system-diagram", "System Diagram"],
            ["data-flows", "Data Flow Diagrams"],
            ["campaign-execution", "Campaign Execution Flow"],
            ["authentication", "Authentication Flow"],
            ["payments", "Payment Flow"],
            ["database-schema", "Database Schema Relationships"],
            ["multi-tenancy", "Multi-Tenancy"],
            ["technical-decisions", "Key Technical Decisions"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="block text-sm text-white/40 hover:text-[#ff4d4d] transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      {/* System Diagram */}
      <Heading2 id="system-diagram">System Diagram</Heading2>
      <p className="text-white/50 leading-relaxed mb-4">
        The platform consists of three main services: the Next.js dashboard on Vercel,
        the Python voice agent on Railway, and the Python Telegram worker on Railway.
        All services share a Neon PostgreSQL database.
      </p>

      <CodeBlock title="System Overview">
{`+-----------------------------------------------------------------------------------+
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
+-------------+-------------+                          +-------------+--------------+
              |                                                      |
              |          +---------------------------+               |
              +--------->|   NEON PostgreSQL          |<-------------+
                         |   (Serverless)             |
                         |   13 tables                |
                         +---------------------------+`}
      </CodeBlock>

      <Heading3 id="service-communication">Service Communication</Heading3>
      <div className="space-y-3 mb-6">
        {[
          ["Dashboard -> Voice Agent", "HTTP POST to /api/call (initiate calls), POST to /api/config (sync voice settings)"],
          ["Dashboard -> Telegram Worker", "HTTP POST to /api/send (send messages), GET /api/accounts (list accounts)"],
          ["Dashboard -> Neon DB", "Direct connection via Drizzle ORM (serverless driver)"],
          ["Voice Agent -> Neon DB", "Direct connection via psycopg2 (saves call transcripts)"],
          ["Telegram Worker -> Neon DB", "Direct connection via psycopg2 (logs messages, manages accounts)"],
          ["Twilio -> Voice Agent", "WebSocket connection for real-time audio streaming"],
          ["Stripe/LiqPay -> Dashboard", "Webhooks for payment events"],
        ].map(([from, desc]) => (
          <div key={from} className="flex gap-3 text-sm">
            <span className="font-mono text-[#ff4d4d] whitespace-nowrap shrink-0">{from}</span>
            <span className="text-white/45">{desc}</span>
          </div>
        ))}
      </div>

      {/* Data Flows */}
      <Heading2 id="data-flows">Data Flow Diagrams</Heading2>

      <Heading3 id="voice-call-flow">Voice Call Flow</Heading3>
      <p className="text-white/50 leading-relaxed mb-4">
        When a campaign is executed, the voice channel processes leads with phone numbers
        through the Pipecat pipeline on Railway, streaming audio through Twilio.
      </p>
      <CodeBlock title="Voice Call Sequence">
{`User clicks "Execute Campaign"
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
    |  Connects call, opens WebSocket to Voice Agent
    v
Voice Agent Pipeline:
    |  Audio In -> Silero VAD -> Deepgram STT
    |  -> LLM Context Aggregator -> GPT-4o (OpenRouter)
    |  -> TranscriptCollector -> ElevenLabs TTS -> Audio Out
    v
On call disconnect:
    |  TranscriptCollector.get_transcript()
    |  save_call_log() -> INSERT INTO call_logs
    v
Neon PostgreSQL: call_logs table updated`}
      </CodeBlock>

      <Heading3 id="telegram-flow">Telegram Message Flow</Heading3>
      <p className="text-white/50 leading-relaxed mb-4">
        Telegram messages are sent through a pool of user accounts managed by the
        Telegram Worker on Railway, with rate limiting and delays to avoid bans.
      </p>
      <CodeBlock title="Telegram Message Sequence">
{`User clicks "Execute Campaign"
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
Neon PostgreSQL: messages + leads tables updated`}
      </CodeBlock>

      <Heading3 id="email-flow">Email Flow</Heading3>
      <p className="text-white/50 leading-relaxed mb-4">
        Emails are sent directly from the Next.js dashboard through the Resend API,
        with AI-generated content powered by OpenRouter.
      </p>
      <CodeBlock title="Email Send Sequence">
{`User clicks "Execute Campaign"
         |
         v
campaign-executor.ts: executeCampaign()
         |
         v
For each lead with an email:
         |
         v
campaign-executor.ts: sendEmail()
    |  Load channel_configs for org (email sender settings)
    |  buildEmailPrompt() -> Generates subject + body template
    v
Resend API: resend.emails.send()
    |  from: configured sender (or noreply@projectnoir.ai)
    |  to: lead's email address
    v
On success: INSERT INTO messages (status: 'sent')
On failure: INSERT INTO messages (status: 'failed')
    v
Neon PostgreSQL: messages table updated`}
      </CodeBlock>

      {/* Campaign Execution */}
      <Heading2 id="campaign-execution">Campaign Execution Flow</Heading2>
      <p className="text-white/50 leading-relaxed mb-4">
        The campaign executor is the core engine that orchestrates outreach across
        all channels. It processes leads sequentially, trying channels in priority order
        with usage limit checks.
      </p>
      <CodeBlock title="Detailed Campaign Execution">
{`POST /api/dashboard/campaigns/[id]/execute
    |
    v
1. Load campaign (verify ownership via orgId)
2. Validate: not already active/completed, has assigned leads
    |
    v
3. Load campaign config:
   - channelPriority: ["telegram", "voice", "email"]
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
   |     |  Check if lead has contact info for this channel
   |     |  If not available -> skip to next channel
   |     |  buildSystemPrompt() -> Channel-specific AI prompt
   |     |  Dispatch to service
   |     |  Log result to messages table
   |     |  If SUCCESS -> UPDATE leads SET status = 'contacted' -> BREAK
   |     |  If FAILED -> Try next channel in priority
   |
   |  c. Apply inter-lead delay:
   |     telegram: 60s, voice: 5s, email: 3s
    |
    v
7. UPDATE campaigns SET status = 'completed'
8. Return ExecutionProgress { total, processed, succeeded, failed }`}
      </CodeBlock>

      {/* Authentication */}
      <Heading2 id="authentication">Authentication Flow</Heading2>
      <p className="text-white/50 leading-relaxed mb-4">
        Authentication is handled by Clerk with automatic user and organization
        provisioning on first API request.
      </p>
      <CodeBlock title="Auth Flow">
{`User visits /dashboard
    |
    v
Clerk Middleware (middleware.ts):
    |  isPublicRoute? -> "/" , "/sign-in", "/sign-up", "/api/webhook/*"
    |    YES -> Allow through
    |    NO  -> auth.protect() -> Redirect to /sign-in if not authenticated
    v
User signs in via Clerk (email, OAuth, etc.)
    |
    v
First API request to any /api/dashboard/* route:
    |  auth() -> Extract userId from Clerk session
    |  getOrgId(userId):
    |    1. Check if user exists in 'users' table
    |       NOT FOUND -> Create user from Clerk profile
    |    2. Check if org exists for this user
    |       NOT FOUND -> Create "Personal" org
    |    3. Return orgId
    v
All subsequent queries are scoped: WHERE org_id = [orgId]`}
      </CodeBlock>

      {/* Payments */}
      <Heading2 id="payments">Payment Flow</Heading2>

      <Heading3 id="stripe-flow">Stripe (International)</Heading3>
      <p className="text-white/50 leading-relaxed mb-4">
        International payments are handled through Stripe Checkout with webhook-driven
        subscription lifecycle management.
      </p>
      <CodeBlock title="Stripe Payment Flow">
{`User selects plan on /dashboard/billing
    |
    v
POST /api/dashboard/billing/checkout { planId: "starter" }
    |  Find/create Stripe customer
    |  Create Checkout Session with price_id
    v
Redirect to Stripe Checkout -> User completes payment
    |
    v
Stripe webhook: checkout.session.completed
    |  POST /api/webhook/stripe
    |  Verify webhook signature
    |  UPDATE users SET plan = [planId], stripe_customer_id, stripe_subscription_id
    v
User redirected to /dashboard/billing?success=true

--- Subscription lifecycle ---
customer.subscription.updated  -> Update plan / downgrade if canceled
customer.subscription.deleted  -> Downgrade to free
invoice.payment_failed         -> Log error (Stripe retries)`}
      </CodeBlock>

      <Heading3 id="liqpay-flow">LiqPay (Ukraine)</Heading3>
      <p className="text-white/50 leading-relaxed mb-4">
        Ukrainian users can pay in UAH through LiqPay with signature-verified
        webhook callbacks.
      </p>
      <CodeBlock title="LiqPay Payment Flow">
{`User selects plan + LiqPay payment
    |
    v
POST /api/dashboard/billing/liqpay { planId: "starter" }
    |  Create order_id: "liqpay_{userId}_{planId}_{timestamp}"
    |  Build LiqPay payment form data + signature
    v
Client-side LiqPay form submission -> LiqPay processes payment
    |
    v
LiqPay webhook: POST /api/webhook/liqpay
    |  Verify signature: SHA1(private_key + data + private_key)
    |  Decode base64 data payload
    |  Parse order_id -> extract userId, planId
    |  status = "subscribed"/"success" -> UPDATE plan
    |  status = "reversed"/"unsubscribed" -> Downgrade to free
    v
User redirected to /dashboard/billing?success=true`}
      </CodeBlock>

      {/* Database Schema */}
      <Heading2 id="database-schema">Database Schema Relationships</Heading2>
      <p className="text-white/50 leading-relaxed mb-4">
        The platform uses 13 tables in a Neon PostgreSQL database. All data is
        scoped to organizations for multi-tenant isolation.
      </p>
      <CodeBlock title="Entity Relationships">
{`users (PK: id = Clerk user ID)
  |
  |-- 1:N --> organizations (owner_id -> users.id)
  |              |
  |              |-- 1:N --> org_members (org_id, user_id)
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
  |              |     |-- 1:N --> call_logs (lead_id)
  |              |     +-- 1:N --> messages (lead_id)
  |              |
  |              |-- 1:N --> call_logs (org_id)
  |              |-- 1:N --> messages (org_id)
  |              |-- 1:N --> telegram_accounts (assigned_org_id)
  |              |-- 1:N --> channel_configs (org_id)
  |              +-- 1:N --> api_keys (org_id)`}
      </CodeBlock>

      {/* Database Tables */}
      <div className="rounded-xl border border-white/[0.08] overflow-hidden my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Table</th>
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["users", "User accounts synced from Clerk. Stores plan tier, Stripe IDs, onboarding status."],
              ["organizations", "Multi-tenant orgs. Each user auto-gets a 'Personal' org."],
              ["org_members", "Organization membership with roles: owner, admin, member."],
              ["scripts", "Sales scripts with content and objection handler arrays (JSONB)."],
              ["voice_configs", "Per-org voice settings: voice ID, language, personality, speed."],
              ["phone_numbers", "Twilio phone numbers assigned to orgs."],
              ["campaigns", "Outreach campaigns with channel selection and priority ordering."],
              ["leads", "Contact database with phone, email, Telegram, company, metadata."],
              ["call_logs", "Voice call records with full transcript, duration, sentiment, score."],
              ["messages", "Unified message log for all channels (voice/telegram/email)."],
              ["telegram_accounts", "Pool of Telegram accounts with session strings and rate tracking."],
              ["channel_configs", "Per-org, per-channel configuration (email sender, etc.)."],
              ["api_keys", "SHA-256 hashed API keys with prefix and last4 for display."],
            ].map(([table, desc], i) => (
              <tr key={table} className={`border-b border-white/[0.04] ${i % 2 === 1 ? "bg-white/[0.015]" : ""}`}>
                <td className="px-5 py-3 font-mono text-[#ff4d4d] text-xs whitespace-nowrap">{table}</td>
                <td className="px-5 py-3 text-white/45">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Multi-Tenancy */}
      <Heading2 id="multi-tenancy">Multi-Tenancy</Heading2>
      <p className="text-white/50 leading-relaxed mb-4">
        All data is scoped to an organization via <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[#ff4d4d] text-xs font-mono">org_id</code>.
        The <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[#ff4d4d] text-xs font-mono">getOrgId()</code> helper
        in <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-white/60 text-xs font-mono">src/lib/auth.ts</code> ensures:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-white/50 mb-6">
        <li>Every authenticated user has a row in the <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-white/60">users</code> table</li>
        <li>Every user has at least one organization (&quot;Personal&quot;)</li>
        <li>All API queries filter by <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-white/60">org_id</code> to enforce data isolation</li>
      </ol>

      {/* Technical Decisions */}
      <Heading2 id="technical-decisions">Key Technical Decisions</Heading2>
      <div className="space-y-6">
        {[
          {
            q: "Why Neon PostgreSQL (Serverless)?",
            a: "Zero cold-start connection pooling via @neondatabase/serverless. Compatible with Vercel's serverless function model. Drizzle ORM provides type-safe queries. All three services share the same database.",
          },
          {
            q: "Why OpenRouter instead of direct OpenAI?",
            a: "Single API key provides access to multiple LLM providers. Easy to switch between GPT-4o, Claude, Gemini without code changes. Built-in fallback and load balancing.",
          },
          {
            q: "Why Pipecat for Voice?",
            a: "Purpose-built framework for real-time voice AI pipelines. Native integration with Deepgram, ElevenLabs, and OpenAI. Handles audio streaming, VAD, and turn-taking automatically.",
          },
          {
            q: "Why Telethon (user accounts) instead of Telegram Bot API?",
            a: "Bot API cannot initiate DMs to users who haven't started the bot. User accounts can message anyone by username, which is critical for outreach. Account pooling distributes risk.",
          },
          {
            q: "Why Dual Payment Processors?",
            a: "Stripe for international customers (USD). LiqPay for Ukrainian customers (UAH) since Stripe has limited UA support. Both update the same users.plan field via webhooks.",
          },
        ].map((item) => (
          <div key={item.q} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <h4 className="font-display font-semibold text-white mb-2">{item.q}</h4>
            <p className="text-sm text-white/45 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
