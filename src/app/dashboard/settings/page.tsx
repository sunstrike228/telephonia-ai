"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { Users, Key } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your account and preferences."
      />

      {/* Profile Section */}
      <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 mb-4">
        <h3 className="text-base font-semibold text-white font-display mb-4">Profile</h3>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#0090f0]/10 border border-[#0090f0]/20 flex items-center justify-center">
            <span className="text-sm font-bold text-[#0090f0]">U</span>
          </div>
          <div>
            <p className="text-sm text-white/70">user@example.com</p>
            <p className="text-xs text-white/30">Account owner</p>
          </div>
        </div>
      </div>

      {/* Settings Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/settings/team"
          className="group rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 hover:border-[#34d399]/30 transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#34d399]/10 border border-[#34d399]/20 mb-4">
            <Users size={18} className="text-[#34d399]" />
          </div>
          <h4 className="text-base font-semibold text-white mb-1 font-display">Team Members</h4>
          <p className="text-sm text-white/40">Invite and manage team members.</p>
        </Link>
        <Link
          href="/dashboard/settings/api-keys"
          className="group rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 hover:border-[#a78bfa]/30 transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#a78bfa]/10 border border-[#a78bfa]/20 mb-4">
            <Key size={18} className="text-[#a78bfa]" />
          </div>
          <h4 className="text-base font-semibold text-white mb-1 font-display">API Keys</h4>
          <p className="text-sm text-white/40">Manage API keys for programmatic access.</p>
        </Link>
      </div>
    </div>
  );
}
