"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Phone } from "lucide-react";

export default function NumbersPage() {
  return (
    <div>
      <PageHeader
        title="Phone Numbers"
        description="Manage your phone numbers and assign them to campaigns."
      />
      <EmptyState
        icon={Phone}
        title="No numbers configured"
        description="Add a phone number to start making and receiving calls."
        actionLabel="Add Number"
        onAction={() => {}}
      />
    </div>
  );
}
