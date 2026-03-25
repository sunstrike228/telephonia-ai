import { MessageCircle, Users, Clock, Shield, AlertTriangle } from "lucide-react";

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[rgba(0,0,0,0.95)] overflow-hidden my-4">
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

export default function TelegramDocsPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-4">
          <MessageCircle className="w-3.5 h-3.5" />
          Telegram Channel
        </div>
        <h1 className="font-display text-4xl font-bold text-white tracking-tight mb-4">
          Telegram Outreach
        </h1>
        <p className="text-lg text-white/50 leading-relaxed">
          Automated Telegram messaging using Telethon user accounts with intelligent
          account pooling, rate limiting, and warmup tracking.
        </p>
      </div>

      {/* Why User Accounts */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 mb-10">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-display font-semibold text-white text-sm mb-1">Why User Accounts?</h3>
            <p className="text-sm text-white/45 leading-relaxed">
              The Telegram Bot API cannot initiate DMs to users who have not started the bot.
              User accounts (via Telethon) can message anyone by username, which is critical
              for outreach campaigns. Account pooling distributes risk and increases throughput.
            </p>
          </div>
        </div>
      </div>

      {/* Architecture */}
      <Heading2 id="architecture">Architecture</Heading2>
      <CodeBlock title="telegram-worker/">
{`telegram-worker/
├── main.py              # FastAPI app with all endpoints
├── account_manager.py   # Telethon client pool + auth flow + send logic
├── db.py                # Database operations (messages, accounts)
├── config.py            # Environment config (rate limits, delays)
├── requirements.txt
└── Dockerfile           # Railway deployment (port 7861)`}
      </CodeBlock>

      {/* API Endpoints */}
      <Heading2 id="api">Worker API Endpoints</Heading2>
      <div className="space-y-3 mb-6">
        {[
          { method: "POST", path: "/api/send", desc: "Send a message to a Telegram user" },
          { method: "POST", path: "/api/accounts/add", desc: "Add a new Telegram account to the pool" },
          { method: "POST", path: "/api/accounts/:id/verify", desc: "Verify account with 2FA code" },
          { method: "GET", path: "/api/accounts", desc: "List all accounts with status" },
          { method: "GET", path: "/api/health", desc: "Health check endpoint" },
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

      {/* Account Pooling */}
      <Heading2 id="pooling">Account Pooling</Heading2>
      <p className="text-white/50 leading-relaxed mb-4">
        The Telegram worker manages a pool of user accounts. When a message needs to be sent,
        it automatically selects the best account based on:
      </p>
      <ul className="list-disc list-inside space-y-2 text-white/50 mb-6">
        <li>Account with the fewest daily sends (load balancing)</li>
        <li>Daily message limit not exceeded (default: 30/account)</li>
        <li>Account status is active (not banned, not in cooldown)</li>
        <li>Account is assigned to the requesting organization</li>
      </ul>

      {/* Account Statuses */}
      <Heading2 id="statuses">Account Statuses</Heading2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-6">
        {[
          { status: "warming_up", color: "text-amber-400 bg-amber-500/10 border-amber-500/20", desc: "New account, limited sends" },
          { status: "active", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20", desc: "Ready to send" },
          { status: "assigned", color: "text-blue-400 bg-blue-500/10 border-blue-500/20", desc: "Assigned to an org" },
          { status: "banned", color: "text-red-400 bg-red-500/10 border-red-500/20", desc: "Blocked by Telegram" },
          { status: "cooldown", color: "text-purple-400 bg-purple-500/10 border-purple-500/20", desc: "Temporarily paused" },
        ].map(({ status, color, desc }) => (
          <div key={status} className={`px-3 py-2.5 rounded-lg border ${color}`}>
            <p className="text-sm font-mono">{status}</p>
            <p className="text-[10px] opacity-60 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      {/* Rate Limiting */}
      <Heading2 id="rate-limiting">Rate Limiting</Heading2>
      <p className="text-white/50 leading-relaxed mb-4">
        The worker implements several layers of rate limiting to avoid Telegram bans:
      </p>
      <div className="rounded-xl border border-white/[0.08] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Limit</th>
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Default</th>
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Configurable</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Max daily messages per account", "30", "MAX_DAILY_MESSAGES_PER_ACCOUNT"],
              ["Min delay between sends", "30 seconds", "MESSAGE_DELAY_MIN"],
              ["Max delay between sends", "90 seconds", "MESSAGE_DELAY_MAX"],
              ["Inter-lead campaign delay", "60 seconds", "Hardcoded in executor"],
            ].map(([limit, def, config], i) => (
              <tr key={limit} className={`border-b border-white/[0.04] ${i % 2 === 1 ? "bg-white/[0.015]" : ""}`}>
                <td className="px-5 py-3 text-white/70">{limit}</td>
                <td className="px-5 py-3 text-white/45">{def}</td>
                <td className="px-5 py-3 font-mono text-xs text-white/35">{config}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Message Flow */}
      <Heading2 id="message-flow">Message Flow</Heading2>
      <CodeBlock title="Send Message Sequence">
{`POST /api/send { orgId, username, message }
    |
    v
1. manager.get_available_account(orgId)
   -> Select account with fewest daily sends
   -> Check daily limit not exceeded
    |
    v
2. Random delay (30-90 seconds)
    |
    v
3. manager.send_message()
   -> client.get_entity(username)
   -> client.send_message(entity, message)
   -> db.increment_daily_sent()
    |
    v
4. db.log_message() -> INSERT INTO messages
    |
    v
5. Return { success: true, messageId: "..." }`}
      </CodeBlock>
    </div>
  );
}
