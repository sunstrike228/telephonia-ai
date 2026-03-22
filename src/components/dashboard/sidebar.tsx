"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, FileText, Mic, Phone, PhoneCall,
  Users, BarChart3, Plug, CreditCard, Settings,
  ChevronLeft, ChevronRight
} from "lucide-react";

const navGroups = [
  {
    label: "Main",
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { name: "Scripts", href: "/dashboard/scripts", icon: FileText },
      { name: "Voice", href: "/dashboard/voice", icon: Mic },
      { name: "Numbers", href: "/dashboard/numbers", icon: Phone },
    ],
  },
  {
    label: "Activity",
    items: [
      { name: "Calls", href: "/dashboard/calls", icon: PhoneCall },
      { name: "Leads", href: "/dashboard/leads", icon: Users },
      { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Account",
    items: [
      { name: "Integrations", href: "/dashboard/integrations", icon: Plug },
      { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
      { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full z-40 flex flex-col bg-[#0e0e15] border-r border-white/5 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-white/5">
        <Link href="/dashboard" className="font-display font-bold text-base tracking-[-0.04em] flex items-center gap-2">
          {collapsed ? (
            <span className="text-[#0090f0] text-xl font-bold">T</span>
          ) : (
            <>
              <span className="bg-gradient-to-r from-white via-white to-[#0090f0] bg-clip-text text-transparent">
                telephonia
              </span>
              <span className="text-[#0090f0]">.ai</span>
            </>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navGroups.map((group) => (
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
