import Link from "next/link";
import {
  Rocket,
  FileText,
  Mic,
  Users,
  Megaphone,
  Radio,
  BarChart3,
  CreditCard,
  Settings,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const sections = [
  {
    title: "Getting Started",
    description: "Sign up, complete onboarding, and take your first look at the dashboard.",
    href: "/docs/guide/getting-started",
    icon: Rocket,
    color: "#0090f0",
    tag: "Start here",
  },
  {
    title: "Scripts",
    description: "Create and manage your sales scripts and objection handlers.",
    href: "/docs/guide/scripts",
    icon: FileText,
    color: "#0090f0",
  },
  {
    title: "Voice Settings",
    description: "Choose voices, set languages, and configure your AI agent's personality.",
    href: "/docs/guide/voice",
    icon: Mic,
    color: "#a78bfa",
  },
  {
    title: "Leads",
    description: "Add leads manually, import from CSV, and manage your contact lists.",
    href: "/docs/guide/leads",
    icon: Users,
    color: "#34d399",
  },
  {
    title: "Campaigns",
    description: "Create campaigns, assign leads, choose channels, and start outreach.",
    href: "/docs/guide/campaigns",
    icon: Megaphone,
    color: "#f59e0b",
  },
  {
    title: "Channels",
    description: "Understand how Voice, Telegram, and Email channels work together.",
    href: "/docs/guide/channels",
    icon: Radio,
    color: "#a78bfa",
  },
  {
    title: "Analytics",
    description: "Read your dashboard stats, charts, and track campaign performance.",
    href: "/docs/guide/analytics",
    icon: BarChart3,
    color: "#0090f0",
  },
  {
    title: "Billing",
    description: "Understand plans, usage limits, and how to upgrade your subscription.",
    href: "/docs/guide/billing",
    icon: CreditCard,
    color: "#34d399",
  },
  {
    title: "Settings",
    description: "Manage your profile, language preferences, API keys, and team.",
    href: "/docs/guide/settings",
    icon: Settings,
    color: "#64748b",
  },
];

export default function GuidePage() {
  return (
    <div>
      {/* Hero */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#ff4d4d] to-[#ff2222] flex items-center justify-center shadow-lg shadow-red-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white font-display tracking-tight">
              Dashboard Guide
            </h1>
            <p className="text-white/40 text-sm">
              Everything you need to know to get the most out of Project Noir
            </p>
          </div>
        </div>
        <p className="text-white/50 text-base leading-relaxed max-w-2xl mt-4">
          Welcome! This guide walks you through every part of the Project Noir dashboard
          in plain, simple language. No technical knowledge required. Whether you are setting
          up your first campaign or checking your analytics, you will find step-by-step
          instructions right here.
        </p>
      </div>

      {/* Start here callout */}
      <Link
        href="/docs/guide/getting-started"
        className="block mb-10 rounded-2xl border border-[#0090f0]/20 bg-[#0090f0]/5 p-6 hover:border-[#0090f0]/40 transition-colors group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#0090f0]/10 border border-[#0090f0]/20 flex items-center justify-center">
              <Rocket className="w-5 h-5 text-[#0090f0]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0090f0]">
                  Start here
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white font-display">
                New to Project Noir? Begin with Getting Started
              </h3>
              <p className="text-sm text-white/40 mt-1">
                Learn how to sign up, complete the onboarding wizard, and navigate your dashboard.
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-[#0090f0] opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      {/* Section cards */}
      <h2 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-6">
        All guide sections
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:border-white/[0.12] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${section.color}12`,
                    border: `1px solid ${section.color}25`,
                  }}
                >
                  <Icon className="w-[18px] h-[18px]" style={{ color: section.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-white font-display">
                      {section.title}
                    </h3>
                    {section.tag && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0090f0]/10 text-[#0090f0] border border-[#0090f0]/20">
                        {section.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/40 mt-1">{section.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white/30 transition-colors flex-shrink-0 mt-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
