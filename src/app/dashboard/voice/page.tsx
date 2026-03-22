"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Mic, Globe, Brain } from "lucide-react";

export default function VoicePage() {
  const [language, setLanguage] = useState<"uk" | "en">("uk");
  const [personality, setPersonality] = useState("professional");

  return (
    <div>
      <PageHeader
        title="Voice Settings"
        description="Configure voice, language, and personality for your AI agent."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Voice Selection */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#a78bfa]/10 border border-[#a78bfa]/20 mb-4">
            <Mic size={18} className="text-[#a78bfa]" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1 font-display">Voice Selection</h3>
          <p className="text-sm text-white/40 mb-4">Current voice</p>
          <div className="rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3">
            <span className="text-sm text-white/70">Alloy (Default)</span>
          </div>
        </div>

        {/* Language */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0090f0]/10 border border-[#0090f0]/20 mb-4">
            <Globe size={18} className="text-[#0090f0]" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1 font-display">Language</h3>
          <p className="text-sm text-white/40 mb-4">Agent language</p>
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage("uk")}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm transition-all ${
                language === "uk"
                  ? "border-[#0090f0]/40 bg-[#0090f0]/10 text-white"
                  : "border-white/8 bg-white/[0.03] text-white/40 hover:text-white/60"
              }`}
            >
              Ukrainian
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`flex-1 rounded-xl border px-4 py-3 text-sm transition-all ${
                language === "en"
                  ? "border-[#0090f0]/40 bg-[#0090f0]/10 text-white"
                  : "border-white/8 bg-white/[0.03] text-white/40 hover:text-white/60"
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Personality */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#34d399]/10 border border-[#34d399]/20 mb-4">
            <Brain size={18} className="text-[#34d399]" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1 font-display">Personality</h3>
          <p className="text-sm text-white/40 mb-4">Agent tone</p>
          <select
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70 outline-none focus:border-[#34d399]/40 transition-all appearance-none cursor-pointer"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="assertive">Assertive</option>
          </select>
        </div>
      </div>
    </div>
  );
}
