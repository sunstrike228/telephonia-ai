import { Code, Shield, Lock } from "lucide-react";

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[rgba(14,14,22,0.95)] overflow-hidden my-4">
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

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    POST: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    PUT: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    PATCH: "bg-orange-500/15 text-orange-400 border-orange-500/20",
    DELETE: "bg-red-500/15 text-red-400 border-red-500/20",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${colors[method] || "bg-white/10 text-white/60"}`}>
      {method}
    </span>
  );
}

function Endpoint({
  method,
  path,
  description,
  auth,
  children,
}: {
  method: string;
  path: string;
  description: string;
  auth: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] mb-6 overflow-hidden">
      <div className="px-5 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3 mb-2">
          <MethodBadge method={method} />
          <code className="text-sm font-mono text-white/80">{path}</code>
        </div>
        <p className="text-sm text-white/45">{description}</p>
        <div className="mt-2 flex items-center gap-1.5 text-xs text-white/30">
          {auth === "None" ? (
            <span className="text-emerald-400/60">Public</span>
          ) : (
            <>
              <Lock className="w-3 h-3" />
              <span>{auth}</span>
            </>
          )}
        </div>
      </div>
      {children && <div className="px-5 py-4">{children}</div>}
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

function ParamTable({ params }: { params: [string, string, string, string][] }) {
  return (
    <div className="rounded-lg border border-white/[0.06] overflow-hidden my-3">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="text-left px-3 py-2 text-white/40 font-medium">Param</th>
            <th className="text-left px-3 py-2 text-white/40 font-medium">Type</th>
            <th className="text-left px-3 py-2 text-white/40 font-medium">Default</th>
            <th className="text-left px-3 py-2 text-white/40 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map(([param, type, def, desc], i) => (
            <tr key={param} className={`border-b border-white/[0.03] ${i % 2 === 1 ? "bg-white/[0.01]" : ""}`}>
              <td className="px-3 py-2 font-mono text-[#ff4d4d]">{param}</td>
              <td className="px-3 py-2 text-white/50">{type}</td>
              <td className="px-3 py-2 text-white/30">{def}</td>
              <td className="px-3 py-2 text-white/45">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ApiReferencePage() {
  return (
    <div>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
          <Code className="w-3.5 h-3.5" />
          API Reference
        </div>
        <h1 className="font-display text-4xl font-bold text-white tracking-tight mb-4">
          API Reference
        </h1>
        <p className="text-lg text-white/50 leading-relaxed">
          Complete reference for all 37 API endpoints. All <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-white/60">/api/dashboard/*</code> routes
          require Clerk authentication. Webhook routes use signature verification.
        </p>
      </div>

      {/* TOC */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-10">
        <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Endpoints</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {[
            ["campaigns", "Campaigns (8)"],
            ["leads", "Leads (4)"],
            ["scripts", "Scripts (4)"],
            ["voice", "Voice Config (3)"],
            ["calls", "Call Logs (2)"],
            ["numbers", "Phone Numbers (4)"],
            ["email", "Email (4)"],
            ["telegram", "Telegram (1)"],
            ["billing", "Billing (5)"],
            ["analytics", "Analytics (1)"],
            ["channels", "Channels (2)"],
            ["settings", "API Keys (3)"],
            ["webhooks", "Webhooks (2)"],
            ["demo", "Demo (2)"],
          ].map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-sm text-white/40 hover:text-[#ff4d4d] transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Authentication note */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 mb-10">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display font-semibold text-white text-sm mb-1">Authentication</h3>
            <p className="text-sm text-white/45 leading-relaxed">
              All <code className="px-1 py-0.5 rounded bg-white/[0.06] text-xs font-mono">/api/dashboard/*</code> routes
              require a valid Clerk session. Webhook routes verify signatures. Demo routes are public.
              All errors return <code className="px-1 py-0.5 rounded bg-white/[0.06] text-xs font-mono">{`{ "error": "..." }`}</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Campaigns */}
      <Heading2 id="campaigns">Campaigns</Heading2>

      <Endpoint method="GET" path="/api/dashboard/campaigns" description="List campaigns for the current organization." auth="Clerk">
        <ParamTable params={[
          ["page", "number", "1", "Page number"],
          ["limit", "number", "25", "Items per page (max 100)"],
          ["status", "string", "all", "Filter: draft, active, paused, completed, or all"],
        ]} />
        <CodeBlock title="Response 200">
{`{
  "campaigns": [
    {
      "id": "uuid",
      "name": "Q1 Outreach",
      "status": "draft",
      "channels": ["voice", "telegram"],
      "channelPriority": ["telegram", "voice", "email"],
      "leadCount": 150,
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 25, "total": 42, "totalPages": 2 }
}`}
        </CodeBlock>
      </Endpoint>

      <Endpoint method="POST" path="/api/dashboard/campaigns" description="Create a new campaign. Name is required." auth="Clerk">
        <CodeBlock title="Request Body">
{`{
  "name": "Q1 Outreach",
  "scriptId": "uuid (optional)",
  "channels": ["voice", "telegram", "email"],
  "channelPriority": ["telegram", "voice", "email"]
}`}
        </CodeBlock>
      </Endpoint>

      <Endpoint method="GET" path="/api/dashboard/campaigns/[id]" description="Get a single campaign with lead statistics." auth="Clerk" />

      <Endpoint method="PATCH" path="/api/dashboard/campaigns/[id]" description="Update a campaign. All fields are optional." auth="Clerk" />

      <Endpoint method="DELETE" path="/api/dashboard/campaigns/[id]" description="Delete a campaign." auth="Clerk" />

      <Endpoint method="POST" path="/api/dashboard/campaigns/[id]/execute" description="Execute a campaign -- process all assigned leads through configured channels." auth="Clerk">
        <CodeBlock title="Response 200">
{`{
  "success": true,
  "progress": {
    "total": 50,
    "processed": 50,
    "succeeded": 42,
    "failed": 8,
    "results": [
      { "leadId": "uuid", "channel": "telegram", "status": "sent" },
      { "leadId": "uuid", "channel": "voice", "status": "failed", "error": "No answer" }
    ]
  }
}`}
        </CodeBlock>
      </Endpoint>

      <Endpoint method="POST" path="/api/dashboard/campaigns/[id]/start" description="Set campaign status to active." auth="Clerk" />
      <Endpoint method="POST" path="/api/dashboard/campaigns/[id]/pause" description="Set campaign status to paused." auth="Clerk" />

      <Endpoint method="GET" path="/api/dashboard/campaigns/[id]/leads" description="List leads assigned to a campaign." auth="Clerk">
        <ParamTable params={[
          ["page", "number", "1", "Page number"],
          ["limit", "number", "100", "Items per page"],
        ]} />
      </Endpoint>

      <Endpoint method="POST" path="/api/dashboard/campaigns/[id]/leads" description="Assign leads to a campaign." auth="Clerk">
        <CodeBlock title="Request Body">
{`{ "leadIds": ["uuid1", "uuid2", "uuid3"] }`}
        </CodeBlock>
      </Endpoint>

      <Endpoint method="DELETE" path="/api/dashboard/campaigns/[id]/leads" description="Remove leads from a campaign." auth="Clerk" />

      {/* Leads */}
      <Heading2 id="leads">Leads</Heading2>

      <Endpoint method="GET" path="/api/dashboard/leads" description="List leads with search and filtering." auth="Clerk">
        <ParamTable params={[
          ["page", "number", "1", "Page number"],
          ["limit", "number", "25", "Items per page (max 100)"],
          ["search", "string", "--", "Search across name, email, phone, company, telegram"],
          ["status", "string", "all", "Filter: new, contacted, qualified, converted, rejected"],
        ]} />
        <CodeBlock title="Response 200">
{`{
  "leads": [
    {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+380501234567",
      "email": "john@example.com",
      "telegramUsername": "johndoe",
      "company": "Acme Inc",
      "status": "new"
    }
  ],
  "pagination": { "page": 1, "limit": 25, "total": 500, "totalPages": 20 }
}`}
        </CodeBlock>
      </Endpoint>

      <Endpoint method="POST" path="/api/dashboard/leads" description="Create a single lead. At least one contact field is required." auth="Clerk" />
      <Endpoint method="GET" path="/api/dashboard/leads/[id]" description="Get a single lead." auth="Clerk" />
      <Endpoint method="PATCH" path="/api/dashboard/leads/[id]" description="Update a lead. All fields are optional." auth="Clerk" />
      <Endpoint method="DELETE" path="/api/dashboard/leads/[id]" description="Delete a lead." auth="Clerk" />

      <Endpoint method="POST" path="/api/dashboard/leads/import" description="Import leads from a CSV file. Rows without contact info are skipped." auth="Clerk">
        <p className="text-xs text-white/40 mb-2">Request: multipart/form-data with a file field containing a .csv file.</p>
        <p className="text-xs text-white/40">CSV columns: firstName, lastName, phone, email, telegramUsername, company, timezone</p>
      </Endpoint>

      {/* Scripts */}
      <Heading2 id="scripts">Scripts</Heading2>

      <Endpoint method="GET" path="/api/dashboard/scripts" description="List all scripts for the organization." auth="Clerk" />
      <Endpoint method="POST" path="/api/dashboard/scripts" description="Create a new script. Name is required." auth="Clerk">
        <CodeBlock title="Request Body">
{`{
  "name": "Cold Call Script v2",
  "content": "Full script text here...",
  "objectionHandlers": [
    "If they say 'too expensive': Emphasize ROI and offer a trial"
  ]
}`}
        </CodeBlock>
      </Endpoint>
      <Endpoint method="GET" path="/api/dashboard/scripts/[id]" description="Get a single script." auth="Clerk" />
      <Endpoint method="PUT" path="/api/dashboard/scripts/[id]" description="Update a script. All fields are optional." auth="Clerk" />
      <Endpoint method="DELETE" path="/api/dashboard/scripts/[id]" description="Delete a script." auth="Clerk" />

      {/* Voice */}
      <Heading2 id="voice">Voice Configuration</Heading2>

      <Endpoint method="GET" path="/api/dashboard/voice" description="Get the voice configuration for the organization. Creates a default if none exists." auth="Clerk">
        <CodeBlock title="Response 200">
{`{
  "id": "uuid",
  "voiceId": "B31Kx7rXmNnYqp1QWHR2",
  "selectedVoices": ["olena"],
  "language": "uk",
  "personality": "professional",
  "speed": 1.0
}`}
        </CodeBlock>
      </Endpoint>
      <Endpoint method="PUT" path="/api/dashboard/voice" description="Update voice configuration." auth="Clerk" />
      <Endpoint method="POST" path="/api/dashboard/voice/sync" description="Sync current voice config and latest script to the Railway voice agent." auth="Clerk" />

      {/* Calls */}
      <Heading2 id="calls">Call Logs</Heading2>

      <Endpoint method="GET" path="/api/dashboard/calls" description="List call logs with pagination." auth="Clerk">
        <ParamTable params={[
          ["page", "number", "1", "Page number"],
          ["limit", "number", "50", "Items per page"],
        ]} />
      </Endpoint>
      <Endpoint method="GET" path="/api/dashboard/calls/[id]" description="Get a single call log with full transcript." auth="Clerk" />

      {/* Numbers */}
      <Heading2 id="numbers">Phone Numbers</Heading2>

      <Endpoint method="GET" path="/api/dashboard/numbers" description="List all phone numbers for the organization." auth="Clerk" />
      <Endpoint method="POST" path="/api/dashboard/numbers" description="Purchase a phone number via Twilio." auth="Clerk">
        <CodeBlock title="Request Body">
{`{ "phoneNumber": "+14155551234", "label": "Sales Line" }`}
        </CodeBlock>
      </Endpoint>
      <Endpoint method="GET" path="/api/dashboard/numbers/available" description="Search for available phone numbers to purchase." auth="Clerk">
        <ParamTable params={[
          ["country", "string", "US", "Two-letter country code"],
          ["areaCode", "string", "--", "Area code to filter by"],
        ]} />
      </Endpoint>
      <Endpoint method="GET" path="/api/dashboard/numbers/[id]" description="Get a single phone number." auth="Clerk" />
      <Endpoint method="PUT" path="/api/dashboard/numbers/[id]" description="Update a phone number's label or campaign assignment." auth="Clerk" />
      <Endpoint method="DELETE" path="/api/dashboard/numbers/[id]" description="Release a phone number from Twilio and delete from database." auth="Clerk" />

      {/* Email */}
      <Heading2 id="email">Email</Heading2>

      <Endpoint method="POST" path="/api/dashboard/email/send" description="Send an email to a lead via Resend." auth="Clerk">
        <CodeBlock title="Request Body">
{`{
  "leadId": "uuid",
  "subject": "Quick question about your workflow",
  "body": "Hi John, I wanted to reach out...",
  "toEmail": "john@example.com"
}`}
        </CodeBlock>
      </Endpoint>
      <Endpoint method="POST" path="/api/dashboard/email/generate" description="Generate an AI-written email using OpenRouter (Gemini 2.0 Flash)." auth="Clerk">
        <CodeBlock title="Request Body">
{`{
  "leadName": "John",
  "companyName": "Acme Inc",
  "scriptId": "uuid (optional)",
  "type": "initial | followup | final"
}`}
        </CodeBlock>
      </Endpoint>
      <Endpoint method="POST" path="/api/dashboard/email/test" description="Send a test email to the authenticated user's email address." auth="Clerk" />
      <Endpoint method="GET" path="/api/dashboard/email/messages" description="List sent email messages." auth="Clerk" />

      {/* Telegram */}
      <Heading2 id="telegram">Telegram</Heading2>

      <Endpoint method="GET" path="/api/dashboard/telegram/accounts" description="List Telegram accounts assigned to the current organization." auth="Clerk">
        <CodeBlock title="Response 200">
{`{
  "accounts": [
    {
      "id": "uuid",
      "phone": "+380501234567",
      "username": "sales_agent_1",
      "status": "active",
      "dailyMessageCount": 15,
      "maxDailyMessages": 30
    }
  ]
}`}
        </CodeBlock>
      </Endpoint>

      {/* Billing */}
      <Heading2 id="billing">Billing</Heading2>

      <Endpoint method="POST" path="/api/dashboard/billing/checkout" description="Create a Stripe checkout session for a subscription plan." auth="Clerk">
        <CodeBlock title="Request Body">
{`{ "planId": "starter | growth | enterprise" }`}
        </CodeBlock>
        <div className="rounded-lg border border-white/[0.06] overflow-hidden mt-3">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-3 py-2 text-white/40">Plan</th>
                <th className="text-left px-3 py-2 text-white/40">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/[0.03]"><td className="px-3 py-2 text-white/60">Starter</td><td className="px-3 py-2 text-white/45">$40/mo</td></tr>
              <tr className="border-b border-white/[0.03] bg-white/[0.01]"><td className="px-3 py-2 text-white/60">Growth</td><td className="px-3 py-2 text-white/45">$99/mo</td></tr>
              <tr><td className="px-3 py-2 text-white/60">Enterprise</td><td className="px-3 py-2 text-white/45">$299/mo</td></tr>
            </tbody>
          </table>
        </div>
      </Endpoint>

      <Endpoint method="POST" path="/api/dashboard/billing/portal" description="Create a Stripe billing portal session." auth="Clerk" />
      <Endpoint method="GET" path="/api/dashboard/billing/usage" description="Get current month's usage statistics and plan limits." auth="Clerk">
        <CodeBlock title="Response 200">
{`{
  "minutes": 150,
  "telegramMessages": 42,
  "emails": 200,
  "plan": "starter",
  "limits": { "minutes": 500, "telegram": 100, "emails": 500 }
}`}
        </CodeBlock>
      </Endpoint>
      <Endpoint method="POST" path="/api/dashboard/billing/liqpay" description="Create a LiqPay payment for Ukrainian users (UAH)." auth="Clerk" />
      <Endpoint method="GET" path="/api/dashboard/billing/payment-methods" description="Check which payment methods are configured." auth="None" />

      {/* Analytics */}
      <Heading2 id="analytics">Analytics</Heading2>

      <Endpoint method="GET" path="/api/dashboard/analytics" description="Comprehensive cross-channel analytics for the organization." auth="Clerk">
        <p className="text-xs text-white/40 mb-2">
          Returns voice stats, telegram stats, email stats, activity chart (7 days),
          top 5 campaigns, lead status breakdown, and recent 10 activities.
        </p>
      </Endpoint>

      {/* Channels */}
      <Heading2 id="channels">Channel Configuration</Heading2>

      <Endpoint method="GET" path="/api/dashboard/channels" description="List all channel configurations for the organization." auth="Clerk" />
      <Endpoint method="PUT" path="/api/dashboard/channels" description="Create or update a channel configuration. Uses upsert on (org_id, channel)." auth="Clerk">
        <CodeBlock title="Request Body">
{`{
  "channel": "email",
  "config": {
    "fromEmail": "sales@yourdomain.com",
    "fromName": "Sales Team",
    "replyTo": "sales@yourdomain.com"
  }
}`}
        </CodeBlock>
      </Endpoint>

      {/* Settings */}
      <Heading2 id="settings">Settings / API Keys</Heading2>

      <Endpoint method="GET" path="/api/dashboard/settings/api-keys" description="List API keys for the organization (prefix + last4 only)." auth="Clerk" />
      <Endpoint method="POST" path="/api/dashboard/settings/api-keys" description="Generate a new API key. Full key is returned ONLY in this response." auth="Clerk">
        <CodeBlock title="Response 201">
{`{
  "key": "tp_live_a1b2c3d4e5f6...",
  "id": "uuid",
  "name": "Production Key",
  "prefix": "tp_live_a1b2",
  "last4": "w3x4"
}`}
        </CodeBlock>
      </Endpoint>
      <Endpoint method="DELETE" path="/api/dashboard/settings/api-keys?id=uuid" description="Delete an API key." auth="Clerk" />

      {/* Webhooks */}
      <Heading2 id="webhooks">Webhooks</Heading2>

      <Endpoint method="POST" path="/api/webhook/stripe" description="Stripe webhook handler. Processes subscription lifecycle events." auth="Stripe signature">
        <div className="rounded-lg border border-white/[0.06] overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-3 py-2 text-white/40">Event</th>
                <th className="text-left px-3 py-2 text-white/40">Action</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["checkout.session.completed", "Activate subscription, set plan"],
                ["customer.subscription.updated", "Update plan; downgrade on cancel"],
                ["customer.subscription.deleted", "Downgrade to free plan"],
                ["invoice.payment_failed", "Log error (Stripe retries)"],
              ].map(([event, action], i) => (
                <tr key={event} className={`border-b border-white/[0.03] ${i % 2 === 1 ? "bg-white/[0.01]" : ""}`}>
                  <td className="px-3 py-2 font-mono text-white/50">{event}</td>
                  <td className="px-3 py-2 text-white/40">{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Endpoint>

      <Endpoint method="POST" path="/api/webhook/liqpay" description="LiqPay webhook handler. Processes payment callbacks with signature verification." auth="LiqPay signature" />

      {/* Demo */}
      <Heading2 id="demo">Demo</Heading2>

      <Endpoint method="POST" path="/api/demo/email" description="Send a demo email from the landing page. Rate limited to one per address per hour." auth="None" />
      <Endpoint method="GET" path="/api/demo/status" description="Check which channels are currently available/configured." auth="None" />

      {/* Error Responses */}
      <Heading2 id="errors">Error Responses</Heading2>
      <p className="text-white/50 leading-relaxed mb-4">
        All endpoints return errors in a consistent format:
      </p>
      <CodeBlock title="Error Format">
{`{ "error": "Description of the error" }`}
      </CodeBlock>
      <div className="rounded-xl border border-white/[0.08] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Code</th>
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Meaning</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["400", "Bad request (validation error)"],
              ["401", "Unauthorized (missing or invalid Clerk session)"],
              ["404", "Resource not found (or does not belong to this org)"],
              ["429", "Rate limited"],
              ["500", "Internal server error"],
              ["502", "External service error (voice agent, telegram worker)"],
              ["503", "Service not configured (missing API keys)"],
            ].map(([code, meaning], i) => (
              <tr key={code} className={`border-b border-white/[0.04] ${i % 2 === 1 ? "bg-white/[0.015]" : ""}`}>
                <td className="px-5 py-3 font-mono text-[#ff4d4d] text-sm">{code}</td>
                <td className="px-5 py-3 text-white/45">{meaning}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
