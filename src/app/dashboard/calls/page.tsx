"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PhoneCall } from "lucide-react";

export default function CallsPage() {
  return (
    <div>
      <PageHeader
        title="Call History"
        description="View all calls, transcriptions, and scores."
      />
      <EmptyState
        icon={PhoneCall}
        title="No calls yet"
        description="Your call history will appear here once you start making calls."
      />
    </div>
  );
}
