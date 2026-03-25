import { Zap, CheckCircle2, Terminal, Database, Key, Globe } from "lucide-react";

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

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="relative pl-10 pb-8 border-l border-white/[0.06] ml-4">
      <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-[#ff4d4d]/10 border border-[#ff4d4d]/30 flex items-center justify-center text-[#ff4d4d] text-sm font-bold font-display">
        {number}
      </div>
      <h3 className="font-display font-semibold text-white text-lg mb-3 pt-0.5">{title}</h3>
      <div className="text-white/50 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function QuickStartPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff4d4d]/10 border border-[#ff4d4d]/20 text-[#ff4d4d] text-xs font-medium mb-4">
          <Zap className="w-3.5 h-3.5" />
          Quick Start
        </div>
        <h1 className="font-display text-4xl font-bold text-white tracking-tight mb-4">
          Quick Start Guide
        </h1>
        <p className="text-lg text-white/50 leading-relaxed">
          Get Project Noir running locally in under 10 minutes. This guide covers
          the dashboard setup. Voice agent and Telegram worker are optional for initial setup.
        </p>
      </div>

      {/* Prerequisites */}
      <Heading2 id="prerequisites">Prerequisites</Heading2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {[
          ["Node.js 20+", "Required for the Next.js dashboard"],
          ["Python 3.11+", "Required for voice agent and Telegram worker"],
          ["PostgreSQL", "Or a Neon account for serverless"],
          ["Service Accounts", "Clerk, Stripe, Twilio, Deepgram, ElevenLabs, OpenRouter, Resend"],
        ].map(([name, desc]) => (
          <div key={name} className="flex items-start gap-3 p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-white/80 font-medium">{name}</p>
              <p className="text-xs text-white/40">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Steps */}
      <Heading2 id="setup">Setup Steps</Heading2>

      <Step number={1} title="Clone and Install">
        <p>Clone the repository and install dependencies for the Next.js dashboard.</p>
        <CodeBlock title="Terminal">
{`cd telephonia-react
cp .env.example .env.local       # Fill in all values
npm install`}
        </CodeBlock>
      </Step>

      <Step number={2} title="Configure Environment Variables">
        <p>
          Copy <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-white/60">.env.example</code> to{" "}
          <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-white/60">.env.local</code> and
          fill in all required values. At minimum you need:
        </p>
        <CodeBlock title=".env.local (minimum required)">
{`# Database
DATABASE_URL="postgresql://..."

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."

# Optional for full functionality:
STRIPE_SECRET_KEY="sk_..."
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
RESEND_API_KEY="re_..."
OPENROUTER_API_KEY="sk-or-..."
RAILWAY_VOICE_AGENT_URL="https://..."
SENTRY_DSN="https://..."`}
        </CodeBlock>
      </Step>

      <Step number={3} title="Set Up Database">
        <p>Push the Drizzle schema to your Neon PostgreSQL database.</p>
        <CodeBlock title="Terminal">
{`npx drizzle-kit push             # Push schema to database
npx drizzle-kit studio           # (Optional) Visual database browser`}
        </CodeBlock>
      </Step>

      <Step number={4} title="Start the Dashboard">
        <p>Run the Next.js development server.</p>
        <CodeBlock title="Terminal">
{`npm run dev                      # http://localhost:3000`}
        </CodeBlock>
        <p>
          Visit <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-white/60">http://localhost:3000</code> to
          see the landing page. Sign up via Clerk to access the dashboard.
        </p>
      </Step>

      <Step number={5} title="(Optional) Start Voice Agent">
        <p>Set up the Python voice agent for AI phone calls.</p>
        <CodeBlock title="Terminal">
{`cd voice-agent
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env             # Fill in all values
python server.py -t daily --host 0.0.0.0 --port 7860`}
        </CodeBlock>
      </Step>

      <Step number={6} title="(Optional) Start Telegram Worker">
        <p>Set up the Python Telegram worker for automated messaging.</p>
        <CodeBlock title="Terminal">
{`cd telegram-worker
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env             # Fill in all values
uvicorn main:app --host 0.0.0.0 --port 7861`}
        </CodeBlock>
      </Step>

      {/* Database Migrations */}
      <Heading2 id="migrations">Database Migrations</Heading2>
      <p className="text-white/50 leading-relaxed mb-4">
        Use Drizzle Kit to manage database schema changes.
      </p>
      <CodeBlock title="Migration Commands">
{`cd telephonia-react
npx drizzle-kit generate         # Generate migration from schema changes
npx drizzle-kit push             # Push schema directly (dev mode)
npx drizzle-kit studio           # Visual database browser`}
      </CodeBlock>

      {/* Plan Limits */}
      <Heading2 id="plan-limits">Plan Limits</Heading2>
      <p className="text-white/50 leading-relaxed mb-4">
        Usage is tracked per-organization per calendar month. Campaign execution
        automatically pauses when limits are reached.
      </p>
      <div className="rounded-xl border border-white/[0.08] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Feature</th>
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Free</th>
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Starter</th>
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Growth</th>
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Enterprise</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Voice minutes/mo", "0", "500", "2,000", "Unlimited"],
              ["Telegram messages/mo", "0", "100", "500", "Unlimited"],
              ["Emails/mo", "0", "500", "2,000", "Unlimited"],
              ["Price (USD)", "Free", "$40/mo", "$99/mo", "$299/mo"],
              ["Price (UAH)", "Free", "1,650", "4,100", "12,300"],
            ].map(([feature, free, starter, growth, enterprise], i) => (
              <tr key={feature} className={`border-b border-white/[0.04] ${i % 2 === 1 ? "bg-white/[0.015]" : ""}`}>
                <td className="px-5 py-3 text-white/70 font-medium">{feature}</td>
                <td className="px-5 py-3 text-white/40">{free}</td>
                <td className="px-5 py-3 text-white/40">{starter}</td>
                <td className="px-5 py-3 text-white/40">{growth}</td>
                <td className="px-5 py-3 text-white/40">{enterprise}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Next Steps */}
      <Heading2 id="next-steps">Next Steps</Heading2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[
          { title: "Architecture", href: "/docs/architecture", desc: "Understand the system design" },
          { title: "API Reference", href: "/docs/api", desc: "Explore all 37 endpoints" },
          { title: "Voice Calls", href: "/docs/channels/voice", desc: "Configure AI voice agents" },
          { title: "Deployment", href: "/docs/deployment", desc: "Deploy to production" },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="group p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300"
          >
            <p className="font-display font-semibold text-white text-sm group-hover:text-[#ff4d4d] transition-colors duration-200">{item.title}</p>
            <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
