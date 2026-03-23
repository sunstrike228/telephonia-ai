"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Phone } from "lucide-react";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";

export default function NumbersPage() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  return (
    <div>
      <PageHeader
        title={t ? "Телефонні номери" : "Phone Numbers"}
        description={t ? "Керуйте номерами телефону та призначайте їх кампаніям." : "Manage your phone numbers and assign them to campaigns."}
      />
      <EmptyState
        icon={Phone}
        title={t ? "Номери не налаштовані" : "No numbers configured"}
        description={t ? "Додайте номер телефону, щоб почати здійснювати та приймати дзвінки." : "Add a phone number to start making and receiving calls."}
        actionLabel={t ? "Додати номер" : "Add Number"}
        onAction={() => {}}
      />
    </div>
  );
}
