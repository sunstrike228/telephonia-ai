"use client";

import { useState, useEffect, use } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { GlassButton } from "@/components/ui/glass-button";
import {
  ArrowLeft,
  PhoneIncoming,
  PhoneOutgoing,
  Loader2,
  Clock,
  Calendar,
  Phone,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";

interface TranscriptMessage {
  role: "assistant" | "user";
  content: string;
}

interface CallDetail {
  id: string;
  direction: "inbound" | "outbound";
  status: string;
  fromNumber: string | null;
  toNumber: string | null;
  duration: number | null;
  startedAt: string;
  endedAt: string | null;
  transcript: TranscriptMessage[];
  summary: string | null;
  sentiment: string | null;
}

function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds === undefined) return "--";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

function formatFullDate(dateStr: string, isUa: boolean): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(isUa ? "uk-UA" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ status, isUa }: { status: string; isUa: boolean }) {
  const config: Record<string, { bg: string; text: string; label: string; labelUa: string }> = {
    completed: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400", label: "Completed", labelUa: "Завершено" },
    failed: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-400", label: "Failed", labelUa: "Невдалий" },
    no_answer: { bg: "bg-orange-500/10 border-orange-500/20", text: "text-orange-400", label: "No Answer", labelUa: "Без відповіді" },
    voicemail: { bg: "bg-purple-500/10 border-purple-500/20", text: "text-purple-400", label: "Voicemail", labelUa: "Голос. пошта" },
    busy: { bg: "bg-yellow-500/10 border-yellow-500/20", text: "text-yellow-400", label: "Busy", labelUa: "Зайнято" },
    in_progress: { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-400", label: "In Progress", labelUa: "В процесі" },
  };

  const c = config[status] || config.completed;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${c.bg} ${c.text}`}>
      {isUa ? c.labelUa : c.label}
    </span>
  );
}

function SentimentBadge({ sentiment, isUa }: { sentiment: string | null; isUa: boolean }) {
  if (!sentiment) return null;

  const config: Record<string, { bg: string; text: string; label: string; labelUa: string }> = {
    positive: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400", label: "Positive", labelUa: "Позитивний" },
    negative: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-400", label: "Negative", labelUa: "Негативний" },
    neutral: { bg: "bg-white/5 border-white/10", text: "text-white/50", label: "Neutral", labelUa: "Нейтральний" },
  };

  const c = config[sentiment] || config.neutral;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium border ${c.bg} ${c.text}`}>
      {isUa ? c.labelUa : c.label}
    </span>
  );
}

export default function CallDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const lang = useDashboardLang();
  const t = lang === "ua";

  const [call, setCall] = useState<CallDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCall() {
      try {
        setLoading(true);
        const res = await fetch(`/api/dashboard/calls/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setCall(data);
      } catch {
        setError(t ? "Дзвінок не знайдено" : "Call not found");
      } finally {
        setLoading(false);
      }
    }
    fetchCall();
  }, [id, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-white/30" />
      </div>
    );
  }

  if (error || !call) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 text-sm mb-4">{error || (t ? "Дзвінок не знайдено" : "Call not found")}</p>
        <a href="/dashboard/calls" className="text-sm text-[#0090f0] hover:underline">
          &larr; {t ? "Назад до дзвінків" : "Back to calls"}
        </a>
      </div>
    );
  }

  const phone = call.direction === "outbound" ? call.toNumber : call.fromNumber;
  const transcript = Array.isArray(call.transcript) ? (call.transcript as TranscriptMessage[]) : [];

  return (
    <div>
      <PageHeader
        title={t ? "Деталі дзвінка" : "Call Details"}
        action={
          <GlassButton href="/dashboard/calls" size="sm">
            <span className="flex items-center gap-2">
              <ArrowLeft size={14} />
              {t ? "Назад" : "Back"}
            </span>
          </GlassButton>
        }
      />

      {/* Metadata cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Direction + Phone */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-4">
          <div className="flex items-center gap-2 text-white/30 text-xs mb-2">
            <Phone size={12} />
            {t ? "Напрямок" : "Direction"}
          </div>
          <div className="flex items-center gap-2">
            {call.direction === "inbound" ? (
              <PhoneIncoming size={16} className="text-emerald-400" />
            ) : (
              <PhoneOutgoing size={16} className="text-blue-400" />
            )}
            <span className="text-sm text-white font-medium">
              {call.direction === "inbound" ? (t ? "Вхідний" : "Inbound") : (t ? "Вихідний" : "Outbound")}
            </span>
          </div>
          <p className="text-xs text-white/40 mt-1 font-mono">
            {phone || (t ? "Невідомий" : "Unknown")}
          </p>
        </div>

        {/* Duration */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-4">
          <div className="flex items-center gap-2 text-white/30 text-xs mb-2">
            <Clock size={12} />
            {t ? "Тривалість" : "Duration"}
          </div>
          <p className="text-lg text-white font-semibold font-mono">
            {formatDuration(call.duration)}
          </p>
        </div>

        {/* Status + Sentiment */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-4">
          <div className="flex items-center gap-2 text-white/30 text-xs mb-2">
            <TrendingUp size={12} />
            {t ? "Статус" : "Status"}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={call.status} isUa={t} />
            <SentimentBadge sentiment={call.sentiment} isUa={t} />
          </div>
        </div>

        {/* Date */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-4">
          <div className="flex items-center gap-2 text-white/30 text-xs mb-2">
            <Calendar size={12} />
            {t ? "Дата" : "Date"}
          </div>
          <p className="text-sm text-white/70">
            {formatFullDate(call.startedAt, t)}
          </p>
        </div>
      </div>

      {/* Phone numbers */}
      {(call.fromNumber || call.toNumber) && (
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-4 mb-6">
          <div className="flex items-center gap-6 text-sm">
            {call.fromNumber && (
              <div>
                <span className="text-white/30 text-xs">{t ? "Від" : "From"}:</span>{" "}
                <span className="text-white/70 font-mono">{call.fromNumber}</span>
              </div>
            )}
            <span className="text-white/15">&rarr;</span>
            {call.toNumber && (
              <div>
                <span className="text-white/30 text-xs">{t ? "До" : "To"}:</span>{" "}
                <span className="text-white/70 font-mono">{call.toNumber}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      {call.summary && (
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-5 mb-6">
          <h3 className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3 flex items-center gap-2">
            <MessageSquare size={12} />
            {t ? "Резюме" : "Summary"}
          </h3>
          <p className="text-sm text-white/60 leading-relaxed">{call.summary}</p>
        </div>
      )}

      {/* Transcript */}
      <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-5">
        <h3 className="text-xs font-medium text-white/30 uppercase tracking-wider mb-5 flex items-center gap-2">
          <MessageSquare size={12} />
          {t ? "Транскрипція" : "Transcript"}
          {transcript.length > 0 && (
            <span className="text-white/15 font-normal">
              ({transcript.length} {t ? "повідомлень" : "messages"})
            </span>
          )}
        </h3>

        {transcript.length > 0 ? (
          <div className="space-y-4">
            {transcript.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div className="max-w-[75%]">
                  <div className={`text-[10px] mb-1 px-1 ${
                    msg.role === "assistant" ? "text-[#0090f0]/40" : "text-white/20 text-right"
                  }`}>
                    {msg.role === "assistant"
                      ? (t ? "Агент" : "Agent")
                      : (t ? "Клієнт" : "Customer")}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "assistant"
                        ? "bg-[#0090f0]/12 text-[#7ec4f8] border border-[#0090f0]/10 rounded-bl-md"
                        : "bg-white/6 text-white/65 border border-white/6 rounded-br-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/25 text-center py-8">
            {t ? "Транскрипція недоступна для цього дзвінка" : "No transcript available for this call"}
          </p>
        )}
      </div>
    </div>
  );
}
