import { Cloud, Server, Settings, CheckCircle2, AlertTriangle } from "lucide-react";

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

function Heading3({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="font-display text-lg font-semibold text-white mt-10 mb-3 scroll-mt-20">
      <a href={`#${id}`} className="hover:text-[#ff4d4d] transition-colors duration-200">
        {children}
      </a>
    </h3>
  );
}

export default function DeploymentPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-4">
          <Cloud className="w-3.5 h-3.5" />
          Deployment
        </div>
        <h1 className="font-display text-4xl font-bold text-white tracking-tight mb-4">
          Deployment Guide
        </h1>
        <p className="text-lg text-white/50 leading-relaxed">
          Deploy the complete Project Noir platform: the Next.js dashboard on Vercel,
          and the Python services on Railway.
        </p>
      </div>

      {/* Overview */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 mb-10">
        <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Service Overview</p>
        <div className="space-y-2">
          {[
            { name: "Dashboard (Next.js)", host: "Vercel", port: "Auto", desc: "Landing page, dashboard, all API routes" },
            { name: "Voice Agent (Python)", host: "Railway", port: "7860", desc: "Pipecat voice pipeline, Twilio integration" },
            { name: "Telegram Worker (Python)", host: "Railway", port: "7861", desc: "Telethon client pool, message sending" },
          ].map((svc) => (
            <div key={svc.name} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02]">
              <Server className="w-4 h-4 text-white/30 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80 font-medium">{svc.name}</p>
                <p className="text-xs text-white/35">{svc.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-[#ff4d4d]">{svc.host}</p>
                <p className="text-[10px] text-white/25">Port {svc.port}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vercel */}
      <Heading2 id="vercel">Dashboard on Vercel</Heading2>
      <p className="text-white/50 leading-relaxed mb-4">
        Vercel auto-detects Next.js -- zero configuration needed. Simply connect
        your repository and set environment variables.
      </p>

      <Heading3 id="vercel-steps">Steps</Heading3>
      <ol className="list-decimal list-inside space-y-3 text-white/50 mb-6">
        <li>Connect the <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-white/60">telephonia-react</code> repository to Vercel</li>
        <li>Set all environment variables in the Vercel dashboard (see below)</li>
        <li>Deploy -- Vercel handles the build automatically</li>
        <li>Configure webhook URLs after deployment:
          <ul className="list-disc list-inside ml-4 mt-1 space-y-1 text-sm">
            <li>Stripe: <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-white/50">https://yourdomain.com/api/webhook/stripe</code></li>
            <li>LiqPay: <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-white/50">https://yourdomain.com/api/webhook/liqpay</code></li>
          </ul>
        </li>
      </ol>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-sm text-white/45">
            Do <strong className="text-white/70">not</strong> set <code className="px-1 py-0.5 rounded bg-white/[0.06] text-xs font-mono">output: &quot;standalone&quot;</code> in
            next.config.js -- that&apos;s only needed for Docker deployments.
          </p>
        </div>
      </div>

      {/* Railway Voice Agent */}
      <Heading2 id="railway-voice">Voice Agent on Railway</Heading2>
      <ol className="list-decimal list-inside space-y-3 text-white/50 mb-6">
        <li>Create a Railway project from the <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-white/60">voice-agent</code> directory</li>
        <li>Railway auto-detects the Dockerfile</li>
        <li>Set all environment variables (see table below)</li>
        <li>Service exposes on port 7860</li>
        <li>Set <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-white/60">BASE_URL</code> to the Railway public URL</li>
        <li>Configure Twilio incoming call webhook: <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-white/50">{`{BASE_URL}/twilio/incoming`}</code></li>
      </ol>

      {/* Railway Telegram Worker */}
      <Heading2 id="railway-telegram">Telegram Worker on Railway</Heading2>
      <ol className="list-decimal list-inside space-y-3 text-white/50 mb-6">
        <li>Create a Railway project from the <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-white/60">telegram-worker</code> directory</li>
        <li>Railway auto-detects the Dockerfile</li>
        <li>Set all environment variables (see table below)</li>
        <li>Service exposes on port 7861</li>
      </ol>

      {/* Environment Variables */}
      <Heading2 id="env-vars">Environment Variables</Heading2>

      <Heading3 id="env-nextjs">Next.js Dashboard</Heading3>
      <div className="rounded-xl border border-white/[0.08] overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Variable</th>
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["DATABASE_URL", "Neon PostgreSQL connection string"],
              ["NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "Clerk publishable key"],
              ["CLERK_SECRET_KEY", "Clerk secret key"],
              ["STRIPE_SECRET_KEY", "Stripe API secret key"],
              ["STRIPE_PUBLISHABLE_KEY", "Stripe publishable key"],
              ["STRIPE_WEBHOOK_SECRET", "Stripe webhook signing secret"],
              ["LIQPAY_PUBLIC_KEY", "LiqPay public key (Ukraine payments)"],
              ["LIQPAY_PRIVATE_KEY", "LiqPay private key"],
              ["TWILIO_ACCOUNT_SID", "Twilio account SID"],
              ["TWILIO_AUTH_TOKEN", "Twilio auth token"],
              ["RESEND_API_KEY", "Resend email API key"],
              ["OPENROUTER_API_KEY", "OpenRouter API key (email generation)"],
              ["RAILWAY_VOICE_AGENT_URL", "Voice agent Railway URL"],
              ["SENTRY_DSN", "Sentry DSN for error tracking"],
            ].map(([name, desc], i) => (
              <tr key={name} className={`border-b border-white/[0.04] ${i % 2 === 1 ? "bg-white/[0.015]" : ""}`}>
                <td className="px-5 py-3 font-mono text-[#ff4d4d] text-xs whitespace-nowrap">{name}</td>
                <td className="px-5 py-3 text-white/45">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Heading3 id="env-voice">Voice Agent</Heading3>
      <div className="rounded-xl border border-white/[0.08] overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Variable</th>
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["DATABASE_URL", "Neon PostgreSQL connection string"],
              ["ORG_ID", "Default organization ID for call attribution"],
              ["DEEPGRAM_API_KEY", "Deepgram STT API key"],
              ["ELEVENLABS_API_KEY", "ElevenLabs TTS API key"],
              ["ELEVENLABS_VOICE_ID", "Default ElevenLabs voice ID"],
              ["OPENROUTER_API_KEY", "OpenRouter API key (GPT-4o)"],
              ["TWILIO_ACCOUNT_SID", "Twilio account SID"],
              ["TWILIO_AUTH_TOKEN", "Twilio auth token"],
              ["TWILIO_PHONE_NUMBER", "Twilio phone number for outbound calls"],
              ["BASE_URL", "Public URL of this service"],
              ["DAILY_API_KEY", "Daily.co API key for WebRTC transport"],
            ].map(([name, desc], i) => (
              <tr key={name} className={`border-b border-white/[0.04] ${i % 2 === 1 ? "bg-white/[0.015]" : ""}`}>
                <td className="px-5 py-3 font-mono text-[#ff4d4d] text-xs whitespace-nowrap">{name}</td>
                <td className="px-5 py-3 text-white/45">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Heading3 id="env-telegram">Telegram Worker</Heading3>
      <div className="rounded-xl border border-white/[0.08] overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.08]">
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Variable</th>
              <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Description</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["DATABASE_URL", "Neon PostgreSQL connection string"],
              ["MAX_DAILY_MESSAGES_PER_ACCOUNT", "Daily message cap per account (default: 30)"],
              ["MESSAGE_DELAY_MIN", "Min seconds between sends (default: 30)"],
              ["MESSAGE_DELAY_MAX", "Max seconds between sends (default: 90)"],
            ].map(([name, desc], i) => (
              <tr key={name} className={`border-b border-white/[0.04] ${i % 2 === 1 ? "bg-white/[0.015]" : ""}`}>
                <td className="px-5 py-3 font-mono text-[#ff4d4d] text-xs whitespace-nowrap">{name}</td>
                <td className="px-5 py-3 text-white/45">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Checklist */}
      <Heading2 id="checklist">Deployment Checklist</Heading2>
      <div className="space-y-2">
        {[
          "All environment variables set in Vercel dashboard",
          "Stripe webhook URL configured to /api/webhook/stripe",
          "LiqPay webhook URL configured to /api/webhook/liqpay",
          "Database schema pushed via drizzle-kit push",
          "Voice agent deployed on Railway (port 7860)",
          "RAILWAY_VOICE_AGENT_URL set in Vercel env",
          "Twilio incoming call webhook set to voice agent BASE_URL/twilio/incoming",
          "Telegram worker deployed on Railway (port 7861)",
          "Clerk sign-in/sign-up redirect URLs configured",
          "Sentry DSN configured for error monitoring",
        ].map((item) => (
          <div key={item} className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.06] bg-white/[0.02]">
            <div className="w-5 h-5 rounded border border-white/[0.15] shrink-0" />
            <p className="text-sm text-white/50">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
