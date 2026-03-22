"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Users } from "lucide-react";

export default function LeadsPage() {
  return (
    <div>
      <PageHeader
        title="Leads"
        description="Manage your contact lists and track lead status."
      />
      <EmptyState
        icon={Users}
        title="No leads imported"
        description="Upload a CSV file with your contacts to get started."
        actionLabel="Import CSV"
        onAction={() => {}}
      />
    </div>
  );
}
