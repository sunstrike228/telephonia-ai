"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { PhoneCall, Users, FileText, Mic, Megaphone, Send, Mail } from "lucide-react";
import Link from "next/link";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";

interface QuickStats {
  voice: number;
  telegram: number;
  email: number;
  totalLeads: number;
}

export default function DashboardOverview() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  const [scriptCount, setScriptCount] = useState(0);
  const [campaignTotal, setCampaignTotal] = useState(0);
  const [campaignActive, setCampaignActive] = useState(0);
  const [quickStats, setQuickStats] = useState<QuickStats>({ voice: 0, telegram: 0, email: 0, totalLeads: 0 });

  useEffect(() => {
    fetch("/api/dashboard/scripts")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) setScriptCount(data.length);
      })
      .catch(() => {});

    fetch("/api/dashboard/campaigns")
      .then((res) => (res.ok ? res.json() : { campaigns: [] }))
      .then((data) => {
        const camps = data.campaigns || [];
        setCampaignTotal(camps.length);
        setCampaignActive(camps.filter((c: { status: string }) => c.status === "active").length);
      })
      .catch(() => {});

    fetch("/api/dashboard/analytics")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setQuickStats({
            voice: data.voice?.total || 0,
            telegram: data.telegram?.total || 0,
            email: data.email?.total || 0,
            totalLeads: data.leadStatuses?.total || 0,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader
        title={t ? "З поверненням" : "Welcome back"}
        description={t ? "Ось що відбувається з вашими AI-агентами сьогодні." : "Here's what's happening with your AI agents today."}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title={t ? "Всього дзвінків" : "Total Calls"}
          value={String(quickStats.voice)}
          icon={PhoneCall}
          iconColor="#0090f0"
        />
        <StatCard
          title={t ? "Активні ліди" : "Active Leads"}
          value={String(quickStats.totalLeads)}
          icon={Users}
          iconColor="#34d399"
        />
        <StatCard
          title={t ? "Скрипти" : "Scripts"}
          value={String(scriptCount)}
          icon={FileText}
          iconColor="#a78bfa"
        />
        <StatCard
          title={t ? "Кампанії" : "Campaigns"}
          value={`${campaignTotal}`}
          icon={Megaphone}
          iconColor="#f97316"
          change={
            campaignActive > 0
              ? t
                ? `${campaignActive} активних`
                : `${campaignActive} active`
              : undefined
          }
          changeType="positive"
        />
      </div>

      {/* Quick Stats: Channel Breakdown */}
      {(quickStats.voice > 0 || quickStats.telegram > 0 || quickStats.email > 0) && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
            {t ? "Канали" : "Channel Breakdown"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-5 flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#0090f012", border: "1px solid #0090f025" }}
              >
                <PhoneCall size={18} stroke="#0090f0" />
              </div>
              <div>
                <div className="text-xl font-bold text-white font-display">{quickStats.voice}</div>
                <div className="text-xs text-white/35">{t ? "Голосових дзвінків" : "Voice calls"}</div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-5 flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#a78bfa12", border: "1px solid #a78bfa25" }}
              >
                <Send size={18} stroke="#a78bfa" />
              </div>
              <div>
                <div className="text-xl font-bold text-white font-display">{quickStats.telegram}</div>
                <div className="text-xs text-white/35">{t ? "Telegram повідомлень" : "Telegram messages"}</div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-5 flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#34d39912", border: "1px solid #34d39925" }}
              >
                <Mail size={18} stroke="#34d399" />
              </div>
              <div>
                <div className="text-xl font-bold text-white font-display">{quickStats.email}</div>
                <div className="text-xs text-white/35">{t ? "Листів" : "Emails sent"}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
          {t ? "Швидкі дії" : "Quick Actions"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/scripts"
            className="group rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 hover:border-[#0090f0]/30 transition-colors duration-300"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0090f0]/10 border border-[#0090f0]/20 mb-4">
              <FileText size={18} className="text-[#0090f0]" />
            </div>
            <h4 className="text-base font-semibold text-white mb-1 font-display">
              {t ? "Створити скрипт" : "Create a Script"}
            </h4>
            <p className="text-sm text-white/40">
              {t ? "Завантажте скрипт продажів та налаштуйте обробку заперечень." : "Upload your sales script and set up objection handlers."}
            </p>
          </Link>
          <Link
            href="/dashboard/voice"
            className="group rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 hover:border-[#a78bfa]/30 transition-colors duration-300"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#a78bfa]/10 border border-[#a78bfa]/20 mb-4">
              <Mic size={18} className="text-[#a78bfa]" />
            </div>
            <h4 className="text-base font-semibold text-white mb-1 font-display">
              {t ? "Обрати голос" : "Choose a Voice"}
            </h4>
            <p className="text-sm text-white/40">
              {t ? "Виберіть голос, мову та характер для вашого агента." : "Select a voice, language, and personality for your agent."}
            </p>
          </Link>
          <Link
            href="/dashboard/leads"
            className="group rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 hover:border-[#34d399]/30 transition-colors duration-300"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#34d399]/10 border border-[#34d399]/20 mb-4">
              <Users size={18} className="text-[#34d399]" />
            </div>
            <h4 className="text-base font-semibold text-white mb-1 font-display">
              {t ? "Імпорт лідів" : "Import Leads"}
            </h4>
            <p className="text-sm text-white/40">
              {t ? "Завантажте CSV з контактами, щоб почати дзвонити." : "Upload a CSV with your contacts to start calling."}
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Calls */}
      <div>
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
          {t ? "Останні дзвінки" : "Recent Calls"}
        </h3>
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-8 text-center">
          <p className="text-sm text-white/30">
            {t ? "Дзвінків ще немає. Створіть скрипт та імпортуйте ліди, щоб почати." : "No calls yet. Create a script and import leads to get started."}
          </p>
        </div>
      </div>
    </div>
  );
}
