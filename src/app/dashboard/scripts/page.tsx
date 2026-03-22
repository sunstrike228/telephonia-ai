"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { FileText } from "lucide-react";

export default function ScriptsPage() {
  return (
    <div>
      <PageHeader
        title="Scripts"
        description="Manage your sales scripts and objection handlers."
      />
      <EmptyState
        icon={FileText}
        title="No scripts yet"
        description="Create your first sales script to get started."
        actionLabel="Create Script"
        onAction={() => {}}
      />
    </div>
  );
}
