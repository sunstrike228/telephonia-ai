"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { GlassButton } from "@/components/ui/glass-button";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";
import { Key, Plus, Copy, Check, Trash2, X, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface ApiKeyRow {
  id: string;
  name: string;
  prefix: string;
  last4: string;
  createdAt: string;
  lastUsedAt: string | null;
}

export default function ApiKeysPage() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [keyName, setKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/settings/api-keys");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setKeys(data.keys || []);
    } catch {
      toast.error(t ? "Не вдалося завантажити ключi" : "Failed to load API keys");
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  async function handleCreate() {
    if (!keyName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/dashboard/settings/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: keyName.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed");
      }
      const data = await res.json();
      setNewKey(data.key);
      toast.success(t ? "API ключ створено" : "API key created");
      fetchKeys();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast.error(t ? `Помилка: ${message}` : `Error: ${message}`);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/dashboard/settings/api-keys?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success(t ? "Ключ видалено" : "Key deleted");
      setKeys((prev) => prev.filter((k) => k.id !== id));
    } catch {
      toast.error(t ? "Не вдалося видалити ключ" : "Failed to delete key");
    } finally {
      setDeletingId(null);
    }
  }

  function handleCopy() {
    if (!newKey) return;
    navigator.clipboard.writeText(newKey);
    setCopied(true);
    toast.success(t ? "Скопiйовано" : "Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  }

  function closeCreateModal() {
    setCreateModalOpen(false);
    setKeyName("");
    setNewKey(null);
    setCopied(false);
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(t ? "uk-UA" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div>
        <PageHeader
          title={t ? "API ключi" : "API Keys"}
          description={t ? "Керуйте API-ключами для програмного доступу." : "Manage API keys for programmatic access."}
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
        title={t ? "API ключi" : "API Keys"}
        description={t ? "Керуйте API-ключами для програмного доступу." : "Manage API keys for programmatic access."}
        action={
          keys.length > 0 ? (
            <GlassButton size="sm" className="glass-button-primary" onClick={() => setCreateModalOpen(true)}>
              <span className="flex items-center gap-2">
                <Plus size={14} />
                {t ? "Створити ключ" : "Create Key"}
              </span>
            </GlassButton>
          ) : undefined
        }
      />

      {keys.length === 0 ? (
        <EmptyState
          icon={Key}
          title={t ? "Немає API-ключiв" : "No API keys"}
          description={t ? "Створiть API-ключ для iнтеграцii з вашими системами." : "Create an API key to integrate with your systems."}
          actionLabel={t ? "Створити ключ" : "Create Key"}
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-6 py-3 border-b border-white/5 text-xs font-semibold uppercase tracking-wider text-white/25">
            <span>{t ? "Назва" : "Name"}</span>
            <span>{t ? "Ключ" : "Key"}</span>
            <span>{t ? "Створено" : "Created"}</span>
            <span />
          </div>
          {keys.map((k) => (
            <div
              key={k.id}
              className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-6 py-4 border-b border-white/[0.04] last:border-b-0 items-center"
            >
              <span className="text-sm font-medium text-white truncate">{k.name}</span>
              <span className="text-sm text-white/40 font-mono">
                {k.prefix}...{k.last4}
              </span>
              <span className="text-sm text-white/30 whitespace-nowrap">{formatDate(k.createdAt)}</span>
              <button
                onClick={() => handleDelete(k.id)}
                disabled={deletingId === k.id}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 text-white/25 hover:text-red-400 transition-colors disabled:opacity-50"
              >
                {deletingId === k.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create / Show Key Modal */}
      {createModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={closeCreateModal}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.98)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#0090f0]/10 border border-[#0090f0]/20">
                  <Key size={16} className="text-[#0090f0]" />
                </div>
                <h3 className="text-lg font-semibold text-white font-display">
                  {newKey
                    ? t ? "Ключ створено" : "Key Created"
                    : t ? "Новий API ключ" : "New API Key"}
                </h3>
              </div>
              <button
                onClick={closeCreateModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors"
              >
                <X size={16} className="text-white/50" />
              </button>
            </div>

            {newKey ? (
              <div className="space-y-4">
                {/* Warning */}
                <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 flex items-start gap-3">
                  <AlertTriangle size={16} className="text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-200/80">
                    {t
                      ? "Збережiть цей ключ зараз. Ви бiльше його не побачите."
                      : "Save this key now. You won't be able to see it again."}
                  </p>
                </div>

                {/* Key display */}
                <div className="relative">
                  <div className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white font-mono text-xs break-all pr-12">
                    {newKey}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors"
                  >
                    {copied ? (
                      <Check size={14} className="text-emerald-400" />
                    ) : (
                      <Copy size={14} className="text-white/40" />
                    )}
                  </button>
                </div>

                <div className="flex justify-end pt-2">
                  <GlassButton size="sm" onClick={closeCreateModal}>
                    {t ? "Готово" : "Done"}
                  </GlassButton>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2">
                    {t ? "Назва ключа" : "Key Name"}
                  </label>
                  <input
                    type="text"
                    value={keyName}
                    onChange={(e) => setKeyName(e.target.value)}
                    placeholder={t ? "Наприклад: Production API" : "e.g. Production API"}
                    className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && keyName.trim()) handleCreate();
                    }}
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={closeCreateModal}
                    className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
                  >
                    {t ? "Скасувати" : "Cancel"}
                  </button>
                  <GlassButton
                    size="sm"
                    className="glass-button-primary"
                    onClick={handleCreate}
                    disabled={creating || !keyName.trim()}
                  >
                    {creating ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        {t ? "Створення..." : "Creating..."}
                      </span>
                    ) : (
                      t ? "Створити" : "Create"
                    )}
                  </GlassButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
