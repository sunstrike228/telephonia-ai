"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Users } from "lucide-react";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";

export default function LeadsPage() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  return (
    <div>
      <PageHeader
        title={t ? "Ліди" : "Leads"}
        description={t ? "Керуйте списками контактів та відстежуйте статус лідів." : "Manage your contact lists and track lead status."}
      />
      <EmptyState
        icon={Users}
        title={t ? "Лідів ще немає" : "No leads imported"}
        description={t ? "Завантажте CSV-файл з контактами, щоб почати." : "Upload a CSV file with your contacts to get started."}
        actionLabel={t ? "Імпорт CSV" : "Import CSV"}
        onAction={() => {}}
      />
    </div>
  );
}
