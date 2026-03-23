"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { BarChart3 } from "lucide-react";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";

export default function AnalyticsPage() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  return (
    <div>
      <PageHeader
        title={t ? "Аналітика" : "Analytics"}
        description={t ? "Відстежуйте конверсію, ефективність дзвінків та тренди." : "Track conversion rates, call performance, and trends."}
      />
      <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-12">
        <div className="flex flex-col items-center justify-center text-center py-12">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/8 mb-6">
            <BarChart3 size={28} className="text-white/20" />
          </div>
          <p className="text-sm text-white/40 max-w-md">
            {t ? "Аналітика з'явиться, коли у вас будуть дані про дзвінки." : "Analytics will appear once you have call data."}
          </p>
        </div>
      </div>
    </div>
  );
}
