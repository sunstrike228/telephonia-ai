"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Key } from "lucide-react";

export default function ApiKeysPage() {
  return (
    <div>
      <PageHeader
        title="API Keys"
        description="Manage API keys for programmatic access."
      />
      <EmptyState
        icon={Key}
        title="No API keys"
        description="Create an API key to integrate with your systems."
        actionLabel="Create Key"
        onAction={() => {}}
      />
    </div>
  );
}
