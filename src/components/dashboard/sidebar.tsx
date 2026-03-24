"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";
import {
  Phone, MessageCircle, Mail, Megaphone, Users, BarChart3,
  Mic, Link as LinkIcon, CreditCard, Settings,
  ChevronLeft, ChevronRight
} from "lucide-react";

const navGroups = (lang: "en" | "ua") => [
  {
    label: lang === "ua" ? "Канали" : "Channels",
    items: [
      { name: lang === "ua" ? "Дзвінки" : "Calls", href: "/dashboard/calls", icon: Phone },
      { name: lang === "ua" ? "Телеграм" : "Telegram", href: "/dashboard/telegram", icon: MessageCircle },
      { name: "Email", href: "/dashboard/email", icon: Mail },
    ],
  },
  {
    label: lang === "ua" ? "Кампанії" : "Campaigns",
    items: [
      { name: lang === "ua" ? "Кампанії" : "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
      { name: lang === "ua" ? "Ліди" : "Leads", href: "/dashboard/leads", icon: Users },
    ],
  },
  {
    label: lang === "ua" ? "Налаштування" : "Setup",
    items: [
      { name: lang === "ua" ? "Аналітика" : "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { name: lang === "ua" ? "Голос" : "Voice Settings", href: "/dashboard/voice", icon: Mic },
      { name: lang === "ua" ? "Номери" : "Numbers", href: "/dashboard/numbers", icon: Phone },
      { name: lang === "ua" ? "Інтеграції" : "Integrations", href: "/dashboard/integrations", icon: LinkIcon },
      { name: lang === "ua" ? "Оплата" : "Billing", href: "/dashboard/billing", icon: CreditCard },
      { name: lang === "ua" ? "Налаштування" : "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const lang = useDashboardLang();
  const groups = navGroups(lang);

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full z-40 flex flex-col bg-[#0e0e15] border-r border-white/5 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-white/5">
        <Link href="/dashboard" className="font-display font-bold tracking-[-0.04em]">
          {collapsed ? (
            <span className="text-2xl font-bold bg-gradient-to-r from-[#0090f0] via-[#6366f1] to-[#a855f7] bg-clip-text text-transparent">N</span>
          ) : (
            <span className="text-2xl inline-flex items-baseline gap-1.5">
              <span className="bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">Project</span><span className="bg-gradient-to-r from-[#0090f0] via-[#6366f1] to-[#a855f7] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(99,102,241,0.3)]"> Noir</span>
            </span>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {groups.map((group) => (
          <div key={group.label} className="mb-6">
            {!collapsed && (
              <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-white/25">
                {group.label}
              </div>
            )}
            {group.items.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-0.5",
                    isActive
                      ? "bg-[#0090f0]/10 text-white"
                      : "text-white/45 hover:text-white/80 hover:bg-white/[0.03]",
                    collapsed && "justify-center px-0"
                  )}
                >
                  <div className="relative">
                    {isActive && (
                      <div className="absolute -left-[18px] top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#0090f0] rounded-r-full" />
                    )}
                    <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                  </div>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="h-12 flex items-center justify-center border-t border-white/5 text-white/30 hover:text-white/60 transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </aside>
  );
}
