"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EmailMessage {
  id: string;
  leadId: string;
  content: string | null;
  status: string;
  metadata: {
    subject?: string;
    to?: string;
  } | null;
  createdAt: string;
}

const statusConfig: Record<
  string,
  { label: { en: string; ua: string }; color: string; bg: string; border: string }
> = {
  pending: {
    label: { en: "Pending", ua: "Очікує" },
    color: "text-white/50",
    bg: "bg-white/5",
    border: "border-white/10",
  },
  sent: {
    label: { en: "Sent", ua: "Надіслано" },
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  delivered: {
    label: { en: "Delivered", ua: "Доставлено" },
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  read: {
    label: { en: "Opened", ua: "Відкрито" },
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
  },
  replied: {
    label: { en: "Replied", ua: "Відповів" },
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
  },
  failed: {
    label: { en: "Failed", ua: "Помилка" },
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
  },
};

export default function EmailPage() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  const [messages, setMessages] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/email/messages");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setMessages(data.messages || []);
    } catch {
      toast.error(t ? "Не вдалося завантажити листи" : "Failed to load emails");
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(t ? "uk-UA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div>
        <PageHeader
          title="Email"
          description={
            t
              ? "Листи, надіслані вашим AI-агентом."
              : "Emails sent by your AI agent."
          }
        />
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-white/30" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Email"
        description={
          t
            ? "Листи, надіслані вашим AI-агентом."
            : "Emails sent by your AI agent."
        }
      />

      {messages.length === 0 ? (
        <EmptyState
          icon={Mail}
          title={t ? "Немає листів" : "No emails yet"}
          description={
            t
              ? "Ще не було надіслано жодного листа. Запустіть кампанію з каналом Email, щоб почати."
              : "No emails have been sent yet. Launch a campaign with the Email channel to get started."
          }
        />
      ) : (
        <div className="rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.95)] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_1.5fr_auto_auto] gap-4 px-6 py-3 border-b border-white/5 text-xs font-semibold uppercase tracking-wider text-white/25">
            <span>{t ? "Кому" : "To"}</span>
            <span>{t ? "Тема" : "Subject"}</span>
            <span>{t ? "Статус" : "Status"}</span>
            <span>{t ? "Дата" : "Date"}</span>
          </div>

          {/* Rows */}
          {messages.map((msg) => {
            const sc = statusConfig[msg.status] || statusConfig.pending;
            const to = msg.metadata?.to || "—";
            const subject = msg.metadata?.subject || (t ? "(без теми)" : "(no subject)");

            return (
              <div
                key={msg.id}
                className="grid grid-cols-[1fr_1.5fr_auto_auto] gap-4 px-6 py-4 border-b border-white/[0.04] last:border-b-0 items-center"
              >
                {/* To */}
                <div className="text-sm text-white/70 truncate">{to}</div>

                {/* Subject */}
                <div className="text-sm text-white/50 truncate">{subject}</div>

                {/* Status badge */}
                <span
                  className={cn(
                    "text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap",
                    sc.color,
                    sc.bg,
                    sc.border
                  )}
                >
                  {t ? sc.label.ua : sc.label.en}
                </span>

                {/* Date */}
                <span className="text-sm text-white/30 whitespace-nowrap min-w-[140px] text-right">
                  {formatDate(msg.createdAt)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
