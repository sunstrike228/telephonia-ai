"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Users, Key, Globe, ChevronDown, Check } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const interfaceLanguages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "ua", name: "Українська", flag: "🇺🇦" },
];

export default function SettingsPage() {
  const { user } = useUser();
  const [interfaceLang, setInterfaceLang] = useState("en");
  const [langOpen, setLangOpen] = useState(false);

  // Auto-detect Ukrainian IP on mount
  useEffect(() => {
    const stored = localStorage.getItem("dashboard-lang");
    if (stored) {
      setInterfaceLang(stored);
      return;
    }
    // Try to detect country by timezone or fetch geo
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz.includes("Kiev") || tz.includes("Kyiv") || tz.includes("Zaporozhye") || tz.includes("Uzhgorod") || tz.includes("Simferopol")) {
      setInterfaceLang("ua");
      localStorage.setItem("dashboard-lang", "ua");
      return;
    }
    // Fallback: try IP-based detection
    fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(3000) })
      .then((r) => r.json())
      .then((data) => {
        if (data.country_code === "UA") {
          setInterfaceLang("ua");
          localStorage.setItem("dashboard-lang", "ua");
        }
      })
      .catch(() => {});
  }, []);

  const handleLangChange = (code: string) => {
    setInterfaceLang(code);
    localStorage.setItem("dashboard-lang", code);
    setLangOpen(false);
    const langName = interfaceLanguages.find((l) => l.code === code)?.name || code;
    toast.success(code === "ua" ? `Мову змінено на ${langName}` : `Language changed to ${langName}`);
  };

  const selectedLang = interfaceLanguages.find((l) => l.code === interfaceLang);
  const ua = interfaceLang === "ua";

  return (
    <div>
      <PageHeader
        title={ua ? "Налаштування" : "Settings"}
        description={ua ? "Керуйте обліковим записом та налаштуваннями." : "Manage your account and preferences."}
      />

      {/* Profile Section */}
      <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 mb-4">
        <h3 className="text-base font-semibold text-white font-display mb-4">
          {ua ? "Профіль" : "Profile"}
        </h3>
        <div className="flex items-center gap-4">
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt={user.fullName || "Avatar"}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full border border-white/10 object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#0090f0]/10 border border-[#0090f0]/20 flex items-center justify-center">
              <span className="text-sm font-bold text-[#0090f0]">
                {user?.fullName?.[0]?.toUpperCase() || user?.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() || "U"}
              </span>
            </div>
          )}
          <div>
            {user?.fullName && (
              <p className="text-sm font-medium text-white">{user.fullName}</p>
            )}
            <p className="text-sm text-white/70">
              {user?.primaryEmailAddress?.emailAddress || ""}
            </p>
            <p className="text-xs text-white/30">{ua ? "Власник акаунту" : "Account owner"}</p>
          </div>
        </div>
      </div>

      {/* Interface Language */}
      <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 mb-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0090f0]/10 border border-[#0090f0]/20 flex-shrink-0">
            <Globe size={18} className="text-[#0090f0]" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white font-display mb-1">
              {ua ? "Мова інтерфейсу" : "Interface Language"}
            </h3>
            <p className="text-sm text-white/40 mb-4">
              {ua ? "Оберіть мову панелі керування" : "Choose the language for your dashboard"}
            </p>

            <div className="relative max-w-xs">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="w-full flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70 hover:border-[#0090f0]/30 transition-all"
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-lg">{selectedLang?.flag}</span>
                  <span>{selectedLang?.name}</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`text-white/30 transition-transform ${langOpen ? "rotate-180" : ""}`}
                />
              </button>

              {langOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-white/10 bg-[rgba(12,12,18,0.98)] backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
                  {interfaceLanguages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => handleLangChange(l.code)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                        interfaceLang === l.code
                          ? "bg-[#0090f0]/10 text-[#36adff]"
                          : "text-white/60 hover:bg-white/5"
                      }`}
                    >
                      <span className="text-lg">{l.flag}</span>
                      <span className="flex-1 text-left">{l.name}</span>
                      {interfaceLang === l.code && (
                        <Check size={14} className="text-[#0090f0]" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
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
          <h4 className="text-base font-semibold text-white mb-1 font-display">
            {ua ? "Команда" : "Team Members"}
          </h4>
          <p className="text-sm text-white/40">
            {ua ? "Запрошуйте та керуйте учасниками команди." : "Invite and manage team members."}
          </p>
        </Link>
        <Link
          href="/dashboard/settings/api-keys"
          className="group rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 hover:border-[#a78bfa]/30 transition-all duration-300"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#a78bfa]/10 border border-[#a78bfa]/20 mb-4">
            <Key size={18} className="text-[#a78bfa]" />
          </div>
          <h4 className="text-base font-semibold text-white mb-1 font-display">API Keys</h4>
          <p className="text-sm text-white/40">
            {ua ? "Керуйте API ключами для програмного доступу." : "Manage API keys for programmatic access."}
          </p>
        </Link>
      </div>
    </div>
  );
}
