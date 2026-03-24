"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface TelegramAccount {
  id: string;
  phone: string;
  username: string | null;
  displayName: string | null;
  status: "warming_up" | "active" | "assigned" | "banned" | "cooldown";
  dailyMessageCount: number;
  maxDailyMessages: number;
  lastMessageAt: string | null;
  createdAt: string;
}

const statusConfig: Record<
  TelegramAccount["status"],
  { label: { en: string; ua: string }; color: string; bg: string; border: string }
> = {
  warming_up: {
    label: { en: "Warming Up", ua: "Прогрiв" },
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
  active: {
    label: { en: "Active", ua: "Активний" },
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  assigned: {
    label: { en: "Assigned", ua: "Призначено" },
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  banned: {
    label: { en: "Banned", ua: "Заблокований" },
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
  },
  cooldown: {
    label: { en: "Cooldown", ua: "Вiдпочинок" },
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
  },
};

export default function TelegramPage() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  const [accounts, setAccounts] = useState<TelegramAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/telegram/accounts");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAccounts(data.accounts || []);
    } catch {
      toast.error(
        t ? "Не вдалося завантажити акаунти" : "Failed to load Telegram accounts"
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "—";
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
          title="Telegram"
          description={
            t
              ? "Акаунти Telegram, призначенi вашiй органiзацii."
              : "Telegram accounts assigned to your organization."
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
        title="Telegram"
        description={
          t
            ? "Акаунти Telegram, призначенi вашiй органiзацii."
            : "Telegram accounts assigned to your organization."
        }
      />

      {accounts.length === 0 ? (
        <EmptyState
          icon={Send}
          title={t ? "Немає Telegram акаунтiв" : "No Telegram accounts"}
          description={
            t
              ? "Вашiй органiзацii ще не призначено жодного Telegram акаунта. Зверніться до адмiнiстратора."
              : "No Telegram accounts have been assigned to your organization yet. Contact your administrator."
          }
        />
      ) : (
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-3 border-b border-white/5 text-xs font-semibold uppercase tracking-wider text-white/25">
            <span>{t ? "Акаунт" : "Account"}</span>
            <span>{t ? "Статус" : "Status"}</span>
            <span>{t ? "Повiдомлення" : "Messages"}</span>
            <span>{t ? "Останнє використання" : "Last Used"}</span>
          </div>

          {/* Rows */}
          {accounts.map((acc) => {
            const sc = statusConfig[acc.status];
            return (
              <div
                key={acc.id}
                className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-6 py-4 border-b border-white/[0.04] last:border-b-0 items-center"
              >
                {/* Account info */}
                <div className="min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {acc.phone}
                  </div>
                  {acc.username && (
                    <div className="text-xs text-white/30 truncate">
                      @{acc.username}
                    </div>
                  )}
                  {acc.displayName && !acc.username && (
                    <div className="text-xs text-white/30 truncate">
                      {acc.displayName}
                    </div>
                  )}
                </div>

                {/* Status badge */}
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full border ${sc.color} ${sc.bg} ${sc.border} whitespace-nowrap`}
                >
                  {t ? sc.label.ua : sc.label.en}
                </span>

                {/* Messages count */}
                <div className="text-sm text-white/40 whitespace-nowrap text-right min-w-[80px]">
                  <span className="text-white/70">{acc.dailyMessageCount}</span>
                  <span className="text-white/20"> / {acc.maxDailyMessages}</span>
                </div>

                {/* Last used */}
                <span className="text-sm text-white/30 whitespace-nowrap min-w-[140px] text-right">
                  {formatDate(acc.lastMessageAt)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
