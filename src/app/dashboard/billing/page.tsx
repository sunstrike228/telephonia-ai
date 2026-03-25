"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { GlassButton } from "@/components/ui/glass-button";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";
import { toast } from "sonner";
import { Phone, MessageCircle, Mail, Check, Zap, Crown, Rocket } from "lucide-react";

interface UsageData {
  minutes: number;
  telegramMessages: number;
  emails: number;
  plan: string;
  limits: { minutes: number; telegram: number; emails: number };
}

interface PaymentMethods {
  stripe: boolean;
  liqpay: boolean;
}

type PaymentProvider = "stripe" | "liqpay";

const PLANS = [
  {
    id: "starter",
    priceUsd: 40,
    priceUah: 1650,
    icon: Zap,
    color: "#0090f0",
    features: {
      en: [
        "500 voice minutes/mo",
        "100 Telegram messages/mo",
        "500 emails/mo",
        "1 campaign at a time",
        "Basic analytics",
      ],
      ua: [
        "500 хвилин голосу/міс",
        "100 Telegram повідомлень/міс",
        "500 листів/міс",
        "1 кампанія одночасно",
        "Базова аналітика",
      ],
    },
  },
  {
    id: "growth",
    priceUsd: 99,
    priceUah: 4100,
    icon: Rocket,
    color: "#a78bfa",
    popular: true,
    features: {
      en: [
        "2,000 voice minutes/mo",
        "500 Telegram messages/mo",
        "2,000 emails/mo",
        "5 campaigns at a time",
        "Advanced analytics",
        "Priority support",
      ],
      ua: [
        "2 000 хвилин голосу/міс",
        "500 Telegram повідомлень/міс",
        "2 000 листів/міс",
        "5 кампаній одночасно",
        "Розширена аналітика",
        "Пріоритетна підтримка",
      ],
    },
  },
  {
    id: "enterprise",
    priceUsd: 299,
    priceUah: 12300,
    icon: Crown,
    color: "#f59e0b",
    features: {
      en: [
        "Unlimited voice minutes",
        "Unlimited Telegram messages",
        "Unlimited emails",
        "Unlimited campaigns",
        "Custom integrations",
        "Dedicated account manager",
      ],
      ua: [
        "Безлімітні хвилини голосу",
        "Безлімітні Telegram повідомлення",
        "Безлімітні листи",
        "Безлімітні кампанії",
        "Кастомні інтеграції",
        "Персональний менеджер",
      ],
    },
  },
];

function UsageBar({
  label,
  used,
  limit,
  color,
  icon: Icon,
}: {
  label: string;
  used: number;
  limit: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const displayLimit = limit >= 999999 ? "Unlimited" : limit.toLocaleString();

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-white/40" />
          <span className="text-sm text-white/40">{label}</span>
        </div>
        <span className="text-sm text-white/70">
          {used.toLocaleString()} / {displayLimit}
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-white/[0.05]">
        <div
          className="h-2 rounded-full transition-[width] duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

/**
 * Detect if user is likely Ukrainian based on browser locale/timezone
 */
function detectUkrainianUser(): boolean {
  try {
    const lang = navigator.language || "";
    if (lang.startsWith("uk") || lang.startsWith("ua")) return true;

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("Kiev") || tz.includes("Kyiv") || tz.includes("Europe/Uzhgorod") || tz.includes("Europe/Zaporozhye")) return true;
  } catch {
    // ignore
  }
  return false;
}

export default function BillingPage() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods | null>(null);
  const [provider, setProvider] = useState<PaymentProvider>("stripe");

  // LiqPay form refs
  const liqpayFormRef = useRef<HTMLFormElement>(null);
  const liqpayDataRef = useRef<HTMLInputElement>(null);
  const liqpaySignatureRef = useRef<HTMLInputElement>(null);

  // Fetch available payment methods
  useEffect(() => {
    fetch("/api/dashboard/billing/payment-methods")
      .then((res) => res.json())
      .then((data: PaymentMethods) => {
        setPaymentMethods(data);

        // Auto-detect default provider
        const isUa = detectUkrainianUser();
        if (isUa && data.liqpay) {
          setProvider("liqpay");
        } else if (data.stripe) {
          setProvider("stripe");
        } else if (data.liqpay) {
          setProvider("liqpay");
        }
      })
      .catch(() => {
        // Fallback: assume stripe only
        setPaymentMethods({ stripe: true, liqpay: false });
      });
  }, []);

  const fetchUsage = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/billing/usage");
      if (!res.ok) throw new Error("Failed to fetch usage");
      const data = await res.json();
      setUsage(data);
    } catch {
      toast.error(t ? "Не вдалося завантажити дані" : "Failed to load usage data");
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  // Check for success/cancel query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      toast.success(t ? "Тариф успішно оновлено!" : "Plan upgraded successfully!");
      window.history.replaceState({}, "", "/dashboard/billing");
      fetchUsage();
    }
    if (params.get("canceled") === "true") {
      toast.info(t ? "Оплату скасовано" : "Payment canceled");
      window.history.replaceState({}, "", "/dashboard/billing");
    }
  }, [t, fetchUsage]);

  async function handleUpgrade(planId: string) {
    setUpgrading(planId);

    if (provider === "liqpay") {
      await handleLiqPayUpgrade(planId);
    } else {
      await handleStripeUpgrade(planId);
    }

    setUpgrading(null);
  }

  async function handleStripeUpgrade(planId: string) {
    try {
      const res = await fetch("/api/dashboard/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || (t ? "Помилка" : "Error"));
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error(t ? "Не вдалося створити сесію оплати" : "Failed to create checkout session");
    }
  }

  async function handleLiqPayUpgrade(planId: string) {
    try {
      const res = await fetch("/api/dashboard/billing/liqpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || (t ? "Помилка" : "Error"));
        return;
      }

      // Submit hidden LiqPay form
      if (liqpayDataRef.current && liqpaySignatureRef.current && liqpayFormRef.current) {
        liqpayDataRef.current.value = result.data;
        liqpaySignatureRef.current.value = result.signature;
        liqpayFormRef.current.submit();
      }
    } catch {
      toast.error(
        t ? "Не вдалося створити платіж LiqPay" : "Failed to create LiqPay payment"
      );
    }
  }

  async function handleManageSubscription() {
    try {
      const res = await fetch("/api/dashboard/billing/portal", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || (t ? "Помилка" : "Error"));
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      toast.error(
        t ? "Не вдалося відкрити портал" : "Failed to open billing portal"
      );
    }
  }

  const currentPlan = usage?.plan || "free";
  const planLabel =
    currentPlan === "free"
      ? t
        ? "Безкоштовний"
        : "Free"
      : currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1);

  const isLiqPay = provider === "liqpay";
  const planPrice =
    currentPlan === "free"
      ? 0
      : isLiqPay
        ? PLANS.find((p) => p.id === currentPlan)?.priceUah || 0
        : PLANS.find((p) => p.id === currentPlan)?.priceUsd || 0;

  const currencySymbol = isLiqPay ? "" : "$";
  const currencySuffix = isLiqPay ? "₴" : "";

  // Determine if toggle should be shown
  const showToggle =
    paymentMethods && paymentMethods.stripe && paymentMethods.liqpay;
  const hasAnyProvider =
    paymentMethods && (paymentMethods.stripe || paymentMethods.liqpay);

  return (
    <div>
      <PageHeader
        title={t ? "Оплата" : "Billing"}
        description={
          t
            ? "Керуйте тарифом та використанням."
            : "Manage your plan and usage."
        }
      />

      {/* Payment Method Toggle */}
      {showToggle && (
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-white/50">
            {t ? "Спосіб оплати:" : "Payment method:"}
          </span>
          <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-0.5">
            <button
              onClick={() => setProvider("stripe")}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                provider === "stripe"
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              Stripe (USD)
            </button>
            <button
              onClick={() => setProvider("liqpay")}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                provider === "liqpay"
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              LiqPay (UAH)
            </button>
          </div>
        </div>
      )}

      {/* Current Plan + Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Current Plan */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.95)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-white font-display">
              {t ? "Поточний тариф" : "Current Plan"}
            </h3>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#0090f0]/10 text-[#0090f0] border border-[#0090f0]/20">
              {planLabel}
            </span>
          </div>
          <div className="mb-4">
            {loading ? (
              <div className="h-10 w-24 rounded bg-white/5 animate-pulse" />
            ) : (
              <>
                <span className="text-3xl font-bold text-white font-display">
                  {currencySymbol}{planPrice}{currencySuffix}
                </span>
                <span className="text-sm text-white/40">
                  {t ? "/міс" : "/mo"}
                </span>
              </>
            )}
          </div>
          <p className="text-sm text-white/40 mb-6">
            {currentPlan === "free"
              ? t
                ? "Оберіть тариф, щоб почати використовувати платформу."
                : "Choose a plan to start using the platform."
              : t
                ? `${planLabel} тариф активний.`
                : `${planLabel} plan is active.`}
          </p>
          <div className="flex gap-3">
            {currentPlan === "free" ? (
              <GlassButton size="sm" onClick={() => handleUpgrade("starter")}>
                {t ? "Обрати тариф" : "Choose Plan"}
              </GlassButton>
            ) : (
              <GlassButton size="sm" onClick={handleManageSubscription}>
                {t ? "Керувати підпискою" : "Manage Subscription"}
              </GlassButton>
            )}
          </div>
        </div>

        {/* Usage Stats */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.95)] p-6">
          <h3 className="text-base font-semibold text-white font-display mb-4">
            {t ? "Використання за місяць" : "Usage This Month"}
          </h3>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-4 w-full rounded bg-white/5 animate-pulse" />
                  <div className="h-2 w-full rounded bg-white/5 animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <UsageBar
                label={t ? "Хвилин голосу" : "Voice Minutes"}
                used={usage?.minutes || 0}
                limit={usage?.limits.minutes || 0}
                color="#0090f0"
                icon={Phone}
              />
              <UsageBar
                label={t ? "Telegram повідомлень" : "Telegram Messages"}
                used={usage?.telegramMessages || 0}
                limit={usage?.limits.telegram || 0}
                color="#34d399"
                icon={MessageCircle}
              />
              <UsageBar
                label={t ? "Листів" : "Emails"}
                used={usage?.emails || 0}
                limit={usage?.limits.emails || 0}
                color="#a78bfa"
                icon={Mail}
              />
            </div>
          )}
        </div>
      </div>

      {/* Plan Comparison */}
      <h3 className="text-lg font-semibold text-white font-display mb-4">
        {t ? "Тарифи" : "Plans"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.id;
          const features = t ? plan.features.ua : plan.features.en;
          const displayPrice = isLiqPay ? plan.priceUah : plan.priceUsd;

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl border p-6 transition-colors ${
                isCurrent
                  ? "border-[#0090f0]/40 bg-[#0090f0]/5"
                  : "border-white/8 bg-[rgba(0,0,0,0.95)] hover:border-white/15"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#a78bfa] text-white">
                    {t ? "Популярний" : "Popular"}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${plan.color}15` }}
                >
                  <Icon
                    className="w-4.5 h-4.5"
                    style={{ color: plan.color }}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white font-display capitalize">
                    {plan.id}
                  </h4>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-white font-display">
                  {currencySymbol}{displayPrice.toLocaleString()}{currencySuffix}
                </span>
                <span className="text-sm text-white/40">
                  {t ? "/міс" : "/mo"}
                </span>
              </div>

              <ul className="space-y-2.5 mb-6">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 mt-0.5 text-[#34d399] shrink-0" />
                    <span className="text-sm text-white/60">{f}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full text-center text-sm font-medium text-[#0090f0] py-2">
                  {t ? "Поточний тариф" : "Current Plan"}
                </div>
              ) : hasAnyProvider ? (
                <GlassButton
                  size="sm"
                  className="w-full"
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={upgrading === plan.id}
                >
                  {upgrading === plan.id
                    ? t
                      ? "Завантаження..."
                      : "Loading..."
                    : t
                      ? isLiqPay
                        ? "Оплатити"
                        : "Обрати"
                      : isLiqPay
                        ? "Pay"
                        : "Upgrade"}
                </GlassButton>
              ) : (
                <div className="w-full text-center text-sm text-white/30 py-2">
                  {t ? "Оплата недоступна" : "Payments unavailable"}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Hidden LiqPay form for form submission */}
      <form
        ref={liqpayFormRef}
        method="POST"
        action="https://www.liqpay.ua/api/3/checkout"
        target="_blank"
        className="hidden"
      >
        <input ref={liqpayDataRef} type="hidden" name="data" value="" />
        <input ref={liqpaySignatureRef} type="hidden" name="signature" value="" />
      </form>
    </div>
  );
}
