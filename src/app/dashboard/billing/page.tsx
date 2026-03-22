"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { GlassButton } from "@/components/ui/glass-button";

export default function BillingPage() {
  return (
    <div>
      <PageHeader
        title="Billing"
        description="Manage your plan and usage."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Plan */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white font-display">Current Plan</h3>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#0090f0]/10 text-[#0090f0] border border-[#0090f0]/20">
              Active
            </span>
          </div>
          <div className="mb-4">
            <span className="text-3xl font-bold text-white font-display">$40</span>
            <span className="text-sm text-white/40">/mo</span>
          </div>
          <p className="text-sm text-white/40 mb-6">Starter plan with 500 minutes included.</p>
          <GlassButton size="sm" onClick={() => {}}>
            Upgrade Plan
          </GlassButton>
        </div>

        {/* Usage Stats */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6">
          <h3 className="text-base font-semibold text-white font-display mb-4">Usage This Month</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-white/40">Minutes Used</span>
                <span className="text-sm text-white/70">0 / 500</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/[0.05]">
                <div className="h-2 rounded-full bg-[#0090f0]" style={{ width: "0%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-white/40">Calls Made</span>
                <span className="text-sm text-white/70">0</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/[0.05]">
                <div className="h-2 rounded-full bg-[#34d399]" style={{ width: "0%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-white/40">Leads Contacted</span>
                <span className="text-sm text-white/70">0</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/[0.05]">
                <div className="h-2 rounded-full bg-[#a78bfa]" style={{ width: "0%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
