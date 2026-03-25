"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { GlassButton } from "@/components/ui/glass-button";
import {
  Megaphone, Plus, Loader2, X, Phone, MessageCircle, Mail,
  Play, Pause, Pencil, Trash2, Users, ChevronDown, ChevronUp,
  GripVertical, Calendar, Sparkles, Send, RefreshCw,
  Search, CheckCircle2, XCircle, AlertTriangle, Zap, UserPlus,
} from "lucide-react";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";
import { toast } from "sonner";

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

interface Lead {
  id: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  telegramUsername: string | null;
  company: string | null;
  status: string;
  campaignId: string | null;
}

interface LeadResult {
  leadId: string;
  leadName: string;
  channel: string;
  status: "sent" | "failed" | "skipped";
  error?: string;
}

interface ExecutionProgress {
  campaignId: string;
  total: number;
  processed: number;
  succeeded: number;
  failed: number;
  results: LeadResult[];
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

  // Lead assignment state
  const [leadsModalOpen, setLeadsModalOpen] = useState(false);
  const [leadsModalCampaignId, setLeadsModalCampaignId] = useState<string | null>(null);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsSearch, setLeadsSearch] = useState("");
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [assigningLeads, setAssigningLeads] = useState(false);

  // Campaign leads in expanded view
  const [campaignLeads, setCampaignLeads] = useState<Lead[]>([]);
  const [campaignLeadsLoading, setCampaignLeadsLoading] = useState(false);

  // Execution state
  const [executing, setExecuting] = useState<string | null>(null);
  const [executionProgress, setExecutionProgress] = useState<ExecutionProgress | null>(null);

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
      toast.success(editingId ? (t ? "Кампанію оновлено" : "Campaign updated") : (t ? "Кампанію створено" : "Campaign created"));
      setEditingId(null);
      await fetchCampaigns();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save";
      setError(msg);
      toast.error(t ? "Не вдалося зберегти кампанію" : msg);
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
      toast.success(t ? "Кампанію видалено" : "Campaign deleted");
      await fetchCampaigns();
    } catch {
      setError(t ? "Не вдалося видалити кампанію" : "Failed to delete campaign");
      toast.error(t ? "Не вдалося видалити кампанію" : "Failed to delete campaign");
    }
  }

  async function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null);
      setExpandedDetail(null);
      setCampaignLeads([]);
      return;
    }
    setExpandedId(id);
    setExpandLoading(true);
    setExecutionProgress(null);
    try {
      const [detailRes, leadsRes] = await Promise.all([
        fetch(`/api/dashboard/campaigns/${id}`),
        fetch(`/api/dashboard/campaigns/${id}/leads`),
      ]);
      if (detailRes.ok) {
        setExpandedDetail(await detailRes.json());
      }
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        setCampaignLeads(leadsData.leads || []);
      }
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
      toast.success(action === "start" ? (t ? "Кампанію запущено" : "Campaign started") : (t ? "Кампанію призупинено" : "Campaign paused"));
      await fetchCampaigns();
      if (expandedId === campaign.id) {
        const detailRes = await fetch(`/api/dashboard/campaigns/${campaign.id}`);
        if (detailRes.ok) setExpandedDetail(await detailRes.json());
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : `Failed to ${action}`;
      setError(msg);
      toast.error(t ? `Не вдалося ${action === "start" ? "запустити" : "призупинити"} кампанію` : msg);
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

  // Lead assignment functions
  async function openLeadsModal(campaignId: string) {
    setLeadsModalCampaignId(campaignId);
    setLeadsModalOpen(true);
    setLeadsSearch("");
    setSelectedLeadIds(new Set());
    setLeadsLoading(true);

    try {
      const res = await fetch("/api/dashboard/leads?limit=100");
      if (!res.ok) throw new Error("Failed to fetch leads");
      const data = await res.json();
      setAllLeads(data.leads || []);
    } catch {
      setError(t ? "Не вдалося завантажити ліди" : "Failed to load leads");
    } finally {
      setLeadsLoading(false);
    }
  }

  function toggleLeadSelection(leadId: string) {
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      if (next.has(leadId)) {
        next.delete(leadId);
      } else {
        next.add(leadId);
      }
      return next;
    });
  }

  function selectAllFilteredLeads() {
    const filtered = getFilteredLeads();
    const allSelected = filtered.every((l) => selectedLeadIds.has(l.id));
    if (allSelected) {
      setSelectedLeadIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((l) => next.delete(l.id));
        return next;
      });
    } else {
      setSelectedLeadIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((l) => next.add(l.id));
        return next;
      });
    }
  }

  function getFilteredLeads() {
    if (!leadsSearch.trim()) return allLeads;
    const q = leadsSearch.toLowerCase();
    return allLeads.filter((l) =>
      [l.firstName, l.lastName, l.email, l.phone, l.company, l.telegramUsername]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q))
    );
  }

  async function handleAssignLeads() {
    if (!leadsModalCampaignId || selectedLeadIds.size === 0) return;

    setAssigningLeads(true);
    try {
      const res = await fetch(`/api/dashboard/campaigns/${leadsModalCampaignId}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds: Array.from(selectedLeadIds) }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to assign leads");
      }

      setLeadsModalOpen(false);
      setSelectedLeadIds(new Set());
      await fetchCampaigns();

      // Refresh expanded view if open
      if (expandedId === leadsModalCampaignId) {
        const [detailRes, leadsRes] = await Promise.all([
          fetch(`/api/dashboard/campaigns/${leadsModalCampaignId}`),
          fetch(`/api/dashboard/campaigns/${leadsModalCampaignId}/leads`),
        ]);
        if (detailRes.ok) setExpandedDetail(await detailRes.json());
        if (leadsRes.ok) {
          const data = await leadsRes.json();
          setCampaignLeads(data.leads || []);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign leads");
    } finally {
      setAssigningLeads(false);
    }
  }

  async function handleRemoveLeadFromCampaign(campaignId: string, leadId: string) {
    try {
      const res = await fetch(`/api/dashboard/campaigns/${campaignId}/leads`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds: [leadId] }),
      });
      if (!res.ok) throw new Error("Failed to remove lead");

      await fetchCampaigns();
      if (expandedId === campaignId) {
        const [detailRes, leadsRes] = await Promise.all([
          fetch(`/api/dashboard/campaigns/${campaignId}`),
          fetch(`/api/dashboard/campaigns/${campaignId}/leads`),
        ]);
        if (detailRes.ok) setExpandedDetail(await detailRes.json());
        if (leadsRes.ok) {
          const data = await leadsRes.json();
          setCampaignLeads(data.leads || []);
        }
      }
    } catch {
      setError(t ? "Не вдалося видалити лід" : "Failed to remove lead");
    }
  }

  // Execute campaign
  async function handleExecuteCampaign(campaignId: string) {
    setExecuting(campaignId);
    setExecutionProgress(null);
    setError(null);

    try {
      const res = await fetch(`/api/dashboard/campaigns/${campaignId}/execute`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to execute campaign");
      }

      setExecutionProgress(data.progress);
      toast.success(t ? "Кампанію виконано" : "Campaign executed");
      await fetchCampaigns();

      // Refresh expanded view
      if (expandedId === campaignId) {
        const [detailRes, leadsRes] = await Promise.all([
          fetch(`/api/dashboard/campaigns/${campaignId}`),
          fetch(`/api/dashboard/campaigns/${campaignId}/leads`),
        ]);
        if (detailRes.ok) setExpandedDetail(await detailRes.json());
        if (leadsRes.ok) {
          const leadsData = await leadsRes.json();
          setCampaignLeads(leadsData.leads || []);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Execution failed";
      setError(msg);
      toast.error(t ? "Не вдалося виконати кампанію" : msg);
    } finally {
      setExecuting(null);
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

  function getLeadDisplayName(lead: Lead) {
    const name = [lead.firstName, lead.lastName].filter(Boolean).join(" ");
    return name || lead.email || lead.phone || lead.telegramUsername || "Unknown";
  }

  const filteredLeads = getFilteredLeads();

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
                className="rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.95)] hover:border-white/12 transition-colors"
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
                                    <span className="text-white/15 text-xs">&rarr;</span>
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

                        {/* Assigned Leads Section */}
                        <div className="mt-4 pt-4 border-t border-white/5">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Users size={14} className="text-emerald-400" />
                              <p className="text-sm font-medium text-white/60">
                                {t ? "Призначені ліди" : "Assigned Leads"}
                                <span className="ml-2 text-white/30">({campaignLeads.length})</span>
                              </p>
                            </div>
                            <GlassButton
                              size="sm"
                              onClick={() => openLeadsModal(campaign.id)}
                            >
                              <span className="flex items-center gap-1.5">
                                <UserPlus size={12} />
                                {t ? "Додати лідів" : "Assign Leads"}
                              </span>
                            </GlassButton>
                          </div>

                          {campaignLeads.length > 0 ? (
                            <div className="space-y-1.5 max-h-48 overflow-y-auto mb-4">
                              {campaignLeads.map((lead) => (
                                <div
                                  key={lead.id}
                                  className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-7 h-7 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center shrink-0">
                                      <Users size={12} className="text-emerald-400" />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm text-white/70 truncate">
                                        {getLeadDisplayName(lead)}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        {lead.phone && (
                                          <span className="text-[10px] text-white/25 flex items-center gap-0.5">
                                            <Phone size={8} /> {lead.phone}
                                          </span>
                                        )}
                                        {lead.email && (
                                          <span className="text-[10px] text-white/25 flex items-center gap-0.5">
                                            <Mail size={8} /> {lead.email}
                                          </span>
                                        )}
                                        {lead.telegramUsername && (
                                          <span className="text-[10px] text-white/25 flex items-center gap-0.5">
                                            <MessageCircle size={8} /> @{lead.telegramUsername}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span
                                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${
                                        lead.status === "contacted"
                                          ? "text-blue-400 bg-blue-400/10 border-blue-400/20"
                                          : lead.status === "converted"
                                          ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                                          : "text-white/40 bg-white/5 border-white/10"
                                      }`}
                                    >
                                      {lead.status}
                                    </span>
                                    {campaign.status !== "active" && campaign.status !== "completed" && (
                                      <button
                                        onClick={() => handleRemoveLeadFromCampaign(campaign.id, lead.id)}
                                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-500/10 transition-colors"
                                        title={t ? "Видалити" : "Remove"}
                                      >
                                        <X size={12} className="text-white/30 hover:text-red-400" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="rounded-xl border border-dashed border-white/8 bg-white/[0.01] p-6 text-center mb-4">
                              <Users size={20} className="text-white/15 mx-auto mb-2" />
                              <p className="text-xs text-white/25">
                                {t
                                  ? "Додайте лідів до кампанії для запуску"
                                  : "Assign leads to this campaign to get started"}
                              </p>
                            </div>
                          )}

                          {/* Execute Campaign Button */}
                          {campaign.status !== "completed" && campaignLeads.length > 0 && (
                            <div className="mb-4">
                              <GlassButton
                                className="glass-button-primary w-full"
                                size="sm"
                                onClick={() => handleExecuteCampaign(campaign.id)}
                                disabled={executing === campaign.id || campaign.status === "active"}
                              >
                                {executing === campaign.id ? (
                                  <span className="flex items-center gap-2 justify-center">
                                    <Loader2 size={14} className="animate-spin" />
                                    {t
                                      ? "Виконання кампанії..."
                                      : "Executing campaign..."}
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-2 justify-center">
                                    <Zap size={14} />
                                    {t
                                      ? `Запустити кампанію (${campaignLeads.length} лідів)`
                                      : `Execute Campaign (${campaignLeads.length} leads)`}
                                  </span>
                                )}
                              </GlassButton>
                            </div>
                          )}

                          {/* Execution Progress */}
                          {executionProgress && executionProgress.campaignId === campaign.id && (
                            <div className="mb-4">
                              {/* Progress bar */}
                              <div className="mb-3">
                                <div className="flex items-center justify-between text-xs text-white/40 mb-1.5">
                                  <span>
                                    {t ? "Прогрес" : "Progress"}: {executionProgress.processed}/{executionProgress.total}
                                  </span>
                                  <span>
                                    <span className="text-emerald-400">{executionProgress.succeeded}</span>
                                    {" / "}
                                    <span className="text-red-400">{executionProgress.failed}</span>
                                  </span>
                                </div>
                                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-[#0090f0] to-emerald-400 transition-all duration-500"
                                    style={{
                                      width: `${(executionProgress.processed / executionProgress.total) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>

                              {/* Per-lead results */}
                              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                {executionProgress.results.map((result, idx) => (
                                  <div
                                    key={idx}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs ${
                                      result.status === "sent"
                                        ? "bg-emerald-400/5 border border-emerald-400/10"
                                        : result.status === "failed"
                                        ? "bg-red-400/5 border border-red-400/10"
                                        : "bg-yellow-400/5 border border-yellow-400/10"
                                    }`}
                                  >
                                    {result.status === "sent" ? (
                                      <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                                    ) : result.status === "failed" ? (
                                      <XCircle size={12} className="text-red-400 shrink-0" />
                                    ) : (
                                      <AlertTriangle size={12} className="text-yellow-400 shrink-0" />
                                    )}
                                    <span className="text-white/60 truncate flex-1">
                                      {result.leadName}
                                    </span>
                                    {result.channel !== "none" && (
                                      <span className="text-white/30 shrink-0">
                                        via {channelLabels[result.channel]?.[lang] || result.channel}
                                      </span>
                                    )}
                                    {result.error && (
                                      <span className="text-red-400/60 truncate max-w-[150px]" title={result.error}>
                                        {result.error}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

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
            className="relative w-full max-w-md rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.98)] p-6"
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
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.98)] p-6"
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

      {/* Lead Assignment Modal */}
      {leadsModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setLeadsModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.98)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-4 border-b border-white/5">
              <div>
                <h3 className="text-lg font-semibold text-white font-display">
                  {t ? "Обрати лідів" : "Select Leads"}
                </h3>
                <p className="text-xs text-white/30 mt-1">
                  {t
                    ? `Обрано: ${selectedLeadIds.size}`
                    : `Selected: ${selectedLeadIds.size}`}
                </p>
              </div>
              <button
                onClick={() => setLeadsModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors"
              >
                <X size={16} className="text-white/50" />
              </button>
            </div>

            {/* Search bar */}
            <div className="px-6 py-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="text"
                  value={leadsSearch}
                  onChange={(e) => setLeadsSearch(e.target.value)}
                  placeholder={t ? "Пошук лідів..." : "Search leads..."}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/8 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors"
                />
              </div>
            </div>

            {/* Select all */}
            <div className="px-6 py-1">
              <button
                onClick={selectAllFilteredLeads}
                className="text-xs text-[#0090f0] hover:text-[#0090f0]/80 transition-colors"
              >
                {filteredLeads.every((l) => selectedLeadIds.has(l.id))
                  ? t ? "Зняти вибір" : "Deselect All"
                  : t ? "Обрати всі" : "Select All"}
              </button>
            </div>

            {/* Leads list */}
            <div className="flex-1 overflow-y-auto px-6 py-2 min-h-0">
              {leadsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={20} className="animate-spin text-white/30" />
                </div>
              ) : filteredLeads.length === 0 ? (
                <div className="text-center py-12">
                  <Users size={24} className="text-white/15 mx-auto mb-2" />
                  <p className="text-sm text-white/30">
                    {t ? "Лідів не знайдено" : "No leads found"}
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredLeads.map((lead) => {
                    const isSelected = selectedLeadIds.has(lead.id);
                    const isAssigned = lead.campaignId === leadsModalCampaignId;
                    return (
                      <button
                        key={lead.id}
                        onClick={() => !isAssigned && toggleLeadSelection(lead.id)}
                        disabled={isAssigned}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all ${
                          isAssigned
                            ? "border-emerald-400/20 bg-emerald-400/5 opacity-60 cursor-default"
                            : isSelected
                            ? "border-[#0090f0]/30 bg-[#0090f0]/5"
                            : "border-white/5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10"
                        }`}
                      >
                        {/* Checkbox */}
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                            isAssigned
                              ? "border-emerald-400/40 bg-emerald-400/20"
                              : isSelected
                              ? "border-[#0090f0]/60 bg-[#0090f0]/20"
                              : "border-white/15 bg-white/[0.03]"
                          }`}
                        >
                          {(isSelected || isAssigned) && (
                            <CheckCircle2 size={12} className={isAssigned ? "text-emerald-400" : "text-[#0090f0]"} />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-white/70 truncate">
                              {getLeadDisplayName(lead)}
                            </p>
                            {isAssigned && (
                              <span className="text-[10px] text-emerald-400/70 shrink-0">
                                {t ? "вже додано" : "already assigned"}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5">
                            {lead.company && (
                              <span className="text-[10px] text-white/25">{lead.company}</span>
                            )}
                            {lead.phone && (
                              <span className="text-[10px] text-white/20 flex items-center gap-0.5">
                                <Phone size={8} /> {lead.phone}
                              </span>
                            )}
                            {lead.email && (
                              <span className="text-[10px] text-white/20 flex items-center gap-0.5">
                                <Mail size={8} /> {lead.email}
                              </span>
                            )}
                            {lead.telegramUsername && (
                              <span className="text-[10px] text-white/20 flex items-center gap-0.5">
                                <MessageCircle size={8} /> @{lead.telegramUsername}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 pt-4 border-t border-white/5">
              <p className="text-xs text-white/30">
                {t
                  ? `${filteredLeads.length} лідів знайдено`
                  : `${filteredLeads.length} leads found`}
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setLeadsModalOpen(false)}
                  className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
                >
                  {t ? "Скасувати" : "Cancel"}
                </button>
                <GlassButton
                  className="glass-button-primary"
                  size="sm"
                  onClick={handleAssignLeads}
                  disabled={selectedLeadIds.size === 0 || assigningLeads}
                >
                  {assigningLeads ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      {t ? "Додаю..." : "Assigning..."}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserPlus size={14} />
                      {t
                        ? `Додати ${selectedLeadIds.size} лідів`
                        : `Assign ${selectedLeadIds.size} Leads`}
                    </span>
                  )}
                </GlassButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error toast */}
      {error && !modalOpen && !leadsModalOpen && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
            <button onClick={() => setError(null)} className="shrink-0">
              <X size={14} className="text-red-400/60 hover:text-red-400" />
            </button>
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
