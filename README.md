# Project Noir

**AI-powered multi-channel outreach platform by Void Research.**

Project Noir replaces your outreach team with AI agents that call, message on Telegram, and email your leads -- indistinguishable from real humans. Built as a SaaS platform with a dashboard for managing campaigns, leads, scripts, and analytics across all channels.

---

## Architecture

```
                        +---------------------+
                        |   Landing Page      |
                        |   (Vercel)          |
                        +----------+----------+
                                   |
                                   v
+------------------------------------------------------------------+
|                       Next.js Dashboard                          |
|                       (Vercel)                                   |
|                                                                  |
|  Campaigns | Leads | Scripts | Voice | Telegram | Email | Billing|
+-----+---------------------------+-------------------+------------+
      |                           |                   |
      v                           v                   v
+-------------+          +----------------+    +-------------+
| Neon        |<---------| Voice Agent    |    | Telegram    |
| PostgreSQL  |          | (Railway)      |    | Worker      |
|             |<---------|                |    | (Railway)   |
+-------------+          | Pipecat +      |    |             |
      ^                  | Deepgram STT + |    | Telethon +  |
      |                  | GPT-4o +       |    | FastAPI     |
      |                  | ElevenLabs TTS |    +------+------+
      |                  +-------+--------+           |
      |                          |                    |
      +--------------------------+--------------------+
                                 |
                          +------+------+
                          |   Twilio    |
                          |  (Voice)    |
                          +-------------+
```

### Service Communication

- **Dashboard -> Voice Agent**: HTTP POST to `/api/call` (initiate calls), POST to `/api/config` (sync voice settings)
- **Dashboard -> Telegram Worker**: HTTP POST to `/api/send` (send messages), GET `/api/accounts` (list accounts)
- **Dashboard -> Neon DB**: Direct connection via Drizzle ORM (serverless driver)
- **Voice Agent -> Neon DB**: Direct connection via psycopg2 (saves call transcripts)
- **Telegram Worker -> Neon DB**: Direct connection via psycopg2 (logs messages, manages accounts)
- **Twilio -> Voice Agent**: WebSocket connection for real-time audio streaming
- **Stripe/LiqPay -> Dashboard**: Webhooks for payment events

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Landing + Dashboard** | Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion |
| **Authentication** | Clerk |
| **Database** | Neon PostgreSQL (serverless) + Drizzle ORM |
| **Voice Agent** | Python 3.11, Pipecat, Deepgram Nova-3 STT, GPT-4o via OpenRouter, ElevenLabs TTS |
| **Telegram Worker** | Python 3.11, Telethon, FastAPI, Uvicorn |
| **Email** | Resend |
| **Payments** | Stripe (international) + LiqPay (Ukraine) |
| **Telephony** | Twilio (call initiation + WebSocket audio) |
| **Monitoring** | Sentry |
| **Charts** | Recharts |
| **Hosting** | Vercel (web app) + Railway (Python services) |

---

## Project Structure

### telephonia-react (Next.js Dashboard + Landing)

```
telephonia-react/
├── src/
│   ├── app/
│   │   ├── page.tsx                          # Landing page
│   │   ├── layout.tsx                        # Root layout (fonts, metadata, Clerk)
│   │   ├── sign-in/[[...sign-in]]/page.tsx   # Clerk sign-in
│   │   ├── sign-up/[[...sign-up]]/page.tsx   # Clerk sign-up
│   │   ├── dashboard/
│   │   │   ├── page.tsx                      # Dashboard home (overview + stats)
│   │   │   ├── layout.tsx                    # Dashboard layout (sidebar + topbar)
│   │   │   ├── campaigns/page.tsx            # Campaign management
│   │   │   ├── leads/page.tsx                # Lead database with search/filter
│   │   │   ├── scripts/page.tsx              # Sales script editor
│   │   │   ├── voice/page.tsx                # Voice agent configuration
│   │   │   ├── calls/page.tsx                # Call log history
│   │   │   ├── calls/[id]/page.tsx           # Individual call detail + transcript
│   │   │   ├── telegram/page.tsx             # Telegram accounts overview
│   │   │   ├── email/page.tsx                # Email channel management
│   │   │   ├── numbers/page.tsx              # Phone number management (Twilio)
│   │   │   ├── analytics/page.tsx            # Cross-channel analytics dashboard
│   │   │   ├── billing/page.tsx              # Plans, usage, payment methods
│   │   │   ├── integrations/page.tsx         # Third-party integrations
│   │   │   └── settings/
│   │   │       ├── page.tsx                  # General settings
│   │   │       ├── api-keys/page.tsx         # API key management
│   │   │       └── team/page.tsx             # Team management
│   │   └── api/                              # 37 API route handlers
│   │       ├── dashboard/                    # All authenticated API routes
│   │       ├── webhook/                      # Stripe + LiqPay webhook handlers
│   │       └── demo/                         # Public demo endpoints
│   ├── components/
│   │   ├── blocks/                           # Landing page sections (hero, pricing, etc.)
│   │   ├── dashboard/                        # Dashboard UI (sidebar, topbar, stat cards)
│   │   └── ui/                               # Reusable UI primitives (button, spotlight, etc.)
│   ├── db/
│   │   ├── index.ts                          # Drizzle + Neon connection
│   │   └── schema/                           # 13 database table definitions
│   ├── lib/
│   │   ├── auth.ts                           # getOrgId() helper (auto-creates user + org)
│   │   ├── campaign-executor.ts              # Core campaign execution engine
│   │   ├── prompts.ts                        # Multi-channel prompt builder
│   │   ├── usage.ts                          # Plan usage limit checker
│   │   ├── liqpay.ts                         # LiqPay payment helpers
│   │   └── utils.ts                          # cn() class merge utility
│   ├── hooks/                                # React hooks (i18n, intersection observer, etc.)
│   ├── middleware.ts                         # Clerk auth middleware
│   └── instrumentation.ts                   # Sentry initialization
├── drizzle/                                  # Migration files
├── drizzle.config.ts                         # Drizzle Kit configuration
└── package.json
```

### voice-agent (Python Pipecat Voice Agent)

```
voice-agent/
├── bot.py               # Main Pipecat pipeline (STT -> LLM -> TTS)
├── server.py            # Custom server wrapper adding API routes
├── api.py               # FastAPI endpoints (/api/call, /api/config, /api/health)
├── config.py            # Agent identity, model settings, greeting templates
├── prompts.py           # System prompt generation with personality presets
├── live_config.py       # Thread-safe live config store (dashboard sync)
├── requirements.txt
└── Dockerfile           # Railway deployment (port 7860)
```

### telegram-worker (Python Telegram Outreach Worker)

```
telegram-worker/
├── main.py              # FastAPI app with all endpoints
├── account_manager.py   # Telethon client pool + auth flow + send logic
├── db.py                # Database operations (messages, accounts)
├── config.py            # Environment config (rate limits, delays)
├── requirements.txt
└── Dockerfile           # Railway deployment (port 7861)
```

---

## Database Schema

The platform uses **13 tables** in a Neon PostgreSQL database, all defined with Drizzle ORM:

| Table | Description |
|-------|-------------|
| `users` | User accounts synced from Clerk. Stores plan tier (free/starter/growth/enterprise), Stripe customer/subscription IDs, onboarding status. Primary key is the Clerk user ID. |
| `organizations` | Multi-tenant orgs. Each user auto-gets a "Personal" org. All data is scoped by `org_id`. |
| `org_members` | Organization membership with roles: owner, admin, member. |
| `scripts` | Sales scripts with content text and objection handler arrays (JSONB). Used by voice agent and prompt builder. |
| `voice_configs` | Per-org voice settings: ElevenLabs voice ID, selected voices, language (uk/en/multi), personality preset, speed. |
| `phone_numbers` | Twilio phone numbers purchased and assigned to orgs. Tracks provider, status, and campaign assignment. |
| `campaigns` | Outreach campaigns with channel selection (JSONB array), priority ordering, script/voice config references. Status: draft -> active -> paused/completed. |
| `leads` | Contact database: phone, email, Telegram username, company, timezone, custom metadata (JSONB). Status funnel: new -> contacted -> qualified -> converted/rejected. |
| `call_logs` | Voice call records with full transcript (JSONB array of `{role, content}`), flat transcription text, duration (seconds), sentiment, score, recording URL. |
| `messages` | Unified message log for all channels (voice/telegram/email). Tracks direction (inbound/outbound), status, content, metadata. |
| `telegram_accounts` | Pool of Telegram accounts with encrypted session strings, daily message counters, warmup tracking, ban status. |
| `channel_configs` | Per-org, per-channel configuration (e.g., email sender address, reply-to). Unique constraint on `(org_id, channel)`. |
| `api_keys` | SHA-256 hashed API keys with prefix (first 12 chars) and last4 for display. Supports key rotation and expiration. |

### Key Enums

- **Plans**: `free`, `starter`, `growth`, `enterprise`
- **Campaign Status**: `draft`, `active`, `paused`, `completed`
- **Lead Status**: `new`, `contacted`, `qualified`, `converted`, `rejected`
- **Call Status**: `completed`, `failed`, `no_answer`, `voicemail`, `busy`, `in_progress`
- **Message Channel**: `voice`, `telegram`, `email`
- **Message Status**: `pending`, `sent`, `delivered`, `read`, `replied`, `failed`
- **Telegram Account Status**: `warming_up`, `active`, `assigned`, `banned`, `cooldown`

---

## API Routes

See [docs/API.md](docs/API.md) for the complete API reference with request/response schemas.

### Summary (37 endpoints)

| Domain | Endpoints | Auth |
|--------|-----------|------|
| **Campaigns** | 8 (CRUD + execute/start/pause + lead assignment) | Clerk |
| **Leads** | 4 (CRUD + CSV import) | Clerk |
| **Scripts** | 4 (CRUD) | Clerk |
| **Voice** | 3 (config GET/PUT + sync to Railway) | Clerk |
| **Calls** | 2 (list + detail) | Clerk |
| **Numbers** | 4 (CRUD + available search) | Clerk |
| **Email** | 4 (send + generate + test + messages) | Clerk |
| **Telegram** | 1 (list accounts) | Clerk |
| **Billing** | 5 (checkout + portal + usage + liqpay + payment methods) | Clerk |
| **Analytics** | 1 (comprehensive dashboard data) | Clerk |
| **Channels** | 1 (config GET/PUT) | Clerk |
| **Onboarding** | 2 (status + complete) | Clerk |
| **Settings** | 1 (API keys CRUD) | Clerk |
| **Webhooks** | 2 (Stripe + LiqPay) | Signature verification |
| **Demo** | 2 (email demo + channel status) | None |

---

## Environment Variables

See `.env.example` for the complete list with descriptions.

### telephonia-react (Next.js)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `STRIPE_SECRET_KEY` | Stripe API secret key |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `LIQPAY_PUBLIC_KEY` | LiqPay public key (Ukraine payments) |
| `LIQPAY_PRIVATE_KEY` | LiqPay private key |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `RESEND_API_KEY` | Resend email API key |
| `OPENROUTER_API_KEY` | OpenRouter API key (email generation) |
| `RAILWAY_VOICE_AGENT_URL` | Voice agent Railway URL |
| `SENTRY_DSN` | Sentry DSN for error tracking |

### voice-agent (Python)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Same Neon PostgreSQL connection string |
| `ORG_ID` | Default organization ID for call attribution |
| `DEEPGRAM_API_KEY` | Deepgram STT API key |
| `ELEVENLABS_API_KEY` | ElevenLabs TTS API key |
| `ELEVENLABS_VOICE_ID` | Default ElevenLabs voice ID |
| `OPENROUTER_API_KEY` | OpenRouter API key (GPT-4o) |
| `TWILIO_ACCOUNT_SID` | Twilio account SID |
| `TWILIO_AUTH_TOKEN` | Twilio auth token |
| `TWILIO_PHONE_NUMBER` | Twilio phone number for outbound calls |
| `BASE_URL` | Public URL of this service |
| `DAILY_API_KEY` | Daily.co API key for WebRTC transport |

### telegram-worker (Python)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Same Neon PostgreSQL connection string |
| `MAX_DAILY_MESSAGES_PER_ACCOUNT` | Daily message cap per account (default: 30) |
| `MESSAGE_DELAY_MIN` | Min seconds between sends (default: 30) |
| `MESSAGE_DELAY_MAX` | Max seconds between sends (default: 90) |

---

## Local Development

### Prerequisites

- Node.js 20+
- Python 3.11+
- PostgreSQL (or Neon account)
- Accounts: Clerk, Stripe, Twilio, Deepgram, ElevenLabs, OpenRouter, Resend

### 1. Dashboard (Next.js)

```bash
cd telephonia-react
cp .env.example .env.local       # Fill in all values
npm install
npx drizzle-kit push             # Push schema to database
npm run dev                      # http://localhost:3000
```

### 2. Voice Agent (Python)

```bash
cd voice-agent
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env             # Fill in all values
python server.py -t daily --host 0.0.0.0 --port 7860
```

### 3. Telegram Worker (Python)

```bash
cd telegram-worker
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env             # Fill in all values
uvicorn main:app --host 0.0.0.0 --port 7861
```

### Database Migrations

```bash
cd telephonia-react
npx drizzle-kit generate         # Generate migration from schema changes
npx drizzle-kit push             # Push schema directly (dev mode)
npx drizzle-kit studio           # Visual database browser
```

---

## Deployment

### Dashboard (Vercel)

1. Connect the `telephonia-react` repo to Vercel
2. Set all environment variables in Vercel dashboard
3. Vercel auto-detects Next.js -- zero config needed
4. Configure webhook URLs:
   - Stripe: `https://yourdomain.com/api/webhook/stripe`
   - LiqPay: `https://yourdomain.com/api/webhook/liqpay`

### Voice Agent (Railway)

1. Create a Railway project from the `voice-agent` directory
2. Railway auto-detects the Dockerfile
3. Set all environment variables
4. Exposed on port 7860
5. Set `BASE_URL` to the Railway public URL
6. Configure Twilio incoming call webhook: `{BASE_URL}/twilio/incoming`

### Telegram Worker (Railway)

1. Create a Railway project from the `telegram-worker` directory
2. Railway auto-detects the Dockerfile
3. Set all environment variables
4. Exposed on port 7861

---

## Plan Limits

| Feature | Free | Starter ($40/mo) | Growth ($99/mo) | Enterprise ($299/mo) |
|---------|------|-------------------|-----------------|----------------------|
| Voice minutes/mo | 0 | 500 | 2,000 | Unlimited |
| Telegram messages/mo | 0 | 100 | 500 | Unlimited |
| Emails/mo | 0 | 500 | 2,000 | Unlimited |

Usage is tracked per-organization per calendar month. Campaign execution automatically pauses when limits are reached.

LiqPay pricing (UAH): Starter 1,650 / Growth 4,100 / Enterprise 12,300.

---

## Campaign Execution Flow

1. User creates a campaign, assigns a script, voice config, and leads
2. User clicks "Execute" -- triggers `POST /api/dashboard/campaigns/[id]/execute`
3. Campaign executor loads campaign config, script, voice config, and all assigned leads
4. For each lead, channels are tried in priority order (default: telegram -> voice -> email)
5. For each channel, the executor checks if the lead has contact info for that channel
6. If available, a personalized prompt is built and dispatched to the appropriate service
7. Results are logged to the `messages` table; lead status is updated to "contacted"
8. Usage limits are checked before each lead; campaign auto-pauses if limits are hit
9. Inter-lead delays are applied (telegram: 60s, voice: 5s, email: 3s)
10. Campaign status is set to "completed" when all leads are processed

---

## License

Proprietary. All rights reserved by Void Research.
