"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/scripts": "Scripts",
  "/dashboard/voice": "Voice Settings",
  "/dashboard/numbers": "Phone Numbers",
  "/dashboard/calls": "Call History",
  "/dashboard/leads": "Leads",
  "/dashboard/analytics": "Analytics",
  "/dashboard/integrations": "Integrations",
  "/dashboard/billing": "Billing",
  "/dashboard/settings": "Settings",
  "/dashboard/settings/team": "Team Members",
  "/dashboard/settings/api-keys": "API Keys",
};

export function Topbar() {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-30">
      <h1 className="text-lg font-semibold text-white font-display tracking-tight">{title}</h1>
      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </header>
  );
}
