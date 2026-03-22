"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Users } from "lucide-react";

export default function TeamPage() {
  return (
    <div>
      <PageHeader title="Team Members" />
      <EmptyState
        icon={Users}
        title="No team members"
        description="Invite team members to collaborate."
        actionLabel="Invite Member"
        onAction={() => {}}
      />
    </div>
  );
}
