"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { GlassButton } from "@/components/ui/glass-button";
import {
  Users,
  Plus,
  Loader2,
  Search,
  Upload,
  X,
  Trash2,
  Pencil,
  Filter,
} from "lucide-react";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";
import { toast } from "sonner";

interface Lead {
  id: string;
  orgId: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  email: string | null;
  telegramUsername: string | null;
  company: string | null;
  status: string;
  timezone: string | null;
  createdAt: string;
}

interface LeadForm {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  telegramUsername: string;
  company: string;
}

const emptyForm: LeadForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  telegramUsername: "",
  company: "",
};

const STATUSES = ["all", "new", "contacted", "qualified", "converted", "rejected"] as const;

function StatusBadge({ status, isUa }: { status: string; isUa: boolean }) {
  const config: Record<string, { bg: string; text: string; label: string; labelUa: string }> = {
    new: { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-400", label: "New", labelUa: "Новий" },
    contacted: { bg: "bg-orange-500/10 border-orange-500/20", text: "text-orange-400", label: "Contacted", labelUa: "Контактований" },
    qualified: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-400", label: "Qualified", labelUa: "Кваліфікований" },
    converted: { bg: "bg-purple-500/10 border-purple-500/20", text: "text-purple-400", label: "Converted", labelUa: "Конвертований" },
    rejected: { bg: "bg-red-500/10 border-red-500/20", text: "text-red-400", label: "Rejected", labelUa: "Відхилений" },
  };

  const c = config[status] || config.new;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${c.bg} ${c.text}`}>
      {isUa ? c.labelUa : c.label}
    </span>
  );
}

function statusLabel(s: string, isUa: boolean): string {
  const labels: Record<string, { en: string; ua: string }> = {
    all: { en: "All", ua: "Всі" },
    new: { en: "New", ua: "Новий" },
    contacted: { en: "Contacted", ua: "Контактований" },
    qualified: { en: "Qualified", ua: "Кваліфікований" },
    converted: { en: "Converted", ua: "Конвертований" },
    rejected: { en: "Rejected", ua: "Відхилений" },
  };
  return isUa ? labels[s]?.ua || s : labels[s]?.en || s;
}

export default function LeadsPage() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<LeadForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // CSV Import
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; skipped: number } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search debounce
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: "25",
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await fetch(`/api/dashboard/leads?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setLeads(data.leads);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch {
      setError(t ? "Не вдалося завантажити лідів" : "Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, statusFilter, t]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
    setError(null);
  }

  function openEdit(lead: Lead) {
    setEditingId(lead.id);
    setForm({
      firstName: lead.firstName || "",
      lastName: lead.lastName || "",
      phone: lead.phone || "",
      email: lead.email || "",
      telegramUsername: lead.telegramUsername || "",
      company: lead.company || "",
    });
    setModalOpen(true);
    setError(null);
  }

  async function handleSave() {
    if (!form.firstName && !form.lastName && !form.phone && !form.email && !form.telegramUsername) {
      setError(t ? "Потрібне хоча б одне контактне поле" : "At least one contact field is required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const url = editingId
        ? `/api/dashboard/leads/${editingId}`
        : "/api/dashboard/leads";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      setModalOpen(false);
      setForm(emptyForm);
      toast.success(editingId ? (t ? "Лід оновлено" : "Lead updated") : (t ? "Лід створено" : "Lead created"));
      setEditingId(null);
      await fetchLeads();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save";
      setError(msg);
      toast.error(t ? "Не вдалося зберегти лід" : msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/dashboard/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setDeleteConfirm(null);
      toast.success(t ? "Лід видалено" : "Lead deleted");
      await fetchLeads();
    } catch {
      setError(t ? "Не вдалося видалити лід" : "Failed to delete lead");
      toast.error(t ? "Не вдалося видалити лід" : "Failed to delete lead");
    }
  }

  async function handleImport(file: File) {
    setImporting(true);
    setError(null);
    setImportResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/dashboard/leads/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed");

      setImportResult({ imported: data.imported, skipped: data.skipped });
      toast.success(t ? `Імпортовано ${data.imported} лідів` : `Imported ${data.imported} leads`);
      await fetchLeads();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Import failed";
      setError(msg);
      toast.error(t ? "Не вдалося імпортувати CSV" : msg);
    } finally {
      setImporting(false);
    }
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImport(file);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleImport(file);
    e.target.value = "";
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
        title={t ? "Ліди" : "Leads"}
        description={
          t
            ? "Керуйте списками контактів та відстежуйте статус лідів."
            : "Manage your contact lists and track lead status."
        }
        action={
          leads.length > 0 || debouncedSearch || statusFilter !== "all" ? (
            <div className="flex items-center gap-3">
              <GlassButton
                onClick={() => {
                  setImportModalOpen(true);
                  setImportResult(null);
                  setError(null);
                }}
                size="sm"
              >
                <span className="flex items-center gap-2">
                  <Upload size={16} />
                  {t ? "Імпорт CSV" : "Import CSV"}
                </span>
              </GlassButton>
              <GlassButton
                onClick={openCreate}
                className="glass-button-primary"
                size="sm"
              >
                <span className="flex items-center gap-2">
                  <Plus size={16} />
                  {t ? "Додати лід" : "Add Lead"}
                </span>
              </GlassButton>
            </div>
          ) : undefined
        }
      />

      {/* Search & Filters */}
      {(leads.length > 0 || debouncedSearch || statusFilter !== "all" || total > 0) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 w-full sm:max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t ? "Пошук лідів..." : "Search leads..."}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/8 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-white/25" />
            <div className="flex items-center gap-1 flex-wrap">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setStatusFilter(s);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    statusFilter === s
                      ? "border-[#0090f0]/30 bg-[#0090f0]/10 text-[#0090f0]"
                      : "border-white/8 bg-white/[0.03] text-white/40 hover:text-white/60 hover:border-white/12"
                  }`}
                >
                  {statusLabel(s, t)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-white/30" />
        </div>
      ) : leads.length === 0 && !debouncedSearch && statusFilter === "all" ? (
        <EmptyState
          icon={Users}
          title={t ? "Лідів ще немає" : "No leads imported"}
          description={
            t
              ? "Завантажте CSV-файл з контактами, щоб почати."
              : "Upload a CSV file with your contacts to get started."
          }
          actionLabel={t ? "Імпорт CSV" : "Import CSV"}
          onAction={() => {
            setImportModalOpen(true);
            setImportResult(null);
            setError(null);
          }}
        />
      ) : leads.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-white/40">
            {t ? "Лідів не знайдено за вашим запитом" : "No leads found matching your search"}
          </p>
        </div>
      ) : (
        <>
          {/* Table header */}
          <div className="hidden lg:grid grid-cols-[1fr_1fr_140px_180px_140px_120px_80px_60px] gap-4 px-6 py-3 text-xs font-medium text-white/30 uppercase tracking-wider">
            <div>{t ? "Ім'я" : "Name"}</div>
            <div>{t ? "Телефон" : "Phone"}</div>
            <div>Email</div>
            <div>Telegram</div>
            <div>{t ? "Компанія" : "Company"}</div>
            <div>{t ? "Статус" : "Status"}</div>
            <div>{t ? "Дата" : "Date"}</div>
            <div></div>
          </div>

          {/* Rows */}
          <div className="space-y-2">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="group rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.95)] px-6 py-4 hover:border-white/12 transition-colors cursor-pointer"
                onClick={() => openEdit(lead)}
              >
                {/* Desktop layout */}
                <div className="hidden lg:grid grid-cols-[1fr_1fr_140px_180px_140px_120px_80px_60px] gap-4 items-center">
                  <div className="text-sm text-white font-medium truncate">
                    {[lead.firstName, lead.lastName].filter(Boolean).join(" ") || (t ? "Без імені" : "No name")}
                  </div>
                  <div className="text-sm text-white/50 truncate font-mono">
                    {lead.phone || "—"}
                  </div>
                  <div className="text-sm text-white/50 truncate">
                    {lead.email || "—"}
                  </div>
                  <div className="text-sm text-white/50 truncate">
                    {lead.telegramUsername ? `@${lead.telegramUsername.replace(/^@/, "")}` : "—"}
                  </div>
                  <div className="text-sm text-white/40 truncate">
                    {lead.company || "—"}
                  </div>
                  <div>
                    <StatusBadge status={lead.status} isUa={t} />
                  </div>
                  <div className="text-xs text-white/30">
                    {formatDate(lead.createdAt)}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(lead);
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/8 hover:bg-white/[0.06] transition-colors"
                      title={t ? "Редагувати" : "Edit"}
                    >
                      <Pencil size={12} className="text-white/50" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirm(lead.id);
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/8 hover:bg-red-500/10 hover:border-red-500/20 transition-colors"
                      title={t ? "Видалити" : "Delete"}
                    >
                      <Trash2 size={12} className="text-white/50" />
                    </button>
                  </div>
                </div>

                {/* Mobile layout */}
                <div className="lg:hidden space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white font-medium">
                      {[lead.firstName, lead.lastName].filter(Boolean).join(" ") || (t ? "Без імені" : "No name")}
                    </span>
                    <StatusBadge status={lead.status} isUa={t} />
                  </div>
                  <div className="flex items-center gap-4 flex-wrap text-xs text-white/40">
                    {lead.phone && <span className="font-mono">{lead.phone}</span>}
                    {lead.email && <span>{lead.email}</span>}
                    {lead.telegramUsername && (
                      <span>@{lead.telegramUsername.replace(/^@/, "")}</span>
                    )}
                    {lead.company && <span>{lead.company}</span>}
                  </div>
                </div>
              </div>
            ))}
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
              {t ? "Видалити лід?" : "Delete lead?"}
            </h3>
            <p className="text-sm text-white/40 mb-6">
              {t
                ? "Цю дію не можна скасувати. Лід буде видалено назавжди."
                : "This action cannot be undone. The lead will be permanently deleted."}
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

      {/* Create / Edit Lead Modal */}
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
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.98)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white font-display">
                {editingId
                  ? t ? "Редагувати лід" : "Edit Lead"
                  : t ? "Додати лід" : "Add Lead"}
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

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2">
                    {t ? "Ім'я" : "First Name"}
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                    placeholder={t ? "Іван" : "John"}
                    className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2">
                    {t ? "Прізвище" : "Last Name"}
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                    placeholder={t ? "Петренко" : "Doe"}
                    className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">
                  {t ? "Телефон" : "Phone"}
                </label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+380501234567"
                  className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="lead@company.com"
                  className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">
                  Telegram
                </label>
                <input
                  type="text"
                  value={form.telegramUsername}
                  onChange={(e) => setForm((f) => ({ ...f, telegramUsername: e.target.value }))}
                  placeholder="@username"
                  className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">
                  {t ? "Компанія" : "Company"}
                </label>
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  placeholder={t ? "Назва компанії" : "Company name"}
                  className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors"
                />
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
                  t ? "Додати лід" : "Add Lead"
                )}
              </GlassButton>
            </div>
          </div>
        </div>
      )}

      {/* CSV Import Modal */}
      {importModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setImportModalOpen(false);
            setError(null);
            setImportResult(null);
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-lg rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.98)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white font-display">
                {t ? "Імпорт лідів з CSV" : "Import Leads from CSV"}
              </h3>
              <button
                onClick={() => {
                  setImportModalOpen(false);
                  setError(null);
                  setImportResult(null);
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

            {importResult ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 mx-auto mb-4">
                  <Users size={28} className="text-emerald-400" />
                </div>
                <h4 className="text-lg font-semibold text-white mb-2 font-display">
                  {t ? "Імпорт завершено!" : "Import Complete!"}
                </h4>
                <p className="text-sm text-white/50">
                  {t
                    ? `Імпортовано ${importResult.imported} лідів. Пропущено: ${importResult.skipped}.`
                    : `Imported ${importResult.imported} leads. Skipped: ${importResult.skipped}.`}
                </p>
                <div className="mt-6">
                  <GlassButton
                    onClick={() => {
                      setImportModalOpen(false);
                      setImportResult(null);
                    }}
                    className="glass-button-primary"
                    size="sm"
                  >
                    {t ? "Готово" : "Done"}
                  </GlassButton>
                </div>
              </div>
            ) : (
              <>
                {/* Drop zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors ${
                    dragOver
                      ? "border-[#0090f0]/50 bg-[#0090f0]/5"
                      : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                  }`}
                >
                  {importing ? (
                    <div className="flex flex-col items-center">
                      <Loader2 size={32} className="animate-spin text-[#0090f0] mb-4" />
                      <p className="text-sm text-white/50">
                        {t ? "Імпортуємо..." : "Importing..."}
                      </p>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} className="mx-auto text-white/20 mb-4" />
                      <p className="text-sm text-white/60 mb-2">
                        {t
                          ? "Перетягніть CSV-файл сюди або натисніть для вибору"
                          : "Drag & drop a CSV file here or click to select"}
                      </p>
                      <p className="text-xs text-white/30">
                        {t
                          ? "Колонки: firstName, lastName, phone, email, telegram, company"
                          : "Columns: firstName, lastName, phone, email, telegram, company"}
                      </p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
