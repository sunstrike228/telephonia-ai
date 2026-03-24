"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { PhoneCall, Users, FileText, Mic, Megaphone, Send, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";
import { OnboardingWizard } from "@/components/dashboard/onboarding-wizard";

interface AnalyticsData {
  voice: {
    total: number;
    completionRate: number;
    avgDuration: number;
    byStatus: { status: string; count: number }[];
  };
  telegram: {
    total: number;
    replyRate: number;
    deliveredRate: number;
    byStatus: { status: string; count: number }[];
  };
  email: {
    total: number;
    openRate: number;
    replyRate: number;
    byStatus: { status: string; count: number }[];
  };
  recentActivity: {
    id: string;
    channel: string;
    action: string;
    leadName: string;
    leadPhone: string | null;
    time: string;
  }[];
  leadStatuses: { total: number };
}

export default function DashboardOverview() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  const [scriptCount, setScriptCount] = useState(0);
  const [campaignTotal, setCampaignTotal] = useState(0);
  const [campaignActive, setCampaignActive] = useState(0);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/onboarding")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.onboardingDone === false) {
          setShowOnboarding(true);
        }
      })
      .catch(() => {});
  }, []);

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
        if (data) setAnalytics(data);
      })
      .catch(() => {});
  }, []);

  const voice = analytics?.voice;
  const telegram = analytics?.telegram;
  const email = analytics?.email;
  const recentActivity = analytics?.recentActivity || [];

  function formatRelativeTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return t ? "Щойно" : "Just now";
    if (mins < 60) return t ? `${mins} хв тому` : `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t ? `${hours} год тому` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return t ? `${days} дн тому` : `${days}d ago`;
  }

  return (
    <div>
      {showOnboarding && (
        <OnboardingWizard onComplete={() => setShowOnboarding(false)} />
      )}
      <PageHeader
        title={t ? "З поверненням" : "Welcome back"}
        description={t ? "Ось що відбувається з вашими AI-агентами сьогодні." : "Here's what's happening with your AI agents today."}
      />

      {/* Channel Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Voice Card */}
        <Link
          href="/dashboard/calls"
          className="group rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 hover:border-[#0090f0]/30 transition-colors duration-300"
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#0090f012", border: "1px solid #0090f025" }}
            >
              <Phone size={20} stroke="#0090f0" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white font-display">
                {t ? "Голос" : "Voice"}
              </h3>
              <span className="text-xs text-white/30">{t ? "Дзвінки" : "Calls"}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/40">{t ? "Всього дзвінків" : "Total calls"}</span>
              <span className="text-lg font-bold text-white font-display">{voice?.total ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/40">{t ? "Завершених" : "Completion rate"}</span>
              <span className="text-sm font-medium text-[#0090f0]">{voice?.completionRate ?? 0}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/40">{t ? "Сер. тривалість" : "Avg duration"}</span>
              <span className="text-sm font-medium text-white/60">{voice?.avgDuration ?? 0}s</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.04]">
            <div className="w-full h-1.5 rounded-full bg-white/[0.04]">
              <div
                className="h-full rounded-full bg-[#0090f0]/60 transition-all duration-500"
                style={{ width: `${Math.min(voice?.completionRate ?? 0, 100)}%` }}
              />
            </div>
          </div>
        </Link>

        {/* Telegram Card */}
        <Link
          href="/dashboard/telegram"
          className="group rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 hover:border-[#a78bfa]/30 transition-colors duration-300"
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#a78bfa12", border: "1px solid #a78bfa25" }}
            >
              <MessageCircle size={20} stroke="#a78bfa" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white font-display">Telegram</h3>
              <span className="text-xs text-white/30">{t ? "Повідомлення" : "Messages"}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/40">{t ? "Надіслано" : "Messages sent"}</span>
              <span className="text-lg font-bold text-white font-display">{telegram?.total ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/40">{t ? "Відповідей" : "Reply rate"}</span>
              <span className="text-sm font-medium text-[#a78bfa]">{telegram?.replyRate ?? 0}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/40">{t ? "Доставлено" : "Delivered"}</span>
              <span className="text-sm font-medium text-white/60">{telegram?.deliveredRate ?? 0}%</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.04]">
            <div className="w-full h-1.5 rounded-full bg-white/[0.04]">
              <div
                className="h-full rounded-full bg-[#a78bfa]/60 transition-all duration-500"
                style={{ width: `${Math.min(telegram?.replyRate ?? 0, 100)}%` }}
              />
            </div>
          </div>
        </Link>

        {/* Email Card */}
        <Link
          href="/dashboard/email"
          className="group rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 hover:border-[#34d399]/30 transition-colors duration-300"
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#34d39912", border: "1px solid #34d39925" }}
            >
              <Mail size={20} stroke="#34d399" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white font-display">Email</h3>
              <span className="text-xs text-white/30">{t ? "Листи" : "Emails"}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/40">{t ? "Надіслано" : "Emails sent"}</span>
              <span className="text-lg font-bold text-white font-display">{email?.total ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/40">{t ? "Відкрито" : "Open rate"}</span>
              <span className="text-sm font-medium text-[#34d399]">{email?.openRate ?? 0}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/40">{t ? "Відповідей" : "Reply rate"}</span>
              <span className="text-sm font-medium text-white/60">{email?.replyRate ?? 0}%</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/[0.04]">
            <div className="w-full h-1.5 rounded-full bg-white/[0.04]">
              <div
                className="h-full rounded-full bg-[#34d399]/60 transition-all duration-500"
                style={{ width: `${Math.min(email?.openRate ?? 0, 100)}%` }}
              />
            </div>
          </div>
        </Link>
      </div>

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

      {/* Recent Activity */}
      <div>
        <h3 className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-4">
          {t ? "Остання активність" : "Recent Activity"}
        </h3>
        {recentActivity.length === 0 ? (
          <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-8 text-center">
            <p className="text-sm text-white/30">
              {t ? "Активності ще немає. Створіть скрипт та імпортуйте ліди, щоб почати." : "No activity yet. Create a script and import leads to get started."}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] overflow-hidden">
            {recentActivity.map((item) => {
              const channelIcon =
                item.channel === "voice" ? <Phone size={14} stroke="#0090f0" /> :
                item.channel === "telegram" ? <MessageCircle size={14} stroke="#a78bfa" /> :
                <Mail size={14} stroke="#34d399" />;
              const channelColor =
                item.channel === "voice" ? "#0090f0" :
                item.channel === "telegram" ? "#a78bfa" :
                "#34d399";
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-4 px-6 py-3.5 border-b border-white/[0.04] last:border-b-0"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${channelColor}12`, border: `1px solid ${channelColor}25` }}
                  >
                    {channelIcon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-white/80 font-medium">{item.leadName}</span>
                    <span className="text-sm text-white/30 ml-2">{item.action}</span>
                  </div>
                  <span className="text-xs text-white/25 whitespace-nowrap">{formatRelativeTime(item.time)}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
