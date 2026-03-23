"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";

const pageTitles: Record<string, { en: string; ua: string }> = {
  "/dashboard": { en: "Overview", ua: "Огляд" },
  "/dashboard/scripts": { en: "Scripts", ua: "Скрипти" },
  "/dashboard/voice": { en: "Voice Settings", ua: "Налаштування голосу" },
  "/dashboard/numbers": { en: "Phone Numbers", ua: "Телефонні номери" },
  "/dashboard/calls": { en: "Call History", ua: "Історія дзвінків" },
  "/dashboard/leads": { en: "Leads", ua: "Ліди" },
  "/dashboard/analytics": { en: "Analytics", ua: "Аналітика" },
  "/dashboard/integrations": { en: "Integrations", ua: "Інтеграції" },
  "/dashboard/billing": { en: "Billing", ua: "Оплата" },
  "/dashboard/settings": { en: "Settings", ua: "Налаштування" },
  "/dashboard/settings/team": { en: "Team Members", ua: "Команда" },
  "/dashboard/settings/api-keys": { en: "API Keys", ua: "API ключі" },
};

export function Topbar() {
  const pathname = usePathname();
  const lang = useDashboardLang();
  const entry = pageTitles[pathname];
  const title = entry ? entry[lang] : (lang === "ua" ? "Панель керування" : "Dashboard");

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-30">
      <h1 className="text-lg font-semibold text-white font-display tracking-tight">{title}</h1>
      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </header>
  );
}
