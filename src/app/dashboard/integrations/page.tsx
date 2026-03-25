"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { GlassButton } from "@/components/ui/glass-button";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";
import { Mail, Loader2, Check, X, Info, ExternalLink, Send } from "lucide-react";
import { toast } from "sonner";

const integrations = (ua: boolean) => [
  {
    name: "HubSpot",
    description: ua ? "Синхронiзуйте контакти та угоди з HubSpot CRM." : "Sync contacts and deals with HubSpot CRM.",
    color: "#ff7a59",
  },
  {
    name: "Salesforce",
    description: ua ? "Пiдключiть Salesforce для управлiння лiдами." : "Connect your Salesforce org for lead management.",
    color: "#00a1e0",
  },
  {
    name: "Pipedrive",
    description: ua ? "Синхронiзуйте воронку та контакти Pipedrive." : "Sync your Pipedrive pipeline and contacts.",
    color: "#34d399",
  },
  {
    name: "Close",
    description: ua ? "Iнтеграцiя з Close CRM для робочих процесiв дзвiнкiв." : "Integrate with Close CRM for calling workflows.",
    color: "#a78bfa",
  },
];

interface EmailConfig {
  fromEmail: string;
  fromName: string;
  replyTo: string;
}

export default function IntegrationsPage() {
  const lang = useDashboardLang();
  const t = lang === "ua";
  const items = integrations(t);

  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    fromEmail: "",
    fromName: "",
    replyTo: "",
  });
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [emailConnected, setEmailConnected] = useState(false);
  const [testSending, setTestSending] = useState(false);

  const loadEmailConfig = useCallback(async () => {
    setEmailLoading(true);
    try {
      const res = await fetch("/api/dashboard/channels");
      if (!res.ok) return;
      const data = await res.json();
      const emailCfg = data.configs?.find(
        (c: { channel: string }) => c.channel === "email"
      );
      if (emailCfg?.config) {
        const cfg = emailCfg.config as EmailConfig;
        setEmailConfig({
          fromEmail: cfg.fromEmail || "",
          fromName: cfg.fromName || "",
          replyTo: cfg.replyTo || "",
        });
        setEmailConnected(!!cfg.fromEmail);
      }
    } catch {
      // non-blocking
    } finally {
      setEmailLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmailConfig();
  }, [loadEmailConfig]);

  async function handleSaveEmail() {
    if (!emailConfig.fromEmail.trim()) return;
    setEmailSaving(true);
    try {
      const res = await fetch("/api/dashboard/channels", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: "email",
          config: {
            fromEmail: emailConfig.fromEmail.trim(),
            fromName: emailConfig.fromName.trim(),
            replyTo: emailConfig.replyTo.trim() || emailConfig.fromEmail.trim(),
          },
        }),
      });
      if (res.ok) {
        setEmailSaved(true);
        setEmailConnected(true);
        toast.success(t ? "Email налаштування збережено" : "Email settings saved");
        setTimeout(() => {
          setEmailSaved(false);
          setEmailModalOpen(false);
        }, 1500);
      } else {
        throw new Error("Failed to save");
      }
    } catch {
      toast.error(t ? "Не вдалося зберегти email налаштування" : "Failed to save email settings");
    } finally {
      setEmailSaving(false);
    }
  }

  async function handleSendTestEmail() {
    setTestSending(true);
    try {
      const res = await fetch("/api/dashboard/email/test", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success(
          t
            ? `Тестовий лист надiслано на ${data.to}`
            : `Test email sent to ${data.to}`
        );
      } else {
        throw new Error(data.error || "Failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(
        t
          ? `Не вдалося надiслати тестовий лист: ${message}`
          : `Failed to send test email: ${message}`
      );
    } finally {
      setTestSending(false);
    }
  }

  return (
    <div>
      <PageHeader
        title={t ? "Iнтеграцii" : "Integrations"}
        description={t ? "Пiдключiть CRM та iншi iнструменти." : "Connect your CRM and other tools."}
      />

      {/* Email Channel Card */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-white/30 mb-3 uppercase tracking-wider">
          {t ? "Канали комунiкацii" : "Communication Channels"}
        </h3>
        <div className="rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.95)] p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0090f0]/10 border border-[#0090f0]/20">
              <Mail size={18} className="text-[#0090f0]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white font-display">
                  Email
                </h3>
                {emailConnected && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 text-emerald-400">
                    {t ? "Активний" : "Active"}
                  </span>
                )}
              </div>
              <p className="text-sm text-white/40">
                {t
                  ? "Налаштуйте email для автоматизованих кампанiй."
                  : "Configure email settings for automated campaigns."}
              </p>
              {emailConnected && emailConfig.fromEmail && (
                <p className="text-xs text-white/25 mt-1">
                  {emailConfig.fromName ? `${emailConfig.fromName} <${emailConfig.fromEmail}>` : emailConfig.fromEmail}
                </p>
              )}
            </div>
          </div>
          <GlassButton
            size="sm"
            onClick={() => setEmailModalOpen(true)}
            disabled={emailLoading}
          >
            {emailLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : emailConnected ? (
              t ? "Налаштування" : "Settings"
            ) : (
              t ? "Налаштувати" : "Configure"
            )}
          </GlassButton>
        </div>
      </div>

      {/* CRM Integrations */}
      <div>
        <h3 className="text-sm font-medium text-white/30 mb-3 uppercase tracking-wider">
          {t ? "CRM iнтеграцii" : "CRM Integrations"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((integration) => (
            <div
              key={integration.name}
              className="rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.95)] p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border"
                  style={{
                    backgroundColor: `${integration.color}10`,
                    borderColor: `${integration.color}33`,
                  }}
                >
                  <span
                    className="text-sm font-bold"
                    style={{ color: integration.color }}
                  >
                    {integration.name[0]}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white font-display">
                    {integration.name}
                  </h3>
                  <p className="text-sm text-white/40">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/10 text-white/40">
                  Coming Soon
                </span>
                <GlassButton size="sm" disabled className="opacity-50 cursor-not-allowed pointer-events-none">
                  {t ? "Пiдключити" : "Connect"}
                </GlassButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Config Modal */}
      {emailModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setEmailModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-lg rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.98)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#0090f0]/10 border border-[#0090f0]/20">
                  <Mail size={16} className="text-[#0090f0]" />
                </div>
                <h3 className="text-lg font-semibold text-white font-display">
                  {t ? "Налаштування Email" : "Email Settings"}
                </h3>
              </div>
              <button
                onClick={() => setEmailModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors"
              >
                <X size={16} className="text-white/50" />
              </button>
            </div>

            {/* Resend setup info callout */}
            <div className="mb-5 rounded-xl border border-[#0090f0]/20 bg-[#0090f0]/5 p-4">
              <div className="flex items-start gap-3">
                <Info size={16} className="text-[#0090f0] mt-0.5 shrink-0" />
                <div className="text-sm text-white/60 space-y-2">
                  <p className="font-medium text-white/80">
                    {t ? "Як налаштувати email:" : "How to set up email:"}
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-white/50">
                    <li>
                      {t ? "Зареєструйтеся на " : "Sign up at "}
                      <a
                        href="https://resend.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0090f0] hover:underline inline-flex items-center gap-1"
                      >
                        resend.com
                        <ExternalLink size={10} />
                      </a>
                    </li>
                    <li>
                      {t
                        ? "Додайте свiй домен i верифiкуйте DNS-записи"
                        : "Add your domain and verify DNS records"}
                    </li>
                    <li>
                      {t
                        ? "Email вiдправника має бути на верифiкованому доменi"
                        : "Your From Email must be on a verified domain"}
                    </li>
                  </ol>
                  <a
                    href="https://resend.com/docs/dashboard/domains/introduction"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#0090f0] hover:underline mt-1"
                  >
                    {t ? "Документацiя Resend" : "Resend documentation"}
                    <ExternalLink size={10} />
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">
                  {t ? "Email вiдправника *" : "From Email *"}
                </label>
                <input
                  type="email"
                  value={emailConfig.fromEmail}
                  onChange={(e) =>
                    setEmailConfig((c) => ({ ...c, fromEmail: e.target.value }))
                  }
                  placeholder="hello@yourcompany.com"
                  className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors"
                />
                <p className="text-xs text-white/20 mt-1.5">
                  {t
                    ? "Домен повинен бути верифiкований у Resend"
                    : "Domain must be verified in Resend"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">
                  {t ? "Iм'я вiдправника" : "From Name"}
                </label>
                <input
                  type="text"
                  value={emailConfig.fromName}
                  onChange={(e) =>
                    setEmailConfig((c) => ({ ...c, fromName: e.target.value }))
                  }
                  placeholder={t ? "Ваша компанiя" : "Your Company"}
                  className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">
                  {t ? "Reply-to адреса" : "Reply-to Address"}
                </label>
                <input
                  type="email"
                  value={emailConfig.replyTo}
                  onChange={(e) =>
                    setEmailConfig((c) => ({ ...c, replyTo: e.target.value }))
                  }
                  placeholder={emailConfig.fromEmail || "reply@yourcompany.com"}
                  className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors"
                />
                <p className="text-xs text-white/20 mt-1.5">
                  {t
                    ? "Залишiть порожнiм для використання email вiдправника"
                    : "Leave empty to use the from email address"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-white/8">
              {emailConnected ? (
                <GlassButton
                  size="sm"
                  onClick={handleSendTestEmail}
                  disabled={testSending}
                >
                  {testSending ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      {t ? "Надсилання..." : "Sending..."}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={14} />
                      {t ? "Тестовий лист" : "Send Test Email"}
                    </span>
                  )}
                </GlassButton>
              ) : (
                <div />
              )}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setEmailModalOpen(false)}
                  className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
                >
                  {t ? "Скасувати" : "Cancel"}
                </button>
                <GlassButton
                onClick={handleSaveEmail}
                className="glass-button-primary"
                size="sm"
                disabled={emailSaving || !emailConfig.fromEmail.trim()}
              >
                {emailSaved ? (
                  <span className="flex items-center gap-2">
                    <Check size={14} />
                    {t ? "Збережено" : "Saved"}
                  </span>
                ) : emailSaving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    {t ? "Збереження..." : "Saving..."}
                  </span>
                ) : (
                  t ? "Зберегти" : "Save"
                )}
              </GlassButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
