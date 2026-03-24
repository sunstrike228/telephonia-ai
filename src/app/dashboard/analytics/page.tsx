"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";
import {
  PhoneCall,
  Send,
  Mail,
  BarChart3,
  ArrowRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface AnalyticsData {
  voice: {
    total: number;
    avgDuration: number;
    completionRate: number;
    byStatus: { status: string; count: number }[];
  };
  telegram: {
    total: number;
    deliveredRate: number;
    replyRate: number;
    byStatus: { status: string; count: number }[];
  };
  email: {
    total: number;
    openRate: number;
    replyRate: number;
    byStatus: { status: string; count: number }[];
  };
  activityChart: { day: string; voice: number; telegram: number; email: number }[];
  topCampaigns: {
    id: string;
    name: string;
    channels: string[];
    status: string;
    contactsReached: number;
    responseRate: number;
  }[];
  leadStatuses: {
    total: number;
    breakdown: { status: string; count: number }[];
  };
  recentActivity: {
    id: string;
    channel: "voice" | "telegram" | "email";
    action: string;
    leadName: string;
    leadPhone: string | null;
    time: string;
    linkType: "call" | "message";
  }[];
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function timeAgo(dateStr: string, ua: boolean): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return ua ? "щойно" : "just now";
  if (mins < 60) return ua ? `${mins} хв тому` : `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return ua ? `${hrs} год тому` : `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return ua ? `${days} дн тому` : `${days}d ago`;
}

function getDayLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short" });
}

const channelIcon = {
  voice: PhoneCall,
  telegram: Send,
  email: Mail,
};

const channelColor = {
  voice: "#0090f0",
  telegram: "#a78bfa",
  email: "#34d399",
};

const channelLabel = {
  voice: { en: "Voice", ua: "Голос" },
  telegram: { en: "Telegram", ua: "Telegram" },
  email: { en: "Email", ua: "Email" },
};

export default function AnalyticsPage() {
  const lang = useDashboardLang();
  const t = lang === "ua";
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/analytics")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <PageHeader
          title={t ? "Аналітика" : "Analytics"}
          description={t ? "Відстежуйте конверсію, ефективність та тренди." : "Track conversion rates, performance, and trends."}
        />
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-white/20" size={32} />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <PageHeader
          title={t ? "Аналітика" : "Analytics"}
          description={t ? "Відстежуйте конверсію, ефективність та тренди." : "Track conversion rates, performance, and trends."}
        />
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-12">
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/8 mb-6">
              <BarChart3 size={28} className="text-white/20" />
            </div>
            <p className="text-sm text-white/40 max-w-md">
              {t ? "Не вдалося завантажити аналітику." : "Failed to load analytics data."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const chartMax = Math.max(
    1,
    ...data.activityChart.map((d) => d.voice + d.telegram + d.email)
  );

  const leadStatusOrder = ["new", "contacted", "qualified", "converted", "rejected"] as const;
  const leadStatusLabels: Record<string, { en: string; ua: string; color: string }> = {
    new: { en: "New", ua: "Нові", color: "#64748b" },
    contacted: { en: "Contacted", ua: "Контактовані", color: "#0090f0" },
    qualified: { en: "Qualified", ua: "Кваліфіковані", color: "#a78bfa" },
    converted: { en: "Converted", ua: "Конвертовані", color: "#34d399" },
    rejected: { en: "Rejected", ua: "Відхилені", color: "#f87171" },
  };

  return (
    <div>
      <PageHeader
        title={t ? "Аналітика" : "Analytics"}
        description={t ? "Відстежуйте конверсію, ефективність та тренди по всіх каналах." : "Track conversion rates, performance, and trends across all channels."}
      />

      {/* Row 1: Channel overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Voice card */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${channelColor.voice}12`, border: `1px solid ${channelColor.voice}25` }}
            >
              <PhoneCall size={18} stroke={channelColor.voice} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{t ? "Голос" : "Voice"}</div>
              <div className="text-xs text-white/35">{t ? "Дзвінки" : "Phone calls"}</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">{t ? "Всього дзвінків" : "Total calls"}</span>
              <span className="text-sm font-semibold text-white">{data.voice.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">{t ? "Сер. тривалість" : "Avg duration"}</span>
              <span className="text-sm font-semibold text-white">{formatDuration(data.voice.avgDuration)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">{t ? "Завершеність" : "Completion rate"}</span>
              <span className="text-sm font-semibold" style={{ color: channelColor.voice }}>{data.voice.completionRate}%</span>
            </div>
          </div>
        </div>

        {/* Telegram card */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${channelColor.telegram}12`, border: `1px solid ${channelColor.telegram}25` }}
            >
              <Send size={18} stroke={channelColor.telegram} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Telegram</div>
              <div className="text-xs text-white/35">{t ? "Повідомлення" : "Messages"}</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">{t ? "Всього надіслано" : "Total sent"}</span>
              <span className="text-sm font-semibold text-white">{data.telegram.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">{t ? "Доставлено" : "Delivered rate"}</span>
              <span className="text-sm font-semibold" style={{ color: channelColor.telegram }}>{data.telegram.deliveredRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">{t ? "Відповіді" : "Reply rate"}</span>
              <span className="text-sm font-semibold" style={{ color: channelColor.telegram }}>{data.telegram.replyRate}%</span>
            </div>
          </div>
        </div>

        {/* Email card */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${channelColor.email}12`, border: `1px solid ${channelColor.email}25` }}
            >
              <Mail size={18} stroke={channelColor.email} />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Email</div>
              <div className="text-xs text-white/35">{t ? "Листи" : "Emails"}</div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">{t ? "Всього надіслано" : "Total sent"}</span>
              <span className="text-sm font-semibold text-white">{data.email.total}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">{t ? "Відкриваність" : "Open rate"}</span>
              <span className="text-sm font-semibold" style={{ color: channelColor.email }}>{data.email.openRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/50">{t ? "Відповіді" : "Reply rate"}</span>
              <span className="text-sm font-semibold" style={{ color: channelColor.email }}>{data.email.replyRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Activity chart */}
      <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-white font-display">
              {t ? "Активність за 7 днів" : "7-Day Activity"}
            </h3>
            <p className="text-xs text-white/35 mt-1">
              {t ? "Взаємодії по каналах" : "Interactions by channel"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {(["voice", "telegram", "email"] as const).map((ch) => (
              <div key={ch} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: channelColor[ch] }} />
                <span className="text-xs text-white/40">{channelLabel[ch][lang]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-end gap-3 h-48">
          {data.activityChart.map((day, i) => {
            const total = day.voice + day.telegram + day.email;
            const voiceH = chartMax > 0 ? (day.voice / chartMax) * 100 : 0;
            const telegramH = chartMax > 0 ? (day.telegram / chartMax) * 100 : 0;
            const emailH = chartMax > 0 ? (day.email / chartMax) * 100 : 0;

            return (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center justify-end h-40 relative group">
                  {/* Tooltip */}
                  {total > 0 && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[rgba(20,20,30,0.95)] border border-white/10 rounded-lg px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                      <span className="text-[10px] text-white/70">{total} {t ? "всього" : "total"}</span>
                    </div>
                  )}
                  <div className="w-full max-w-[40px] flex flex-col justify-end" style={{ height: "100%" }}>
                    {/* Stacked bars */}
                    <div className="flex flex-col-reverse w-full">
                      {day.voice > 0 && (
                        <div
                          className="w-full rounded-t-md transition-all duration-500"
                          style={{
                            height: `${Math.max(voiceH * 1.6, 4)}px`,
                            backgroundColor: channelColor.voice,
                            animationDelay: `${i * 60}ms`,
                          }}
                        />
                      )}
                      {day.telegram > 0 && (
                        <div
                          className="w-full transition-all duration-500"
                          style={{
                            height: `${Math.max(telegramH * 1.6, 4)}px`,
                            backgroundColor: channelColor.telegram,
                            borderRadius: day.voice === 0 ? "6px 6px 0 0" : "0",
                            animationDelay: `${i * 60 + 30}ms`,
                          }}
                        />
                      )}
                      {day.email > 0 && (
                        <div
                          className="w-full transition-all duration-500"
                          style={{
                            height: `${Math.max(emailH * 1.6, 4)}px`,
                            backgroundColor: channelColor.email,
                            borderRadius: day.telegram === 0 && day.voice === 0 ? "6px 6px 0 0" : "0",
                            animationDelay: `${i * 60 + 60}ms`,
                          }}
                        />
                      )}
                    </div>
                    {total === 0 && (
                      <div className="w-full h-1 rounded-full bg-white/5" />
                    )}
                  </div>
                </div>
                <span className="text-[11px] text-white/30">{getDayLabel(day.day)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 3: Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Top campaigns */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6">
          <h3 className="text-base font-semibold text-white font-display mb-4">
            {t ? "Топ кампанії" : "Top Campaigns"}
          </h3>
          {data.topCampaigns.length === 0 ? (
            <p className="text-sm text-white/30 py-6 text-center">
              {t ? "Кампаній ще немає" : "No campaigns yet"}
            </p>
          ) : (
            <div className="space-y-1">
              {/* Header */}
              <div className="grid grid-cols-[1fr,80px,80px,80px] gap-2 px-3 py-2">
                <span className="text-[11px] text-white/30 uppercase tracking-wider">{t ? "Назва" : "Name"}</span>
                <span className="text-[11px] text-white/30 uppercase tracking-wider text-center">{t ? "Канали" : "Channels"}</span>
                <span className="text-[11px] text-white/30 uppercase tracking-wider text-right">{t ? "Контакти" : "Reached"}</span>
                <span className="text-[11px] text-white/30 uppercase tracking-wider text-right">{t ? "Відповідь" : "Response"}</span>
              </div>
              {data.topCampaigns.map((c) => {
                const channels = (Array.isArray(c.channels) ? c.channels : ["voice"]) as string[];
                return (
                  <div
                    key={c.id}
                    className="grid grid-cols-[1fr,80px,80px,80px] gap-2 px-3 py-2.5 rounded-xl hover:bg-white/[0.03] transition-colors"
                  >
                    <span className="text-sm text-white truncate">{c.name}</span>
                    <div className="flex items-center justify-center gap-1">
                      {channels.includes("voice") && <PhoneCall size={13} stroke={channelColor.voice} />}
                      {channels.includes("telegram") && <Send size={13} stroke={channelColor.telegram} />}
                      {channels.includes("email") && <Mail size={13} stroke={channelColor.email} />}
                    </div>
                    <span className="text-sm text-white/70 text-right">{c.contactsReached}</span>
                    <span className="text-sm font-medium text-right" style={{ color: c.responseRate > 30 ? "#34d399" : c.responseRate > 10 ? "#a78bfa" : "#64748b" }}>
                      {c.responseRate}%
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Lead status breakdown */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6">
          <h3 className="text-base font-semibold text-white font-display mb-4">
            {t ? "Статуси лідів" : "Lead Status Breakdown"}
          </h3>
          {data.leadStatuses.total === 0 ? (
            <p className="text-sm text-white/30 py-6 text-center">
              {t ? "Лідів ще немає" : "No leads yet"}
            </p>
          ) : (
            <div className="space-y-4">
              {leadStatusOrder.map((status) => {
                const item = data.leadStatuses.breakdown.find((b) => b.status === status);
                const count = item?.count || 0;
                const pct = data.leadStatuses.total > 0 ? Math.round((count / data.leadStatuses.total) * 100) : 0;
                const info = leadStatusLabels[status];
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-white/60">{info[lang]}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white/40">{count}</span>
                        <span className="text-xs font-medium" style={{ color: info.color }}>{pct}%</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: info.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Row 4: Recent activity */}
      <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6">
        <h3 className="text-base font-semibold text-white font-display mb-4">
          {t ? "Остання активність" : "Recent Activity"}
        </h3>
        {data.recentActivity.length === 0 ? (
          <p className="text-sm text-white/30 py-6 text-center">
            {t ? "Активності ще немає" : "No recent activity"}
          </p>
        ) : (
          <div className="space-y-1">
            {data.recentActivity.map((item) => {
              const Icon = channelIcon[item.channel];
              const color = channelColor[item.channel];
              const href =
                item.linkType === "call"
                  ? `/dashboard/calls/${item.id}`
                  : `/dashboard/messages/${item.id}`;

              return (
                <Link
                  key={`${item.channel}-${item.id}`}
                  href={href}
                  className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-white/[0.03] transition-colors group"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}12`, border: `1px solid ${color}25` }}
                  >
                    <Icon size={14} stroke={color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white truncate">{item.leadName}</span>
                      {item.leadPhone && (
                        <span className="text-xs text-white/25 hidden sm:inline">{item.leadPhone}</span>
                      )}
                    </div>
                    <span className="text-xs text-white/35">{t ? translateAction(item.action) : item.action}</span>
                  </div>
                  <span className="text-xs text-white/25 flex-shrink-0">{timeAgo(item.time, t)}</span>
                  <ArrowRight size={14} className="text-white/10 group-hover:text-white/30 transition-colors flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function translateAction(action: string): string {
  const map: Record<string, string> = {
    "Called": "Зателефоновано",
    "Sent message": "Надіслано повідомлення",
    "Sent email": "Надіслано лист",
    "Call completed": "Дзвінок завершено",
    "Call failed": "Дзвінок невдалий",
    "Call no_answer": "Без відповіді",
    "Call voicemail": "Голосова пошта",
    "Call busy": "Зайнято",
  };
  return map[action] || action;
}
