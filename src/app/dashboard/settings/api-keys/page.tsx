"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Key } from "lucide-react";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";

export default function ApiKeysPage() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  return (
    <div>
      <PageHeader
        title={t ? "API ключі" : "API Keys"}
        description={t ? "Керуйте API-ключами для програмного доступу." : "Manage API keys for programmatic access."}
      />
      <EmptyState
        icon={Key}
        title={t ? "Немає API-ключів" : "No API keys"}
        description={t ? "Створіть API-ключ для інтеграції з вашими системами." : "Create an API key to integrate with your systems."}
        actionLabel={t ? "Створити ключ" : "Create Key"}
        onAction={() => {}}
      />
    </div>
  );
}
