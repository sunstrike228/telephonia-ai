import { Mail, Sparkles, Send, Settings } from "lucide-react";

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

function Heading2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-display text-2xl font-bold text-white mt-14 mb-4 scroll-mt-20">
      <a href={`#${id}`} className="hover:text-[#ff4d4d] transition-colors duration-200">
        {children}
      </a>
    </h2>
  );
}

export default function EmailDocsPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
          <Mail className="w-3.5 h-3.5" />
          Email Channel
        </div>
        <h1 className="font-display text-4xl font-bold text-white tracking-tight mb-4">
          Email Outreach
        </h1>
        <p className="text-lg text-white/50 leading-relaxed">
          AI-generated personalized emails sent through Resend, with automatic
          content generation powered by OpenRouter (Gemini 2.0 Flash).
        </p>
      </div>

      {/* Overview */}
      <Heading2 id="overview">How It Works</Heading2>
      <p className="text-white/50 leading-relaxed mb-4">
        Email is the simplest channel -- it runs entirely within the Next.js dashboard
        (no external Python service needed). Emails can be sent manually from the
        dashboard or automatically through campaign execution.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { icon: <Sparkles className="w-5 h-5 text-purple-400" />, label: "AI Generation", desc: "Gemini 2.0 Flash generates personalized subject lines and body text" },
          { icon: <Send className="w-5 h-5 text-blue-400" />, label: "Resend Delivery", desc: "High-deliverability email API with tracking" },
          { icon: <Settings className="w-5 h-5 text-amber-400" />, label: "Custom Sender", desc: "Configure from address, reply-to, and sender name per org" },
        ].map((item) => (
          <div key={item.label} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="mb-2">{item.icon}</div>
            <p className="text-sm font-medium text-white/80">{item.label}</p>
            <p className="text-xs text-white/35 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* API Endpoints */}
      <Heading2 id="api">Email API Endpoints</Heading2>
      <div className="space-y-3 mb-6">
        {[
          { method: "POST", path: "/api/dashboard/email/send", desc: "Send an email to a lead via Resend" },
          { method: "POST", path: "/api/dashboard/email/generate", desc: "Generate AI-written email content" },
          { method: "POST", path: "/api/dashboard/email/test", desc: "Send a test email to yourself" },
          { method: "GET", path: "/api/dashboard/email/messages", desc: "List sent email messages" },
        ].map((ep) => (
          <div key={ep.path} className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${ep.method === "GET" ? "bg-emerald-500/15 text-emerald-400" : "bg-blue-500/15 text-blue-400"}`}>
              {ep.method}
            </span>
            <code className="text-sm font-mono text-white/70">{ep.path}</code>
            <span className="text-xs text-white/35 ml-auto hidden sm:inline">{ep.desc}</span>
          </div>
        ))}
      </div>

      {/* AI Generation */}
      <Heading2 id="ai-generation">AI Email Generation</Heading2>
      <p className="text-white/50 leading-relaxed mb-4">
        The email generation endpoint uses OpenRouter (Gemini 2.0 Flash) to create
        personalized emails based on the lead information and selected script.
      </p>
      <CodeBlock title="Generation Flow">
{`User opens Email page in dashboard
    |
    |  Fills in lead name, company, selects script, email type
    v
POST /api/dashboard/email/generate
    |
    |  Load script content from DB
    |  Load voice config (language, personality)
    |  buildEmailPrompt() -> Build prompt template
    v
OpenRouter API (Gemini 2.0 Flash):
    |  Generate personalized email subject + body
    |  Parse JSON response: { "subject": "...", "body": "..." }
    v
Dashboard: Returns generated email for user review
    |
    |  User edits and clicks "Send"
    v
POST /api/dashboard/email/send
    |  Resend API sends the email
    |  Result logged to messages table`}
      </CodeBlock>

      <p className="text-white/50 leading-relaxed mb-4">
        The system supports three email types for different stages of the outreach funnel:
      </p>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[
          { type: "initial", desc: "First contact email" },
          { type: "followup", desc: "Follow-up after no reply" },
          { type: "final", desc: "Last attempt before closing" },
        ].map(({ type, desc }) => (
          <div key={type} className="px-3 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-center">
            <p className="text-sm font-mono text-[#ff4d4d]">{type}</p>
            <p className="text-[10px] text-white/35 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      {/* Channel Config */}
      <Heading2 id="configuration">Email Configuration</Heading2>
      <p className="text-white/50 leading-relaxed mb-4">
        Email sender settings are stored in the <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-white/60">channel_configs</code> table
        per organization. Configure these from the dashboard settings.
      </p>
      <CodeBlock title="Email Channel Config">
{`{
  "channel": "email",
  "config": {
    "fromEmail": "sales@yourdomain.com",
    "fromName": "Sales Team",
    "replyTo": "sales@yourdomain.com"
  }
}`}
      </CodeBlock>
      <p className="text-sm text-white/40 mb-6">
        If no email config is set, the default sender is <code className="px-1 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-white/50">noreply@projectnoir.ai</code>.
      </p>

      {/* Campaign Integration */}
      <Heading2 id="campaign">Campaign Integration</Heading2>
      <p className="text-white/50 leading-relaxed mb-4">
        During campaign execution, the email channel is typically the last priority
        (after Telegram and voice) since it has the lowest response rate. The campaign
        executor handles email automatically:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-white/50 mb-6">
        <li>Check if lead has an email address</li>
        <li>Build a personalized AI prompt using the campaign script</li>
        <li>Send via Resend API with the org&apos;s configured sender</li>
        <li>Log the result to the messages table</li>
        <li>Apply a 3-second inter-lead delay</li>
      </ol>

      {/* Message Statuses */}
      <Heading2 id="statuses">Message Statuses</Heading2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {[
          { status: "pending", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
          { status: "sent", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
          { status: "delivered", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
          { status: "read", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
          { status: "replied", color: "text-green-400 bg-green-500/10 border-green-500/20" },
          { status: "failed", color: "text-red-400 bg-red-500/10 border-red-500/20" },
        ].map(({ status, color }) => (
          <div key={status} className={`px-3 py-2 rounded-lg border text-sm font-mono text-center ${color}`}>
            {status}
          </div>
        ))}
      </div>
    </div>
  );
}
