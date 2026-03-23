"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Users } from "lucide-react";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";

export default function TeamPage() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  return (
    <div>
      <PageHeader title={t ? "Команда" : "Team Members"} />
      <EmptyState
        icon={Users}
        title={t ? "Немає учасників команди" : "No team members"}
        description={t ? "Запросіть учасників команди для спільної роботи." : "Invite team members to collaborate."}
        actionLabel={t ? "Запросити учасника" : "Invite Member"}
        onAction={() => {}}
      />
    </div>
  );
}
