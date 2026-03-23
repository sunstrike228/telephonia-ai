"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { GlassButton } from "@/components/ui/glass-button";
import {
  Megaphone, Plus, Loader2, X, Phone, MessageCircle, Mail,
  Play, Pause, Pencil, Trash2, Users, ChevronDown, ChevronUp,
  GripVertical, Calendar, Sparkles, Send, RefreshCw,
} from "lucide-react";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";

interface Campaign {
  id: string;
  orgId: string;
  name: string;
  scriptId: string | null;
  voiceConfigId: string | null;
  status: "draft" | "active" | "paused" | "completed";
  channels: string[];
  channelPriority: string[];
  scheduledAt: string | null;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  leadCount: number;
}

interface CampaignDetail extends Campaign {
  stats: {
    total: number;
    contacted: number;
    qualified: number;
    converted: number;
    rejected: number;
  };
}

interface Script {
  id: string;
  name: string;
}

interface CampaignForm {
  name: string;
  scriptId: string;
  channels: string[];
  channelPriority: string[];
  scheduledAt: string;
}

const emptyForm: CampaignForm = {
  name: "",
  scriptId: "",
  channels: ["voice"],
  channelPriority: ["telegram", "voice", "email"],
  scheduledAt: "",
};

const channelIcons: Record<string, typeof Phone> = {
  voice: Phone,
  telegram: MessageCircle,
  email: Mail,
};

const channelLabels: Record<string, { en: string; ua: string }> = {
  voice: { en: "Voice", ua: "Голос" },
  telegram: { en: "Telegram", ua: "Telegram" },
  email: { en: "Email", ua: "Email" },
};

const statusColors: Record<string, string> = {
  draft: "text-white/50 bg-white/5 border-white/10",
  active: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  paused: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  completed: "text-blue-400 bg-blue-400/10 border-blue-400/20",
};

const statusLabels: Record<string, { en: string; ua: string }> = {
  draft: { en: "Draft", ua: "Чернетка" },
  active: { en: "Active", ua: "Активна" },
  paused: { en: "Paused", ua: "Пауза" },
  completed: { en: "Completed", ua: "Завершена" },
};

export default function CampaignsPage() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CampaignForm>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedDetail, setExpandedDetail] = useState<CampaignDetail | null>(null);
  const [expandLoading, setExpandLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [emailPreview, setEmailPreview] = useState<{ subject: string; body: string } | null>(null);
  const [emailGenLoading, setEmailGenLoading] = useState(false);
  const [emailType, setEmailType] = useState<"initial" | "followup" | "final">("initial");

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/campaigns");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCampaigns(data.campaigns);
    } catch {
      setError(t ? "Не вдалося завантажити кампанії" : "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, [t]);

  const fetchScripts = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/scripts");
      if (!res.ok) throw new Error("Failed to fetch scripts");
      const data = await res.json();
      setScripts(data);
    } catch {
      // non-blocking
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
    setError(null);
    fetchScripts();
  }

  function openEdit(campaign: Campaign) {
    setEditingId(campaign.id);
    setForm({
      name: campaign.name,
      scriptId: campaign.scriptId || "",
      channels: Array.isArray(campaign.channels) ? campaign.channels : ["voice"],
      channelPriority: Array.isArray(campaign.channelPriority) ? campaign.channelPriority : ["telegram", "voice", "email"],
      scheduledAt: campaign.scheduledAt || "",
    });
    setModalOpen(true);
    setError(null);
    fetchScripts();
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError(t ? "Назва обов'язкова" : "Name is required");
      return;
    }

    if (form.channels.length === 0) {
      setError(t ? "Оберіть хоча б один канал" : "Select at least one channel");
      return;
    }

    setSaving(true);
    setError(null);

    const body = {
      name: form.name.trim(),
      scriptId: form.scriptId || null,
      channels: form.channels,
      channelPriority: form.channelPriority.filter((c) => form.channels.includes(c)),
      scheduledAt: form.scheduledAt || null,
    };

    try {
      const url = editingId
        ? `/api/dashboard/campaigns/${editingId}`
        : "/api/dashboard/campaigns";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setModalOpen(false);
      setForm(emptyForm);
      setEditingId(null);
      await fetchCampaigns();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/dashboard/campaigns/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setDeleteConfirm(null);
      if (expandedId === id) {
        setExpandedId(null);
        setExpandedDetail(null);
      }
      await fetchCampaigns();
    } catch {
      setError(t ? "Не вдалося видалити кампанію" : "Failed to delete campaign");
    }
  }

  async function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedDetail(null);
      return;
    }
    setExpandedId(id);
    setExpandLoading(true);
    try {
      const res = await fetch(`/api/dashboard/campaigns/${id}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setExpandedDetail(data);
    } catch {
      setError(t ? "Не вдалося завантажити деталі" : "Failed to load details");
    } finally {
      setExpandLoading(false);
    }
  }

  async function handleStartPause(campaign: Campaign) {
    const action = campaign.status === "active" ? "pause" : "start";
    setActionLoading(campaign.id);
    try {
      const res = await fetch(`/api/dashboard/campaigns/${campaign.id}/${action}`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${action}`);
      }
      await fetchCampaigns();
      if (expandedId === campaign.id) {
        const detailRes = await fetch(`/api/dashboard/campaigns/${campaign.id}`);
        if (detailRes.ok) setExpandedDetail(await detailRes.json());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action}`);
    } finally {
      setActionLoading(null);
    }
  }

  function toggleChannel(channel: string) {
    setForm((f) => {
      const has = f.channels.includes(channel);
      const channels = has
        ? f.channels.filter((c) => c !== channel)
        : [...f.channels, channel];
      const channelPriority = f.channelPriority.filter((c) => channels.includes(c));
      const newChannels = channels.filter((c) => !channelPriority.includes(c));
      return { ...f, channels, channelPriority: [...channelPriority, ...newChannels] };
    });
  }

  function movePriority(channel: string, direction: "up" | "down") {
    setForm((f) => {
      const arr = [...f.channelPriority];
      const idx = arr.indexOf(channel);
      if (idx === -1) return f;
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= arr.length) return f;
      [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
      return { ...f, channelPriority: arr };
    });
  }

  async function generateEmailPreview(campaign: Campaign) {
    setEmailGenLoading(true);
    setEmailPreview(null);
    try {
      const res = await fetch("/api/dashboard/email/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadName: "",
          companyName: "",
          scriptId: campaign.scriptId,
          type: emailType,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate");
      const data = await res.json();
      setEmailPreview({ subject: data.subject, body: data.body });
    } catch {
      setError(t ? "Не вдалося згенерувати email" : "Failed to generate email");
    } finally {
      setEmailGenLoading(false);
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(t ? "uk-UA" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div>
      <PageHeader
        title={t ? "Кампанії" : "Campaigns"}
        description={
          t
            ? "Керуйте кампаніями мультиканального аутрічу."
            : "Manage your multi-channel outreach campaigns."
        }
        action={
          campaigns.length > 0 ? (
            <GlassButton
              onClick={openCreate}
              className="glass-button-primary"
              size="sm"
            >
              <span className="flex items-center gap-2">
                <Plus size={16} />
                {t ? "Створити кампанію" : "Create Campaign"}
              </span>
            </GlassButton>
          ) : undefined
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-white/30" />
        </div>
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title={t ? "Кампаній ще немає" : "No campaigns yet"}
          description={
            t
              ? "Створіть свою першу кампанію для мультиканального аутрічу."
              : "Create your first campaign to start multi-channel outreach."
          }
          actionLabel={t ? "Створити кампанію" : "Create Campaign"}
          onAction={openCreate}
        />
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign) => {
            const isExpanded = expandedId === campaign.id;
            const channels = Array.isArray(campaign.channels) ? campaign.channels : [];

            return (
              <div
                key={campaign.id}
                className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] hover:border-white/12 transition-colors"
              >
                {/* Card header */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleExpand(campaign.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#0090f0]/10 border border-[#0090f0]/20 shrink-0">
                          <Megaphone size={16} className="text-[#0090f0]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="text-base font-semibold text-white font-display truncate">
                              {campaign.name}
                            </h4>
                            <span
                              className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColors[campaign.status]}`}
                            >
                              {statusLabels[campaign.status][lang]}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-1">
                            {/* Channel icons */}
                            <div className="flex items-center gap-1.5">
                              {channels.map((ch) => {
                                const Icon = channelIcons[ch];
                                return Icon ? (
                                  <div
                                    key={ch}
                                    className="w-6 h-6 rounded-md flex items-center justify-center bg-white/[0.04] border border-white/8"
                                    title={channelLabels[ch]?.[lang] || ch}
                                  >
                                    <Icon size={12} className="text-white/40" />
                                  </div>
                                ) : null;
                              })}
                            </div>
                            <span className="text-xs text-white/30 flex items-center gap-1">
                              <Users size={12} />
                              {campaign.leadCount} {t ? "лідів" : "leads"}
                            </span>
                            <span className="text-xs text-white/25">
                              {formatDate(campaign.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 shrink-0">
                      {/* Start / Pause button */}
                      {(campaign.status === "draft" || campaign.status === "paused") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartPause(campaign);
                          }}
                          disabled={actionLoading === campaign.id}
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                          title={t ? "Запустити" : "Start"}
                        >
                          {actionLoading === campaign.id ? (
                            <Loader2 size={14} className="animate-spin text-emerald-400" />
                          ) : (
                            <Play size={14} className="text-emerald-400" />
                          )}
                        </button>
                      )}
                      {campaign.status === "active" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartPause(campaign);
                          }}
                          disabled={actionLoading === campaign.id}
                          className="w-8 h-8 rounded-lg flex items-center justify-center bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors disabled:opacity-50"
                          title={t ? "Пауза" : "Pause"}
                        >
                          {actionLoading === campaign.id ? (
                            <Loader2 size={14} className="animate-spin text-yellow-400" />
                          ) : (
                            <Pause size={14} className="text-yellow-400" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEdit(campaign);
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/8 hover:bg-white/[0.06] transition-colors"
                        title={t ? "Редагувати" : "Edit"}
                      >
                        <Pencil size={14} className="text-white/50" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm(campaign.id);
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/8 hover:bg-red-500/10 hover:border-red-500/20 transition-colors"
                        title={t ? "Видалити" : "Delete"}
                      >
                        <Trash2 size={14} className="text-white/50" />
                      </button>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                        {isExpanded ? (
                          <ChevronUp size={14} className="text-white/30" />
                        ) : (
                          <ChevronDown size={14} className="text-white/30" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-white/5">
                    {expandLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 size={20} className="animate-spin text-white/30" />
                      </div>
                    ) : expandedDetail ? (
                      <div className="pt-5">
                        {/* Stats grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                          <StatMini
                            label={t ? "Всього лідів" : "Total Leads"}
                            value={expandedDetail.stats.total}
                          />
                          <StatMini
                            label={t ? "Контактовано" : "Contacted"}
                            value={expandedDetail.stats.contacted}
                            color="text-blue-400"
                          />
                          <StatMini
                            label={t ? "Кваліфіковано" : "Qualified"}
                            value={expandedDetail.stats.qualified}
                            color="text-emerald-400"
                          />
                          <StatMini
                            label={t ? "Конвертовано" : "Converted"}
                            value={expandedDetail.stats.converted}
                            color="text-[#0090f0]"
                          />
                        </div>

                        {/* Channel priority */}
                        <div className="mb-4">
                          <p className="text-xs text-white/30 mb-2">
                            {t ? "Пріоритет каналів" : "Channel Priority"}
                          </p>
                          <div className="flex items-center gap-2">
                            {(Array.isArray(expandedDetail.channelPriority)
                              ? expandedDetail.channelPriority
                              : []
                            ).map((ch, i) => {
                              const Icon = channelIcons[ch];
                              return (
                                <div key={ch} className="flex items-center gap-1.5">
                                  {i > 0 && (
                                    <span className="text-white/15 text-xs">→</span>
                                  )}
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/8">
                                    {Icon && <Icon size={12} className="text-white/40" />}
                                    <span className="text-xs text-white/50">
                                      {channelLabels[ch]?.[lang] || ch}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Scheduled at */}
                        {expandedDetail.scheduledAt && (
                          <div className="flex items-center gap-2 text-xs text-white/30 mb-4">
                            <Calendar size={12} />
                            {t ? "Заплановано:" : "Scheduled:"}{" "}
                            {new Date(expandedDetail.scheduledAt).toLocaleString(
                              t ? "uk-UA" : "en-US"
                            )}
                          </div>
                        )}

                        {/* Email Preview — only show when email channel is enabled */}
                        {channels.includes("email") && (
                          <div className="mt-4 pt-4 border-t border-white/5">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Mail size={14} className="text-[#0090f0]" />
                                <p className="text-sm font-medium text-white/60">
                                  {t ? "Email шаблон" : "Email Template"}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <select
                                  value={emailType}
                                  onChange={(e) =>
                                    setEmailType(
                                      e.target.value as "initial" | "followup" | "final"
                                    )
                                  }
                                  className="px-3 py-1.5 rounded-lg border border-white/8 bg-white/[0.03] text-white/60 text-xs focus:outline-none focus:border-[#0090f0]/40 transition-colors appearance-none"
                                >
                                  <option value="initial" className="bg-[#0e0e15]">
                                    {t ? "Перший лист" : "Initial"}
                                  </option>
                                  <option value="followup" className="bg-[#0e0e15]">
                                    {t ? "Follow-up" : "Follow-up"}
                                  </option>
                                  <option value="final" className="bg-[#0e0e15]">
                                    {t ? "Фiнальний" : "Final"}
                                  </option>
                                </select>
                                <GlassButton
                                  size="sm"
                                  onClick={() => generateEmailPreview(campaign)}
                                  disabled={emailGenLoading}
                                >
                                  {emailGenLoading ? (
                                    <span className="flex items-center gap-1.5">
                                      <Loader2 size={12} className="animate-spin" />
                                      {t ? "Генерую..." : "Generating..."}
                                    </span>
                                  ) : emailPreview ? (
                                    <span className="flex items-center gap-1.5">
                                      <RefreshCw size={12} />
                                      {t ? "Перегенерувати" : "Regenerate"}
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1.5">
                                      <Sparkles size={12} />
                                      {t ? "Згенерувати" : "Generate"}
                                    </span>
                                  )}
                                </GlassButton>
                              </div>
                            </div>

                            {emailPreview && (
                              <div className="rounded-xl border border-white/8 bg-white/[0.02] overflow-hidden">
                                {/* Email subject */}
                                <div className="px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-white/30 shrink-0">
                                      {t ? "Тема:" : "Subject:"}
                                    </span>
                                    <span className="text-sm text-white/80 font-medium truncate">
                                      {emailPreview.subject}
                                    </span>
                                  </div>
                                </div>
                                {/* Email body */}
                                <div className="px-4 py-4">
                                  <p className="text-sm text-white/50 whitespace-pre-wrap leading-relaxed">
                                    {emailPreview.body}
                                  </p>
                                </div>
                                {/* Actions */}
                                <div className="px-4 py-3 border-t border-white/5 flex items-center justify-end">
                                  <button
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#0090f0]/10 border border-[#0090f0]/20 text-[#0090f0] hover:bg-[#0090f0]/20 transition-colors"
                                    onClick={() => {
                                      navigator.clipboard.writeText(
                                        `Subject: ${emailPreview.subject}\n\n${emailPreview.body}`
                                      );
                                    }}
                                  >
                                    <Send size={11} />
                                    {t ? "Копiювати" : "Copy"}
                                  </button>
                                </div>
                              </div>
                            )}

                            {!emailPreview && !emailGenLoading && (
                              <div className="rounded-xl border border-dashed border-white/8 bg-white/[0.01] p-6 text-center">
                                <Sparkles size={20} className="text-white/15 mx-auto mb-2" />
                                <p className="text-xs text-white/25">
                                  {t
                                    ? "Натиснiть \"Згенерувати\" для створення AI-персоналiзованого email"
                                    : "Click \"Generate\" to create an AI-personalized email template"}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteConfirm(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.98)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-white mb-2 font-display">
              {t ? "Видалити кампанію?" : "Delete campaign?"}
            </h3>
            <p className="text-sm text-white/40 mb-6">
              {t
                ? "Цю дію не можна скасувати. Кампанію буде видалено назавжди."
                : "This action cannot be undone. The campaign will be permanently deleted."}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
              >
                {t ? "Скасувати" : "Cancel"}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 text-sm font-medium rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
              >
                {t ? "Видалити" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setModalOpen(false);
            setError(null);
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.98)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white font-display">
                {editingId
                  ? t
                    ? "Редагувати кампанію"
                    : "Edit Campaign"
                  : t
                    ? "Створити кампанію"
                    : "Create Campaign"}
              </h3>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setError(null);
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors"
              >
                <X size={16} className="text-white/50" />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* Campaign Name */}
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">
                  {t ? "Назва кампанії" : "Campaign Name"}
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder={
                    t ? "напр. Зимова акція 2026" : "e.g. Winter Outreach 2026"
                  }
                  className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors"
                />
              </div>

              {/* Select Script */}
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">
                  {t ? "Скрипт" : "Script"}
                </label>
                <select
                  value={form.scriptId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, scriptId: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors appearance-none"
                >
                  <option value="" className="bg-[#0e0e15]">
                    {t ? "Оберіть скрипт..." : "Select script..."}
                  </option>
                  {scripts.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#0e0e15]">
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Channel Selection */}
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">
                  {t ? "Канали" : "Channels"}
                </label>
                <div className="flex flex-wrap gap-3">
                  {(["voice", "telegram", "email"] as const).map((ch) => {
                    const Icon = channelIcons[ch];
                    const selected = form.channels.includes(ch);
                    return (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => toggleChannel(ch)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          selected
                            ? "border-[#0090f0]/40 bg-[#0090f0]/10 text-white"
                            : "border-white/8 bg-white/[0.02] text-white/40 hover:border-white/15"
                        }`}
                      >
                        <Icon size={16} />
                        {channelLabels[ch][lang]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Channel Priority */}
              {form.channels.length > 1 && (
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2">
                    {t ? "Пріоритет каналів" : "Channel Priority"}
                  </label>
                  <p className="text-xs text-white/25 mb-3">
                    {t
                      ? "Перший канал буде використано першим. Використовуйте стрілки для зміни порядку."
                      : "First channel will be tried first. Use arrows to reorder."}
                  </p>
                  <div className="space-y-2">
                    {form.channelPriority.map((ch, i) => {
                      const Icon = channelIcons[ch];
                      return (
                        <div
                          key={ch}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/8 bg-white/[0.02]"
                        >
                          <GripVertical size={14} className="text-white/20" />
                          <span className="text-xs font-medium text-white/25 w-5">
                            {i + 1}.
                          </span>
                          {Icon && <Icon size={14} className="text-white/40" />}
                          <span className="text-sm text-white/60 flex-1">
                            {channelLabels[ch]?.[lang] || ch}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => movePriority(ch, "up")}
                              disabled={i === 0}
                              className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/[0.06] disabled:opacity-20 transition-colors"
                            >
                              <ChevronUp size={12} className="text-white/40" />
                            </button>
                            <button
                              type="button"
                              onClick={() => movePriority(ch, "down")}
                              disabled={i === form.channelPriority.length - 1}
                              className="w-6 h-6 rounded flex items-center justify-center hover:bg-white/[0.06] disabled:opacity-20 transition-colors"
                            >
                              <ChevronDown size={12} className="text-white/40" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Schedule */}
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">
                  {t ? "Запланувати (необов'язково)" : "Schedule (optional)"}
                </label>
                <input
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, scheduledAt: e.target.value }))
                  }
                  className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors [color-scheme:dark]"
                />
                <p className="text-xs text-white/20 mt-1.5">
                  {t
                    ? "Залиште порожнім для запуску вручну."
                    : "Leave empty to start manually."}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-white/8">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setError(null);
                }}
                className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
              >
                {t ? "Скасувати" : "Cancel"}
              </button>
              <GlassButton
                onClick={handleSave}
                className="glass-button-primary"
                size="sm"
                disabled={saving}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    {t ? "Збереження..." : "Saving..."}
                  </span>
                ) : editingId ? (
                  t ? "Зберегти зміни" : "Save Changes"
                ) : (
                  t ? "Створити кампанію" : "Create Campaign"
                )}
              </GlassButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Mini stat component for the expanded view */
function StatMini({
  label,
  value,
  color = "text-white",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className={`text-lg font-bold font-display ${color}`}>{value}</div>
      <div className="text-xs text-white/30 mt-0.5">{label}</div>
    </div>
  );
}
