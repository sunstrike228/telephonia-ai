"use client";

import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const breadcrumbNames: Record<string, { en: string; ua: string }> = {
  dashboard: { en: "Dashboard", ua: "Панель" },
  scripts: { en: "Scripts", ua: "Скрипти" },
  voice: { en: "Voice", ua: "Голос" },
  numbers: { en: "Numbers", ua: "Номери" },
  calls: { en: "Calls", ua: "Дзвінки" },
  campaigns: { en: "Campaigns", ua: "Кампанії" },
  leads: { en: "Leads", ua: "Ліди" },
  analytics: { en: "Analytics", ua: "Аналітика" },
  integrations: { en: "Integrations", ua: "Інтеграції" },
  billing: { en: "Billing", ua: "Оплата" },
  settings: { en: "Settings", ua: "Налаштування" },
  team: { en: "Team", ua: "Команда" },
  "api-keys": { en: "API Keys", ua: "API ключі" },
};

export function Topbar() {
  const pathname = usePathname();
  const lang = useDashboardLang();

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const entry = breadcrumbNames[seg];
    const label = entry ? entry[lang] : seg;
    return { href, label, isLast: i === segments.length - 1 };
  });

  return (
    <header className="h-14 flex items-center justify-between px-8 border-b border-white/[0.04] bg-[#0a0a0f]/60 backdrop-blur-xl sticky top-0 z-30">
      <nav className="flex items-center gap-1.5 text-sm">
        {crumbs.map((c, i) => (
          <span key={c.href} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={12} className="text-white/15" />}
            {c.isLast ? (
              <span className="text-white/60 font-medium">{c.label}</span>
            ) : (
              <Link href={c.href} className="text-white/30 hover:text-white/50 transition-colors">
                {c.label}
              </Link>
            )}
          </span>
        ))}
      </nav>
      <div className="flex items-center gap-3">
        <UserButton />
      </div>
    </header>
  );
}
