"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { GlassButton } from "@/components/ui/glass-button";
import { FileText, Pencil, Trash2, X, Plus, Loader2 } from "lucide-react";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";
import { toast } from "sonner";

interface Script {
  id: string;
  orgId: string;
  name: string;
  content: string;
  objectionHandlers: string[];
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ScriptForm {
  name: string;
  content: string;
  objectionHandlers: string;
}

const emptyForm: ScriptForm = { name: "", content: "", objectionHandlers: "" };

export default function ScriptsPage() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ScriptForm>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchScripts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard/scripts");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setScripts(data);
    } catch {
      setError(t ? "Не вдалося завантажити скрипти" : "Failed to load scripts");
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchScripts();
  }, [fetchScripts]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
    setError(null);
  }

  function openEdit(script: Script) {
    setEditingId(script.id);
    setForm({
      name: script.name,
      content: script.content,
      objectionHandlers: Array.isArray(script.objectionHandlers)
        ? script.objectionHandlers.join("\n")
        : "",
    });
    setModalOpen(true);
    setError(null);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError(t ? "Назва обов'язкова" : "Name is required");
      return;
    }

    setSaving(true);
    setError(null);

    const handlers = form.objectionHandlers
      .split("\n")
      .map((h) => h.trim())
      .filter(Boolean);

    const body = {
      name: form.name.trim(),
      content: form.content,
      objectionHandlers: handlers,
    };

    try {
      const url = editingId
        ? `/api/dashboard/scripts/${editingId}`
        : "/api/dashboard/scripts";
      const method = editingId ? "PUT" : "POST";

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
      toast.success(editingId ? (t ? "Скрипт оновлено" : "Script updated") : (t ? "Скрипт створено" : "Script created"));
      setEditingId(null);
      await fetchScripts();

      // Auto-sync to voice agent after saving a script
      try {
        await fetch("/api/dashboard/voice/sync", { method: "POST" });
      } catch {
        // Sync failure is non-blocking — the script was saved successfully
        console.warn("Auto-sync to voice agent failed");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save";
      setError(msg);
      toast.error(t ? "Не вдалося зберегти скрипт" : msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/dashboard/scripts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setDeleteConfirm(null);
      toast.success(t ? "Скрипт видалено" : "Script deleted");
      await fetchScripts();
    } catch {
      setError(t ? "Не вдалося видалити скрипт" : "Failed to delete script");
      toast.error(t ? "Не вдалося видалити скрипт" : "Failed to delete script");
    }
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString(t ? "uk-UA" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div>
      <PageHeader
        title={t ? "Скрипти" : "Scripts"}
        description={
          t
            ? "Керуйте скриптами продажів та обробниками заперечень."
            : "Manage your sales scripts and objection handlers."
        }
        action={
          scripts.length > 0 ? (
            <GlassButton
              onClick={openCreate}
              className="glass-button-primary"
              size="sm"
            >
              <span className="flex items-center gap-2">
                <Plus size={16} />
                {t ? "Створити скрипт" : "Create Script"}
              </span>
            </GlassButton>
          ) : undefined
        }
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-white/30" />
        </div>
      ) : scripts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={t ? "Скриптів ще немає" : "No scripts yet"}
          description={
            t
              ? "Створіть свій перший скрипт продажів, щоб почати."
              : "Create your first sales script to get started."
          }
          actionLabel={t ? "Створити скрипт" : "Create Script"}
          onAction={openCreate}
        />
      ) : (
        <div className="grid gap-4">
          {scripts.map((script) => (
            <div
              key={script.id}
              className="group rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6 hover:border-white/12 transition-colors cursor-pointer"
              onClick={() => openEdit(script)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#0090f0]/10 border border-[#0090f0]/20 shrink-0">
                      <FileText size={16} className="text-[#0090f0]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base font-semibold text-white font-display truncate">
                        {script.name}
                      </h4>
                      <p className="text-xs text-white/30">
                        {t ? "Оновлено" : "Updated"}{" "}
                        {formatDate(script.updatedAt)}
                      </p>
                    </div>
                  </div>
                  {script.content && (
                    <p className="text-sm text-white/40 mt-3 line-clamp-2 pl-12">
                      {script.content.slice(0, 200)}
                    </p>
                  )}
                  {Array.isArray(script.objectionHandlers) &&
                    script.objectionHandlers.length > 0 && (
                      <p className="text-xs text-white/25 mt-2 pl-12">
                        {script.objectionHandlers.length}{" "}
                        {t ? "обробник(ів) заперечень" : "objection handler(s)"}
                      </p>
                    )}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(script);
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/8 hover:bg-white/[0.06] transition-colors"
                    title={t ? "Редагувати" : "Edit"}
                  >
                    <Pencil size={14} className="text-white/50" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirm(script.id);
                    }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.03] border border-white/8 hover:bg-red-500/10 hover:border-red-500/20 transition-colors"
                    title={t ? "Видалити" : "Delete"}
                  >
                    <Trash2 size={14} className="text-white/50" />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
              {t ? "Видалити скрипт?" : "Delete script?"}
            </h3>
            <p className="text-sm text-white/40 mb-6">
              {t
                ? "Цю дію не можна скасувати. Скрипт буде видалено назавжди."
                : "This action cannot be undone. The script will be permanently deleted."}
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
                    ? "Редагувати скрипт"
                    : "Edit Script"
                  : t
                    ? "Створити скрипт"
                    : "Create Script"}
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
              {/* Script Name */}
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">
                  {t ? "Назва скрипта" : "Script Name"}
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  placeholder={
                    t ? "напр. Холодний дзвінок B2B" : "e.g. B2B Cold Call"
                  }
                  className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors"
                />
              </div>

              {/* Script Content */}
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">
                  {t ? "Скрипт продажу" : "Sales Script"}
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, content: e.target.value }))
                  }
                  placeholder={
                    t
                      ? "Введіть ваш скрипт продажу тут..."
                      : "Enter your sales script here..."
                  }
                  rows={10}
                  className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors resize-y"
                />
              </div>

              {/* Objection Handlers */}
              <div>
                <label className="block text-sm font-medium text-white/50 mb-2">
                  {t
                    ? "Обробники заперечень (по одному на рядок)"
                    : "Objection Handlers (one per line)"}
                </label>
                <textarea
                  value={form.objectionHandlers}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      objectionHandlers: e.target.value,
                    }))
                  }
                  placeholder={
                    t
                      ? "Якщо клієнт каже 'занадто дорого', відповідайте...\nЯкщо клієнт каже 'не цікаво', відповідайте..."
                      : "If client says 'too expensive', respond with...\nIf client says 'not interested', respond with..."
                  }
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors resize-y"
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
                  t ? "Створити скрипт" : "Create Script"
                )}
              </GlassButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
