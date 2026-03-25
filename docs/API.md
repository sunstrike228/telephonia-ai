# Project Noir -- API Reference

Complete reference for all 37 API endpoints in the Next.js dashboard. All `/api/dashboard/*` routes require Clerk authentication. Webhook routes use signature verification. Demo routes are public.

---

## Table of Contents

- [Campaigns](#campaigns)
- [Leads](#leads)
- [Scripts](#scripts)
- [Voice Configuration](#voice-configuration)
- [Call Logs](#call-logs)
- [Phone Numbers](#phone-numbers)
- [Email](#email)
- [Telegram](#telegram)
- [Billing](#billing)
- [Analytics](#analytics)
- [Channel Configuration](#channel-configuration)
- [Onboarding](#onboarding)
- [Settings / API Keys](#settings--api-keys)
- [Webhooks](#webhooks)
- [Demo](#demo)

---

## Campaigns

### GET /api/dashboard/campaigns

List campaigns for the current organization.

**Auth:** Clerk (required)

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 25 | Items per page (max 100) |
| `status` | string | all | Filter: `draft`, `active`, `paused`, `completed`, or `all` |

**Response (200):**
```json
{
  "campaigns": [
    {
      "id": "uuid",
      "orgId": "uuid",
      "name": "Q1 Outreach",
      "scriptId": "uuid | null",
      "voiceConfigId": "uuid | null",
      "status": "draft",
      "channels": ["voice", "telegram"],
      "channelPriority": ["telegram", "voice", "email"],
      "scheduledAt": "2025-02-01T00:00:00Z | null",
      "settings": {},
      "createdAt": "2025-01-15T10:00:00Z",
      "updatedAt": "2025-01-15T10:00:00Z",
      "leadCount": 150
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 25,
    "total": 42,
    "totalPages": 2
  }
}
```

---

### POST /api/dashboard/campaigns

Create a new campaign.

**Auth:** Clerk (required)

**Request body:**
```json
{
  "name": "Q1 Outreach",
  "scriptId": "uuid (optional)",
  "channels": ["voice", "telegram", "email"],
  "channelPriority": ["telegram", "voice", "email"],
  "scheduledAt": "2025-02-01T00:00:00Z (optional)",
  "settings": {}
}
```

- `name` is required
- `channels` must be an array of valid channel types: `voice`, `telegram`, `email`

**Response (201):** Full campaign object.

---

### GET /api/dashboard/campaigns/[id]

Get a single campaign with lead statistics.

**Auth:** Clerk (required)

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Q1 Outreach",
  "status": "active",
  "channels": ["voice", "telegram"],
  "channelPriority": ["telegram", "voice", "email"],
  "stats": {
    "total": 150,
    "contacted": 80,
    "qualified": 20,
    "converted": 5,
    "rejected": 10
  }
}
```

---

### PATCH /api/dashboard/campaigns/[id]

Update a campaign. All fields are optional.

**Auth:** Clerk (required)

**Request body:**
```json
{
  "name": "Updated Name",
  "status": "paused",
  "channels": ["voice"],
  "channelPriority": ["voice", "email"],
  "scheduledAt": null,
  "settings": {}
}
```

**Response (200):** Updated campaign object.

---

### DELETE /api/dashboard/campaigns/[id]

Delete a campaign.

**Auth:** Clerk (required)

**Response (200):**
```json
{ "success": true }
```

---

### POST /api/dashboard/campaigns/[id]/execute

Execute a campaign -- process all assigned leads through the configured channels.

**Auth:** Clerk (required)

**Validation:**
- Campaign must not be `active` or `completed`
- Campaign must have at least one assigned lead

**Response (200):**
```json
{
  "success": true,
  "progress": {
    "campaignId": "uuid",
    "total": 50,
    "processed": 50,
    "succeeded": 42,
    "failed": 8,
    "results": [
      {
        "leadId": "uuid",
        "leadName": "John Doe",
        "channel": "telegram",
        "status": "sent"
      },
      {
        "leadId": "uuid",
        "leadName": "Jane Smith",
        "channel": "voice",
        "status": "failed",
        "error": "No answer"
      }
    ]
  }
}
```

---

### POST /api/dashboard/campaigns/[id]/start

Set campaign status to `active`.

**Auth:** Clerk (required)

**Validation:** Campaign must not already be `active` or `completed`.

**Response (200):** Updated campaign object.

---

### POST /api/dashboard/campaigns/[id]/pause

Set campaign status to `paused`.

**Auth:** Clerk (required)

**Validation:** Campaign must be `active`.

**Response (200):** Updated campaign object.

---

### GET /api/dashboard/campaigns/[id]/leads

List leads assigned to a campaign.

**Auth:** Clerk (required)

**Query Parameters:**
| Param | Type | Default |
|-------|------|---------|
| `page` | number | 1 |
| `limit` | number | 100 |

**Response (200):**
```json
{
  "leads": [ /* lead objects */ ],
  "total": 150
}
```

---

### POST /api/dashboard/campaigns/[id]/leads

Assign leads to a campaign.

**Auth:** Clerk (required)

**Request body:**
```json
{
  "leadIds": ["uuid1", "uuid2", "uuid3"]
}
```

**Response (200):**
```json
{
  "success": true,
  "assigned": 3
}
```

---

### DELETE /api/dashboard/campaigns/[id]/leads

Remove leads from a campaign (sets `campaign_id` to null).

**Auth:** Clerk (required)

**Request body:**
```json
{
  "leadIds": ["uuid1", "uuid2"]
}
```

**Response (200):**
```json
{ "success": true }
```

---

## Leads

### GET /api/dashboard/leads

List leads with search and filtering.

**Auth:** Clerk (required)

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 25 | Items per page (max 100) |
| `search` | string | -- | Search across name, email, phone, company, telegram |
| `status` | string | all | Filter: `new`, `contacted`, `qualified`, `converted`, `rejected` |

**Response (200):**
```json
{
  "leads": [
    {
      "id": "uuid",
      "orgId": "uuid",
      "campaignId": "uuid | null",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+380501234567",
      "email": "john@example.com",
      "telegramUsername": "johndoe",
      "company": "Acme Inc",
      "metadata": {},
      "status": "new",
      "timezone": "Europe/Kyiv",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 25, "total": 500, "totalPages": 20 }
}
```

---

### POST /api/dashboard/leads

Create a single lead.

**Auth:** Clerk (required)

**Request body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+380501234567",
  "email": "john@example.com",
  "telegramUsername": "johndoe",
  "company": "Acme Inc",
  "timezone": "Europe/Kyiv"
}
```

All fields are optional, but at least one contact field (firstName, lastName, phone, email, or telegramUsername) is required.

**Response (201):** Full lead object.

---

### GET /api/dashboard/leads/[id]

Get a single lead.

**Auth:** Clerk (required)

**Response (200):** Full lead object.

---

### PATCH /api/dashboard/leads/[id]

Update a lead. All fields are optional.

**Auth:** Clerk (required)

**Request body:**
```json
{
  "firstName": "Updated",
  "status": "qualified",
  "company": "New Corp"
}
```

**Response (200):** Updated lead object.

---

### DELETE /api/dashboard/leads/[id]

Delete a lead.

**Auth:** Clerk (required)

**Response (200):**
```json
{ "success": true }
```

---

### POST /api/dashboard/leads/import

Import leads from a CSV file.

**Auth:** Clerk (required)

**Request:** `multipart/form-data` with a `file` field containing a `.csv` file.

**CSV columns** (header names, case-insensitive):
- `firstName` or `first_name`
- `lastName` or `last_name`
- `phone`
- `email`
- `telegramUsername` or `telegram_username` or `telegram`
- `company`
- `timezone`

**Response (200):**
```json
{
  "success": true,
  "imported": 95,
  "total": 100,
  "skipped": 5
}
```

Rows without any contact information are skipped. Batch inserts of 100 rows at a time.

---

## Scripts

### GET /api/dashboard/scripts

List all scripts for the organization.

**Auth:** Clerk (required)

**Response (200):** Array of script objects, ordered by `updatedAt` descending.

---

### POST /api/dashboard/scripts

Create a new script.

**Auth:** Clerk (required)

**Request body:**
```json
{
  "name": "Cold Call Script v2",
  "content": "Full script text here...",
  "objectionHandlers": [
    "If they say 'too expensive': Emphasize ROI and offer a trial",
    "If they say 'not interested': Ask what they are currently using"
  ]
}
```

`name` is required. `content` defaults to empty string. `objectionHandlers` defaults to empty array.

**Response (201):** Full script object.

---

### GET /api/dashboard/scripts/[id]

Get a single script.

**Auth:** Clerk (required)

**Response (200):** Full script object.

---

### PUT /api/dashboard/scripts/[id]

Update a script. All fields are optional.

**Auth:** Clerk (required)

**Request body:**
```json
{
  "name": "Updated Script Name",
  "content": "Updated content...",
  "objectionHandlers": ["New handler 1"]
}
```

**Response (200):** Updated script object.

---

### DELETE /api/dashboard/scripts/[id]

Delete a script.

**Auth:** Clerk (required)

**Response (200):**
```json
{ "success": true }
```

---

## Voice Configuration

### GET /api/dashboard/voice

Get the voice configuration for the organization. Creates a default config if none exists.

**Auth:** Clerk (required)

**Response (200):**
```json
{
  "id": "uuid",
  "orgId": "uuid",
  "voiceId": "B31Kx7rXmNnYqp1QWHR2",
  "voiceName": "Default Ukrainian",
  "selectedVoices": ["olena"],
  "language": "uk",
  "personality": "professional",
  "speed": 1.0,
  "isDefault": true,
  "createdAt": "2025-01-15T10:00:00Z"
}
```

---

### PUT /api/dashboard/voice

Update voice configuration.

**Auth:** Clerk (required)

**Request body:**
```json
{
  "selectedVoices": ["olena", "rachel"],
  "language": "uk",
  "personality": "friendly"
}
```

**Response (200):** Updated voice config object.

---

### POST /api/dashboard/voice/sync

Sync the current voice configuration and latest script to the Railway voice agent.

**Auth:** Clerk (required)

Sends a `POST /api/config` to the voice agent with the current script content, objection handlers, voice ID, language, and personality.

**Response (200):**
```json
{
  "success": true,
  "synced": {
    "script": "...",
    "objectionHandlers": [],
    "voiceId": "olena",
    "language": "uk",
    "personality": "professional"
  },
  "agentResponse": { "success": true, "config": { ... } }
}
```

---

## Call Logs

### GET /api/dashboard/calls

List call logs with pagination.

**Auth:** Clerk (required)

**Query Parameters:**
| Param | Type | Default |
|-------|------|---------|
| `page` | number | 1 |
| `limit` | number | 50 |

**Response (200):**
```json
{
  "calls": [
    {
      "id": "uuid",
      "direction": "outbound",
      "status": "completed",
      "fromNumber": "+14155551234",
      "toNumber": "+380501234567",
      "duration": 120,
      "startedAt": "2025-01-15T10:00:00Z",
      "summary": "Discussed product features",
      "sentiment": "positive"
    }
  ],
  "pagination": { "page": 1, "limit": 50, "total": 200, "totalPages": 4 }
}
```

---

### GET /api/dashboard/calls/[id]

Get a single call log with full transcript.

**Auth:** Clerk (required)

**Response (200):** Full call log object including `transcript` (JSONB array of `{role, content}`), `transcription` (flat text), `score`, `recordingUrl`, `metadata`.

---

## Phone Numbers

### GET /api/dashboard/numbers

List all phone numbers for the organization.

**Auth:** Clerk (required)

**Response (200):**
```json
{
  "numbers": [
    {
      "id": "uuid",
      "orgId": "uuid",
      "number": "+14155551234",
      "label": "Main Line",
      "provider": "twilio",
      "status": "active",
      "campaignId": "uuid | null",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

### POST /api/dashboard/numbers

Purchase a phone number via Twilio and save it to the database.

**Auth:** Clerk (required)

**Request body:**
```json
{
  "phoneNumber": "+14155551234",
  "label": "Sales Line"
}
```

**Response (201):** Phone number object.

Requires `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN` to be configured.

---

### GET /api/dashboard/numbers/available

Search for available phone numbers to purchase.

**Auth:** Clerk (required)

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `country` | string | US | Two-letter country code |
| `areaCode` | string | -- | Area code to filter by |

**Response (200):**
```json
{
  "numbers": [
    {
      "phoneNumber": "+14155551234",
      "friendlyName": "(415) 555-1234",
      "locality": "San Francisco",
      "region": "CA",
      "capabilities": { "voice": true, "sms": true, "mms": true }
    }
  ]
}
```

---

### GET /api/dashboard/numbers/[id]

Get a single phone number.

**Auth:** Clerk (required)

**Response (200):** Phone number object.

---

### PUT /api/dashboard/numbers/[id]

Update a phone number's label or campaign assignment.

**Auth:** Clerk (required)

**Request body:**
```json
{
  "label": "New Label",
  "campaignId": "uuid | null"
}
```

**Response (200):** Updated phone number object.

---

### DELETE /api/dashboard/numbers/[id]

Release a phone number from Twilio and delete from database.

**Auth:** Clerk (required)

**Response (200):**
```json
{ "success": true }
```

---

## Email

### POST /api/dashboard/email/send

Send an email to a lead via Resend.

**Auth:** Clerk (required)

**Request body:**
```json
{
  "leadId": "uuid",
  "campaignId": "uuid (optional)",
  "subject": "Quick question about your workflow",
  "body": "Hi John, I wanted to reach out...",
  "toEmail": "john@example.com"
}
```

Uses the org's email channel config for sender info (from address, reply-to).

**Response (200):**
```json
{
  "success": true,
  "messageId": "uuid",
  "resendId": "re_..."
}
```

---

### POST /api/dashboard/email/generate

Generate an AI-written email using OpenRouter (Gemini 2.0 Flash).

**Auth:** Clerk (required)

**Request body:**
```json
{
  "leadName": "John",
  "companyName": "Acme Inc",
  "scriptId": "uuid (optional)",
  "type": "initial | followup | final"
}
```

**Response (200):**
```json
{
  "subject": "A quick note for Acme Inc",
  "body": "Hi John,\n\nI'm reaching out from Project Noir..."
}
```

Falls back to template-based emails if the LLM call fails.

---

### POST /api/dashboard/email/test

Send a test email to the authenticated user's email address.

**Auth:** Clerk (required)

Requires email channel config to be saved first (from address).

**Response (200):**
```json
{
  "success": true,
  "to": "user@example.com"
}
```

---

### GET /api/dashboard/email/messages

List sent email messages.

**Auth:** Clerk (required)

**Query Parameters:**
| Param | Type | Default |
|-------|------|---------|
| `page` | number | 1 |
| `limit` | number | 50 |

**Response (200):**
```json
{
  "messages": [
    {
      "id": "uuid",
      "leadId": "uuid",
      "content": "Email body text...",
      "status": "sent",
      "metadata": { "subject": "...", "toEmail": "..." },
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 50
}
```

---

## Telegram

### GET /api/dashboard/telegram/accounts

List Telegram accounts assigned to the current organization.

**Auth:** Clerk (required)

**Response (200):**
```json
{
  "accounts": [
    {
      "id": "uuid",
      "phone": "+380501234567",
      "username": "sales_agent_1",
      "displayName": "Sales Agent",
      "status": "active",
      "dailyMessageCount": 15,
      "maxDailyMessages": 30,
      "lastMessageAt": "2025-01-15T10:00:00Z",
      "createdAt": "2025-01-10T08:00:00Z"
    }
  ]
}
```

---

## Billing

### POST /api/dashboard/billing/checkout

Create a Stripe checkout session for a subscription plan.

**Auth:** Clerk (required)

**Request body:**
```json
{
  "planId": "starter | growth | enterprise"
}
```

**Plan prices:**
| Plan | Price ID | Amount |
|------|----------|--------|
| starter | price_starter_monthly_40 | $40/mo |
| growth | price_growth_monthly_99 | $99/mo |
| enterprise | price_enterprise_monthly_299 | $299/mo |

**Response (200):**
```json
{
  "url": "https://checkout.stripe.com/c/pay/..."
}
```

---

### POST /api/dashboard/billing/portal

Create a Stripe billing portal session for managing subscriptions.

**Auth:** Clerk (required)

Requires an active Stripe customer (must have subscribed at least once).

**Response (200):**
```json
{
  "url": "https://billing.stripe.com/p/session/..."
}
```

---

### GET /api/dashboard/billing/usage

Get current month's usage statistics and plan limits.

**Auth:** Clerk (required)

**Response (200):**
```json
{
  "minutes": 150,
  "telegramMessages": 42,
  "emails": 200,
  "plan": "starter",
  "limits": {
    "minutes": 500,
    "telegram": 100,
    "emails": 500
  }
}
```

---

### POST /api/dashboard/billing/liqpay

Create a LiqPay payment for Ukrainian users (UAH).

**Auth:** Clerk (required)

**Request body:**
```json
{
  "planId": "starter | growth | enterprise"
}
```

**UAH prices:**
| Plan | Amount |
|------|--------|
| starter | 1,650 UAH/mo |
| growth | 4,100 UAH/mo |
| enterprise | 12,300 UAH/mo |

**Response (200):**
```json
{
  "data": "base64-encoded-payment-data",
  "signature": "base64-encoded-signature",
  "orderId": "liqpay_user_123_starter_1705334400"
}
```

---

### GET /api/dashboard/billing/payment-methods

Check which payment methods are configured.

**Auth:** None (no sensitive data)

**Response (200):**
```json
{
  "stripe": true,
  "liqpay": false
}
```

---

## Analytics

### GET /api/dashboard/analytics

Comprehensive cross-channel analytics for the organization.

**Auth:** Clerk (required)

**Response (200):**
```json
{
  "voice": {
    "total": 500,
    "avgDuration": 120,
    "completionRate": 85,
    "byStatus": [
      { "status": "completed", "count": 425 },
      { "status": "no_answer", "count": 50 }
    ]
  },
  "telegram": {
    "total": 200,
    "deliveredRate": 95,
    "replyRate": 15,
    "byStatus": [...]
  },
  "email": {
    "total": 300,
    "openRate": 45,
    "replyRate": 8,
    "byStatus": [...]
  },
  "activityChart": [
    { "day": "2025-01-15", "voice": 20, "telegram": 10, "email": 15 },
    { "day": "2025-01-16", "voice": 25, "telegram": 12, "email": 18 }
  ],
  "topCampaigns": [
    {
      "id": "uuid",
      "name": "Q1 Outreach",
      "channels": ["voice", "telegram"],
      "status": "completed",
      "contactsReached": 150,
      "responseRate": 25
    }
  ],
  "leadStatuses": {
    "total": 1000,
    "breakdown": [
      { "status": "new", "count": 500 },
      { "status": "contacted", "count": 300 }
    ]
  },
  "recentActivity": [
    {
      "id": "uuid",
      "channel": "voice",
      "action": "Called",
      "leadName": "John Doe",
      "leadPhone": "+380501234567",
      "time": "2025-01-15T10:30:00Z",
      "linkType": "call"
    }
  ]
}
```

Activity chart covers the last 7 days. Top campaigns shows up to 5 sorted by contacts reached. Recent activity shows the last 10 events across all channels.

---

## Channel Configuration

### GET /api/dashboard/channels

List all channel configurations for the organization.

**Auth:** Clerk (required)

**Response (200):**
```json
{
  "configs": [
    {
      "id": "uuid",
      "orgId": "uuid",
      "channel": "email",
      "config": {
        "fromEmail": "sales@yourdomain.com",
        "fromName": "Sales Team",
        "replyTo": "sales@yourdomain.com"
      },
      "status": "active",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

---

### PUT /api/dashboard/channels

Create or update a channel configuration. Uses upsert on `(org_id, channel)`.

**Auth:** Clerk (required)

**Request body:**
```json
{
  "channel": "email",
  "config": {
    "fromEmail": "sales@yourdomain.com",
    "fromName": "Sales Team",
    "replyTo": "sales@yourdomain.com"
  }
}
```

Valid channels: `voice`, `telegram`, `email`.

**Response (200):** Channel config object.

---

## Onboarding

### GET /api/dashboard/onboarding

Check if the user has completed onboarding.

**Auth:** Clerk (required)

**Response (200):**
```json
{
  "onboardingDone": false
}
```

---

### GET /api/dashboard/onboarding/complete

Check onboarding status (same as above).

**Auth:** Clerk (required)

---

### POST /api/dashboard/onboarding/complete

Mark onboarding as completed.

**Auth:** Clerk (required)

**Response (200):**
```json
{
  "success": true,
  "onboardingDone": true
}
```

---

## Settings / API Keys

### GET /api/dashboard/settings/api-keys

List API keys for the organization (shows prefix + last4, not the full key).

**Auth:** Clerk (required)

**Response (200):**
```json
{
  "keys": [
    {
      "id": "uuid",
      "name": "Production Key",
      "prefix": "tp_live_abc1",
      "last4": "ef90",
      "createdAt": "2025-01-15T10:00:00Z",
      "lastUsedAt": "2025-01-20T15:30:00Z"
    }
  ]
}
```

---

### POST /api/dashboard/settings/api-keys

Generate a new API key. The full key is returned ONLY in this response.

**Auth:** Clerk (required)

**Request body:**
```json
{
  "name": "Production Key"
}
```

**Response (201):**
```json
{
  "key": "tp_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4",
  "id": "uuid",
  "name": "Production Key",
  "prefix": "tp_live_a1b2",
  "last4": "w3x4",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

Key format: `tp_live_` + 64 random hex characters. Stored as SHA-256 hash.

---

### DELETE /api/dashboard/settings/api-keys

Delete an API key.

**Auth:** Clerk (required)

**Query Parameters:**
| Param | Type | Required |
|-------|------|----------|
| `id` | string | Yes |

**Response (200):**
```json
{ "success": true }
```

---

## Webhooks

### POST /api/webhook/stripe

Stripe webhook handler. Processes subscription lifecycle events.

**Auth:** Stripe signature verification (`STRIPE_WEBHOOK_SECRET`)

**Handled events:**
| Event | Action |
|-------|--------|
| `checkout.session.completed` | Activate subscription, set plan, save Stripe IDs |
| `customer.subscription.updated` | Update plan based on price ID; downgrade on cancel/unpaid |
| `customer.subscription.deleted` | Downgrade to free plan |
| `invoice.payment_failed` | Log error (Stripe retries automatically) |

**Response (200):**
```json
{ "received": true }
```

---

### POST /api/webhook/liqpay

LiqPay webhook handler. Processes payment callbacks.

**Auth:** LiqPay signature verification (`SHA1(private_key + data + private_key)`)

**Request:** `multipart/form-data` with `data` (base64 JSON) and `signature` fields.

**Order ID format:** `liqpay_{userId}_{planId}_{timestamp}`

**Handled statuses:**
| Status | Action |
|--------|--------|
| `subscribed`, `success` | Activate plan |
| `failure`, `error` | Log error |
| `reversed` | Downgrade to free |
| `unsubscribed` | Downgrade to free |

**Response (200):**
```json
{ "received": true }
```

---

## Demo

### POST /api/demo/email

Send a demo email from the landing page (public, no auth).

**Auth:** None

**Request body:**
```json
{
  "email": "visitor@example.com"
}
```

**Rate limit:** One email per address per hour (in-memory).

**Response (200):**
```json
{ "success": true }
```

---

### GET /api/demo/status

Check which channels are currently available/configured.

**Auth:** None

**Response (200):**
```json
{
  "call": true,
  "telegram": false,
  "email": true
}
```

- `call`: Always true (voice agent on Railway)
- `telegram`: True if Telegram Worker has active accounts
- `email`: True if Resend API key is configured

---

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "error": "Description of the error"
}
```

**Common HTTP status codes:**
| Code | Meaning |
|------|---------|
| 400 | Bad request (validation error) |
| 401 | Unauthorized (missing or invalid Clerk session) |
| 404 | Resource not found (or does not belong to this org) |
| 429 | Rate limited |
| 500 | Internal server error |
| 502 | External service error (voice agent, telegram worker) |
| 503 | Service not configured (missing API keys) |
