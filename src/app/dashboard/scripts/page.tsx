"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { FileText } from "lucide-react";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";

export default function ScriptsPage() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  return (
    <div>
      <PageHeader
        title={t ? "Скрипти" : "Scripts"}
        description={t ? "Керуйте скриптами продажів та обробниками заперечень." : "Manage your sales scripts and objection handlers."}
      />
      <EmptyState
        icon={FileText}
        title={t ? "Скриптів ще немає" : "No scripts yet"}
        description={t ? "Створіть свій перший скрипт продажів, щоб почати." : "Create your first sales script to get started."}
        actionLabel={t ? "Створити скрипт" : "Create Script"}
        onAction={() => {}}
      />
    </div>
  );
}
