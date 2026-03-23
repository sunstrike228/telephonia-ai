"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PhoneCall } from "lucide-react";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";

export default function CallsPage() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  return (
    <div>
      <PageHeader
        title={t ? "Історія дзвінків" : "Call History"}
        description={t ? "Переглядайте всі дзвінки, транскрипції та оцінки." : "View all calls, transcriptions, and scores."}
      />
      <EmptyState
        icon={PhoneCall}
        title={t ? "Дзвінків ще немає" : "No calls yet"}
        description={t ? "Історія дзвінків з'явиться тут, коли ви почнете дзвонити." : "Your call history will appear here once you start making calls."}
      />
    </div>
  );
}
