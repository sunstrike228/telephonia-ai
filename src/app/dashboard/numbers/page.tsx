"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { GlassButton } from "@/components/ui/glass-button";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";
import {
  Phone,
  Plus,
  Loader2,
  Search,
  X,
  Trash2,
  AlertTriangle,
  Check,
  PhoneCall,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";

interface PhoneNumber {
  id: string;
  number: string;
  label: string | null;
  provider: string;
  status: string;
  campaignId: string | null;
  createdAt: string;
}

interface Campaign {
  id: string;
  name: string;
}

interface AvailableNumber {
  phoneNumber: string;
  friendlyName: string;
  locality: string;
  region: string;
  capabilities: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
}

const COUNTRIES = [
  { code: "US", name: "United States", nameUa: "США" },
  { code: "GB", name: "United Kingdom", nameUa: "Великобританiя" },
  { code: "CA", name: "Canada", nameUa: "Канада" },
  { code: "AU", name: "Australia", nameUa: "Австралiя" },
  { code: "DE", name: "Germany", nameUa: "Нiмеччина" },
  { code: "FR", name: "France", nameUa: "Францiя" },
  { code: "UA", name: "Ukraine", nameUa: "Украiна" },
  { code: "PL", name: "Poland", nameUa: "Польща" },
];

export default function NumbersPage() {
  const lang = useDashboardLang();
  const t = lang === "ua";

  const [numbers, setNumbers] = useState<PhoneNumber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [twilioConfigured, setTwilioConfigured] = useState(true);

  // Buy modal state
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [searchCountry, setSearchCountry] = useState("US");
  const [searchAreaCode, setSearchAreaCode] = useState("");
  const [searching, setSearching] = useState(false);
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseLabel, setPurchaseLabel] = useState("");

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadNumbers = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/numbers");
      if (!res.ok) {
        const data = await res.json();
        if (data.error?.includes("Twilio is not configured")) {
          setTwilioConfigured(false);
        }
        return;
      }
      const data = await res.json();
      setNumbers(data.numbers || []);
    } catch {
      // non-blocking
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCampaigns = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/campaigns");
      if (!res.ok) return;
      const data = await res.json();
      setCampaigns(data.campaigns || []);
    } catch {
      // non-blocking
    }
  }, []);

  useEffect(() => {
    loadNumbers();
    loadCampaigns();
  }, [loadNumbers, loadCampaigns]);

  async function handleSearch() {
    setSearching(true);
    setAvailableNumbers([]);
    setSelectedNumber(null);
    try {
      const params = new URLSearchParams({ country: searchCountry });
      if (searchAreaCode.trim()) params.set("areaCode", searchAreaCode.trim());
      const res = await fetch(`/api/dashboard/numbers/available?${params}`);
      const data = await res.json();
      if (!res.ok) {
        if (data.error?.includes("Twilio is not configured")) {
          setTwilioConfigured(false);
        }
        throw new Error(data.error || "Search failed");
      }
      setAvailableNumbers(data.numbers || []);
      if (data.numbers?.length === 0) {
        toast.info(t ? "Номерiв не знайдено. Спробуйте iнший код мiста." : "No numbers found. Try a different area code.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(t ? `Помилка пошуку: ${msg}` : `Search error: ${msg}`);
    } finally {
      setSearching(false);
    }
  }

  async function handlePurchase() {
    if (!selectedNumber) return;
    setPurchasing(true);
    try {
      const res = await fetch("/api/dashboard/numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: selectedNumber,
          label: purchaseLabel.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Purchase failed");
      toast.success(t ? `Номер ${selectedNumber} придбано!` : `Number ${selectedNumber} purchased!`);
      setBuyModalOpen(false);
      setAvailableNumbers([]);
      setSelectedNumber(null);
      setPurchaseLabel("");
      loadNumbers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(t ? `Помилка покупки: ${msg}` : `Purchase error: ${msg}`);
    } finally {
      setPurchasing(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/dashboard/numbers/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete failed");
      }
      toast.success(t ? "Номер видалено та звiльнено" : "Number deleted and released");
      setDeleteId(null);
      loadNumbers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(t ? `Помилка видалення: ${msg}` : `Delete error: ${msg}`);
    } finally {
      setDeleting(false);
    }
  }

  async function handleCampaignAssign(numberId: string, campaignId: string | null) {
    try {
      const res = await fetch(`/api/dashboard/numbers/${numberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId: campaignId || null }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Update failed");
      }
      toast.success(t ? "Кампанiю призначено" : "Campaign assigned");
      loadNumbers();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error(t ? `Помилка: ${msg}` : `Error: ${msg}`);
    }
  }

  // Not configured state
  if (!loading && !twilioConfigured) {
    return (
      <div>
        <PageHeader
          title={t ? "Телефоннi номери" : "Phone Numbers"}
          description={t ? "Керуйте номерами телефону та призначайте iх кампанiям." : "Manage your phone numbers and assign them to campaigns."}
        />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-amber-400/10 border border-amber-400/20 mb-6">
            <AlertTriangle size={28} className="text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 font-display">
            {t ? "Налаштуйте Twilio" : "Configure Twilio"}
          </h3>
          <p className="text-sm text-white/40 max-w-md mb-2">
            {t
              ? "Для управлiння телефонними номерами потрiбен облiковий запис Twilio."
              : "A Twilio account is required to manage phone numbers."}
          </p>
          <p className="text-xs text-white/25 max-w-md">
            {t
              ? "Додайте TWILIO_ACCOUNT_SID та TWILIO_AUTH_TOKEN до змiнних середовища."
              : "Add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to your environment variables."}
          </p>
        </div>
      </div>
    );
  }

  // Loading
  if (loading) {
    return (
      <div>
        <PageHeader
          title={t ? "Телефоннi номери" : "Phone Numbers"}
          description={t ? "Керуйте номерами телефону та призначайте iх кампанiям." : "Manage your phone numbers and assign them to campaigns."}
        />
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="text-white/30 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={t ? "Телефоннi номери" : "Phone Numbers"}
        description={t ? "Керуйте номерами телефону та призначайте iх кампанiям." : "Manage your phone numbers and assign them to campaigns."}
        action={
          <GlassButton
            className="glass-button-primary"
            size="sm"
            onClick={() => setBuyModalOpen(true)}
          >
            <span className="flex items-center gap-2">
              <Plus size={14} />
              {t ? "Купити номер" : "Buy Number"}
            </span>
          </GlassButton>
        }
      />

      {/* Numbers table */}
      {numbers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white/[0.03] border border-white/8 mb-6">
            <Phone size={28} className="text-white/20" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 font-display">
            {t ? "Номерiв ще немає" : "No numbers yet"}
          </h3>
          <p className="text-sm text-white/40 max-w-md mb-6">
            {t
              ? "Придбайте телефонний номер, щоб почати здiйснювати та приймати дзвiнки."
              : "Purchase a phone number to start making and receiving calls."}
          </p>
          <GlassButton
            onClick={() => setBuyModalOpen(true)}
            className="glass-button-primary"
            size="sm"
          >
            <span className="flex items-center gap-2">
              <Plus size={14} />
              {t ? "Купити номер" : "Buy Number"}
            </span>
          </GlassButton>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.95)] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1fr_100px_100px_1fr_80px] gap-4 px-6 py-3 border-b border-white/8 text-xs font-medium text-white/30 uppercase tracking-wider">
            <span>{t ? "Номер" : "Number"}</span>
            <span>{t ? "Мiтка" : "Label"}</span>
            <span>{t ? "Провайдер" : "Provider"}</span>
            <span>{t ? "Статус" : "Status"}</span>
            <span>{t ? "Кампанiя" : "Campaign"}</span>
            <span />
          </div>

          {/* Table rows */}
          {numbers.map((num) => (
            <div
              key={num.id}
              className="grid grid-cols-[1fr_1fr_100px_100px_1fr_80px] gap-4 px-6 py-4 border-b border-white/[0.04] items-center hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-400/10 border border-emerald-400/20">
                  <Phone size={14} className="text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-white font-mono">
                  {num.number}
                </span>
              </div>

              <span className="text-sm text-white/50 truncate">
                {num.label || (t ? "Без мiтки" : "No label")}
              </span>

              <span className="text-xs text-white/40 capitalize">{num.provider}</span>

              <span>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                    num.status === "active"
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                      : num.status === "pending"
                      ? "border-amber-400/20 bg-amber-400/10 text-amber-400"
                      : "border-white/10 bg-white/5 text-white/40"
                  }`}
                >
                  {num.status === "active"
                    ? t ? "Активний" : "Active"
                    : num.status === "pending"
                    ? t ? "Очiкування" : "Pending"
                    : t ? "Неактивний" : "Inactive"}
                </span>
              </span>

              <select
                className="text-sm bg-white/[0.03] border border-white/8 rounded-lg px-3 py-1.5 text-white/60 focus:outline-none focus:border-[#0090f0]/40 transition-colors cursor-pointer"
                value={num.campaignId || ""}
                onChange={(e) => handleCampaignAssign(num.id, e.target.value || null)}
              >
                <option value="">{t ? "Не призначено" : "Unassigned"}</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end">
                <button
                  onClick={() => setDeleteId(num.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-400/10 transition-colors group"
                  title={t ? "Видалити" : "Delete"}
                >
                  <Trash2 size={14} className="text-white/20 group-hover:text-red-400 transition-colors" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Buy Number Modal */}
      {buyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setBuyModalOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-xl rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.98)] p-6 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-emerald-400/10 border border-emerald-400/20">
                  <Phone size={16} className="text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white font-display">
                  {t ? "Купити номер" : "Buy Number"}
                </h3>
              </div>
              <button
                onClick={() => setBuyModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/[0.06] transition-colors"
              >
                <X size={16} className="text-white/50" />
              </button>
            </div>

            {/* Search form */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2">
                    {t ? "Краiна" : "Country"}
                  </label>
                  <select
                    value={searchCountry}
                    onChange={(e) => setSearchCountry(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors cursor-pointer"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {t ? c.nameUa : c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2">
                    {t ? "Код мiста (необов'язково)" : "Area Code (optional)"}
                  </label>
                  <input
                    type="text"
                    value={searchAreaCode}
                    onChange={(e) => setSearchAreaCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="e.g. 361"
                    maxLength={5}
                    className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors"
                  />
                </div>
              </div>
              <GlassButton
                size="sm"
                onClick={handleSearch}
                disabled={searching}
              >
                {searching ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    {t ? "Пошук..." : "Searching..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search size={14} />
                    {t ? "Шукати номери" : "Search Numbers"}
                  </span>
                )}
              </GlassButton>
            </div>

            {/* Available numbers list */}
            {availableNumbers.length > 0 && (
              <div className="space-y-2 mb-6">
                <p className="text-sm font-medium text-white/50 mb-3">
                  {t
                    ? `Знайдено ${availableNumbers.length} номерiв:`
                    : `Found ${availableNumbers.length} numbers:`}
                </p>
                <div className="max-h-[280px] overflow-y-auto space-y-1 pr-1">
                  {availableNumbers.map((num) => (
                    <button
                      key={num.phoneNumber}
                      onClick={() => setSelectedNumber(num.phoneNumber)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-colors text-left ${
                        selectedNumber === num.phoneNumber
                          ? "border-[#0090f0]/40 bg-[#0090f0]/10"
                          : "border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {selectedNumber === num.phoneNumber && (
                          <Check size={14} className="text-[#0090f0]" />
                        )}
                        <span className="text-sm font-mono text-white">
                          {num.phoneNumber}
                        </span>
                        {num.locality && (
                          <span className="text-xs text-white/30">
                            {num.locality}{num.region ? `, ${num.region}` : ""}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {num.capabilities.voice && (
                          <PhoneCall size={12} className="text-emerald-400/60" />
                        )}
                        {num.capabilities.sms && (
                          <MessageSquare size={12} className="text-blue-400/60" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Purchase section */}
            {selectedNumber && (
              <div className="space-y-4 border-t border-white/8 pt-4">
                <div>
                  <label className="block text-sm font-medium text-white/50 mb-2">
                    {t ? "Мiтка (необов'язково)" : "Label (optional)"}
                  </label>
                  <input
                    type="text"
                    value={purchaseLabel}
                    onChange={(e) => setPurchaseLabel(e.target.value)}
                    placeholder={t ? "напр. Основний номер" : "e.g. Main line"}
                    className="w-full px-4 py-3 rounded-xl border border-white/8 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#0090f0]/40 transition-colors"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-white/40">
                    {t ? "Вибрано: " : "Selected: "}
                    <span className="text-white font-mono">{selectedNumber}</span>
                  </p>
                  <GlassButton
                    className="glass-button-primary"
                    size="sm"
                    onClick={handlePurchase}
                    disabled={purchasing}
                  >
                    {purchasing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        {t ? "Купую..." : "Purchasing..."}
                      </span>
                    ) : (
                      t ? "Придбати" : "Purchase"
                    )}
                  </GlassButton>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setDeleteId(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-sm rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.98)] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-400/10 border border-red-400/20">
                <AlertTriangle size={16} className="text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white font-display">
                {t ? "Видалити номер?" : "Delete Number?"}
              </h3>
            </div>
            <p className="text-sm text-white/40 mb-6">
              {t
                ? "Цей номер буде звiльнено у Twilio i видалено з вашого облiкового запису. Цю дiю не можна скасувати."
                : "This number will be released from Twilio and removed from your account. This action cannot be undone."}
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
              >
                {t ? "Скасувати" : "Cancel"}
              </button>
              <GlassButton
                size="sm"
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
              >
                {deleting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    {t ? "Видалення..." : "Deleting..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Trash2 size={14} />
                    {t ? "Видалити" : "Delete"}
                  </span>
                )}
              </GlassButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
