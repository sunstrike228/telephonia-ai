import Link from "next/link";
import {
  BookOpen,
  Layers,
  Code,
  Cloud,
  Phone,
  MessageCircle,
  Mail,
  Zap,
  ArrowRight,
  Database,
  Shield,
  BarChart3,
} from "lucide-react";

const quickLinks = [
  {
    title: "Quick Start",
    description: "Get up and running with Project Noir in minutes.",
    href: "/docs/quick-start",
    icon: <Zap className="w-5 h-5" />,
    color: "from-[#ff4d4d]/20 to-[#ff4d4d]/5",
    border: "border-[#ff4d4d]/20",
  },
  {
    title: "Architecture",
    description: "Understand the system design, services, and data flows.",
    href: "/docs/architecture",
    icon: <Layers className="w-5 h-5" />,
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/20",
  },
  {
    title: "API Reference",
    description: "Complete reference for all 37 API endpoints.",
    href: "/docs/api",
    icon: <Code className="w-5 h-5" />,
    color: "from-emerald-500/20 to-emerald-500/5",
    border: "border-emerald-500/20",
  },
  {
    title: "Deployment",
    description: "Deploy to Vercel and Railway with environment configuration.",
    href: "/docs/deployment",
    icon: <Cloud className="w-5 h-5" />,
    color: "from-purple-500/20 to-purple-500/5",
    border: "border-purple-500/20",
  },
];

const channels = [
  {
    title: "Voice Calls",
    description: "AI voice agents powered by Pipecat, Deepgram, and ElevenLabs.",
    href: "/docs/channels/voice",
    icon: <Phone className="w-5 h-5 text-[#ff4d4d]" />,
  },
  {
    title: "Telegram",
    description: "Automated Telegram outreach with account pooling.",
    href: "/docs/channels/telegram",
    icon: <MessageCircle className="w-5 h-5 text-blue-400" />,
  },
  {
    title: "Email",
    description: "AI-generated emails sent through Resend.",
    href: "/docs/channels/email",
    icon: <Mail className="w-5 h-5 text-emerald-400" />,
  },
];

export default function DocsOverview() {
  return (
    <div>
      {/* Hero */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ff4d4d]/10 border border-[#ff4d4d]/20 text-[#ff4d4d] text-xs font-medium mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          Documentation
        </div>
        <h1 className="font-display text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
          Project Noir Documentation
        </h1>
        <p className="text-lg text-white/50 leading-relaxed max-w-2xl">
          Everything you need to build, deploy, and scale AI-powered multi-channel
          outreach. Project Noir replaces your outreach team with AI agents that
          call, message on Telegram, and email your leads.
        </p>
      </div>

      {/* Quick links grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`group relative rounded-xl border ${link.border} bg-gradient-to-br ${link.color} p-5 hover:border-white/20 transition-all duration-300`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-white/[0.06]">
                {link.icon}
              </div>
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all duration-200" />
            </div>
            <h3 className="font-display font-semibold text-white text-lg mb-1">
              {link.title}
            </h3>
            <p className="text-sm text-white/45 leading-relaxed">
              {link.description}
            </p>
          </Link>
        ))}
      </div>

      {/* Architecture Overview */}
      <div className="mb-16">
        <h2 className="font-display text-2xl font-bold text-white mb-6">
          System Architecture
        </h2>
        <div className="rounded-xl border border-white/[0.08] bg-[rgba(14,14,22,0.95)] p-6 overflow-x-auto">
          <pre className="text-xs text-white/60 font-mono leading-relaxed">
{`                     +---------------------+
                     |   Landing Page      |
                     |   (Vercel)          |
                     +---------+-----------+
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
                          +-------------+`}
          </pre>
        </div>
      </div>

      {/* Channels */}
      <div className="mb-16">
        <h2 className="font-display text-2xl font-bold text-white mb-6">
          Channels
        </h2>
        <div className="space-y-3">
          {channels.map((channel) => (
            <Link
              key={channel.href}
              href={channel.href}
              className="group flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300"
            >
              <div className="p-2.5 rounded-lg bg-white/[0.04]">
                {channel.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-white text-sm">
                  {channel.title}
                </h3>
                <p className="text-xs text-white/40 mt-0.5">
                  {channel.description}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-white/15 group-hover:text-white/40 shrink-0 transition-colors duration-200" />
            </Link>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mb-16">
        <h2 className="font-display text-2xl font-bold text-white mb-6">
          Tech Stack
        </h2>
        <div className="rounded-xl border border-white/[0.08] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Layer</th>
                <th className="text-left px-5 py-3 text-white/60 font-display font-medium">Technology</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Landing + Dashboard", "Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion"],
                ["Authentication", "Clerk"],
                ["Database", "Neon PostgreSQL (serverless) + Drizzle ORM"],
                ["Voice Agent", "Python 3.11, Pipecat, Deepgram Nova-3 STT, GPT-4o, ElevenLabs TTS"],
                ["Telegram Worker", "Python 3.11, Telethon, FastAPI, Uvicorn"],
                ["Email", "Resend"],
                ["Payments", "Stripe (international) + LiqPay (Ukraine)"],
                ["Telephony", "Twilio"],
                ["Hosting", "Vercel (web app) + Railway (Python services)"],
              ].map(([layer, tech], i) => (
                <tr key={layer} className={`border-b border-white/[0.04] ${i % 2 === 1 ? "bg-white/[0.015]" : ""}`}>
                  <td className="px-5 py-3 text-white/80 font-medium whitespace-nowrap">{layer}</td>
                  <td className="px-5 py-3 text-white/50">{tech}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
