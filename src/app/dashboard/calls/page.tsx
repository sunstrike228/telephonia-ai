"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Loader2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";

interface CallLog {
  id: string;
  direction: "inbound" | "outbound";
  status: string;
  fromNumber: string | null;
  toNumber: string | null;
  duration: number | null;
  startedAt: string;
  summary: string | null;
  sentiment: string | null;
}

interface TranscriptMessage {
  role: "assistant" | "user";
  content: string;
}

interface CallDetail {
  id: string;
  transcript: TranscriptMessage[];
  summary: string | null;
}

function formatDuration(seconds: number | null): string {
  if (seconds === null || seconds === undefined) return "--";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

function formatDate(dateStr: string, isUa: boolean): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(isUa ? "uk-UA" : "en-US", {
    month: "short",
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
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${c.bg} ${c.text}`}>
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
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border ${c.bg} ${c.text}`}>
      {isUa ? c.labelUa : c.label}
    </span>
  );
}

export default function CallsPage() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedData, setExpandedData] = useState<Record<string, CallDetail>>({});
  const [loadingDetail, setLoadingDetail] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCalls = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/dashboard/calls?page=${page}&limit=25`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCalls(data.calls);
      setTotalPages(data.pagination.totalPages);
    } catch {
      setError(t ? "Не вдалося завантажити дзвінки" : "Failed to load calls");
    } finally {
      setLoading(false);
    }
  }, [page, t]);

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  async function toggleExpand(callId: string) {
    if (expandedId === callId) {
      setExpandedId(null);
      return;
    }

    setExpandedId(callId);

    // Fetch detail if not cached
    if (!expandedData[callId]) {
      setLoadingDetail(callId);
      try {
        const res = await fetch(`/api/dashboard/calls/${callId}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setExpandedData((prev) => ({ ...prev, [callId]: data }));
      } catch {
        // silently fail
      } finally {
        setLoadingDetail(null);
      }
    }
  }

  return (
    <div>
      <PageHeader
        title={t ? "Історія дзвінків" : "Call History"}
        description={t ? "Переглядайте всі дзвінки, транскрипції та оцінки." : "View all calls, transcriptions, and scores."}
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-white/30" />
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      ) : calls.length === 0 ? (
        <EmptyState
          icon={PhoneCall}
          title={t ? "Дзвінків ще немає" : "No calls yet"}
          description={
            t
              ? "Історія дзвінків з'явиться тут, коли ви почнете дзвонити."
              : "Your call history will appear here once you start making calls."
          }
        />
      ) : (
        <>
          {/* Table header */}
          <div className="hidden md:grid grid-cols-[40px_1fr_100px_100px_80px_140px] gap-4 px-6 py-3 text-xs font-medium text-white/30 uppercase tracking-wider">
            <div></div>
            <div>{t ? "Номер" : "Phone"}</div>
            <div>{t ? "Статус" : "Status"}</div>
            <div>{t ? "Настрій" : "Sentiment"}</div>
            <div>{t ? "Час" : "Duration"}</div>
            <div>{t ? "Дата" : "Date"}</div>
          </div>

          {/* Call rows */}
          <div className="space-y-2">
            {calls.map((call) => {
              const isExpanded = expandedId === call.id;
              const detail = expandedData[call.id];
              const phone = call.direction === "outbound" ? call.toNumber : call.fromNumber;

              return (
                <div key={call.id}>
                  {/* Row */}
                  <div
                    className={`group rounded-2xl border bg-[rgba(0,0,0,0.95)] px-6 py-4 cursor-pointer transition-colors ${
                      isExpanded
                        ? "border-[#0090f0]/30 bg-[rgba(0,0,0,1)]"
                        : "border-white/8 hover:border-white/12"
                    }`}
                    onClick={() => toggleExpand(call.id)}
                  >
                    {/* Desktop layout */}
                    <div className="hidden md:grid grid-cols-[40px_1fr_100px_100px_80px_140px] gap-4 items-center">
                      <div className="flex items-center justify-center">
                        {call.direction === "inbound" ? (
                          <PhoneIncoming size={16} className="text-emerald-400" />
                        ) : (
                          <PhoneOutgoing size={16} className="text-blue-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-sm text-white font-medium truncate">
                          {phone || (t ? "Невідомий" : "Unknown")}
                        </span>
                        {call.summary && (
                          <span className="text-xs text-white/25 truncate hidden lg:inline">
                            {call.summary.slice(0, 60)}...
                          </span>
                        )}
                      </div>
                      <div>
                        <StatusBadge status={call.status} isUa={t} />
                      </div>
                      <div>
                        <SentimentBadge sentiment={call.sentiment} isUa={t} />
                      </div>
                      <div className="text-sm text-white/50 font-mono">
                        {formatDuration(call.duration)}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/40">
                          {formatDate(call.startedAt, t)}
                        </span>
                        <div className="flex items-center gap-2">
                          <a
                            href={`/dashboard/calls/${call.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/5 rounded"
                            title={t ? "Детальніше" : "View details"}
                          >
                            <ExternalLink size={14} className="text-white/30" />
                          </a>
                          {isExpanded ? (
                            <ChevronDown size={16} className="text-white/30" />
                          ) : (
                            <ChevronRight size={16} className="text-white/20" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Mobile layout */}
                    <div className="md:hidden space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {call.direction === "inbound" ? (
                            <PhoneIncoming size={16} className="text-emerald-400" />
                          ) : (
                            <PhoneOutgoing size={16} className="text-blue-400" />
                          )}
                          <span className="text-sm text-white font-medium">
                            {phone || (t ? "Невідомий" : "Unknown")}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown size={16} className="text-white/30" />
                        ) : (
                          <ChevronRight size={16} className="text-white/20" />
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <StatusBadge status={call.status} isUa={t} />
                        <SentimentBadge sentiment={call.sentiment} isUa={t} />
                        <span className="text-xs text-white/40 font-mono">
                          {formatDuration(call.duration)}
                        </span>
                        <span className="text-xs text-white/30">
                          {formatDate(call.startedAt, t)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded transcript */}
                  {isExpanded && (
                    <div className="mx-4 mt-1 mb-2 rounded-xl border border-white/5 bg-[rgba(10,10,18,0.95)] p-4">
                      {loadingDetail === call.id ? (
                        <div className="flex justify-center py-6">
                          <Loader2 size={18} className="animate-spin text-white/20" />
                        </div>
                      ) : detail?.transcript && Array.isArray(detail.transcript) && detail.transcript.length > 0 ? (
                        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                          {(detail.transcript as TranscriptMessage[]).map((msg, i) => (
                            <div
                              key={i}
                              className={`flex ${
                                msg.role === "assistant" ? "justify-start" : "justify-end"
                              }`}
                            >
                              <div
                                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                                  msg.role === "assistant"
                                    ? "bg-[#0090f0]/15 text-[#7ec4f8] rounded-bl-md"
                                    : "bg-white/8 text-white/70 rounded-br-md"
                                }`}
                              >
                                {msg.content}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-white/25 text-center py-4">
                          {t ? "Транскрипція недоступна" : "No transcript available"}
                        </p>
                      )}

                      {detail?.summary && (
                        <div className="mt-4 pt-3 border-t border-white/5">
                          <p className="text-xs text-white/30 mb-1 font-medium uppercase tracking-wider">
                            {t ? "Резюме" : "Summary"}
                          </p>
                          <p className="text-sm text-white/50">{detail.summary}</p>
                        </div>
                      )}

                      <div className="mt-3 flex justify-end">
                        <a
                          href={`/dashboard/calls/${call.id}`}
                          className="text-xs text-[#0090f0]/60 hover:text-[#0090f0] transition-colors"
                        >
                          {t ? "Переглянути повністю" : "View full details"} &rarr;
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm rounded-xl border border-white/8 text-white/50 hover:text-white hover:border-white/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {t ? "Попередня" : "Previous"}
              </button>
              <span className="text-sm text-white/30">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 text-sm rounded-xl border border-white/8 text-white/50 hover:text-white hover:border-white/15 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {t ? "Наступна" : "Next"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
