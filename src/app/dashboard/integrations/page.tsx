"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { GlassButton } from "@/components/ui/glass-button";

const integrations = [
  {
    name: "HubSpot",
    description: "Sync contacts and deals with HubSpot CRM.",
    color: "#ff7a59",
  },
  {
    name: "Salesforce",
    description: "Connect your Salesforce org for lead management.",
    color: "#00a1e0",
  },
  {
    name: "Pipedrive",
    description: "Sync your Pipedrive pipeline and contacts.",
    color: "#34d399",
  },
  {
    name: "Close",
    description: "Integrate with Close CRM for calling workflows.",
    color: "#a78bfa",
  },
];

export default function IntegrationsPage() {
  return (
    <div>
      <PageHeader
        title="Integrations"
        description="Connect your CRM and other tools."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((integration) => (
          <div
            key={integration.name}
            className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border"
                style={{
                  backgroundColor: `${integration.color}10`,
                  borderColor: `${integration.color}33`,
                }}
              >
                <span
                  className="text-sm font-bold"
                  style={{ color: integration.color }}
                >
                  {integration.name[0]}
                </span>
              </div>
              <div>
                <h3 className="text-base font-semibold text-white font-display">
                  {integration.name}
                </h3>
                <p className="text-sm text-white/40">{integration.description}</p>
              </div>
            </div>
            <GlassButton size="sm" onClick={() => {}}>
              Connect
            </GlassButton>
          </div>
        ))}
      </div>
    </div>
  );
}
