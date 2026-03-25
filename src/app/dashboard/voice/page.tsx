"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { GlassButton } from "@/components/ui/glass-button";
import { Mic, Globe, Brain, Check, X, ChevronDown, Volume2, Loader2, RefreshCw } from "lucide-react";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";
import { toast } from "sonner";

const availableVoices = [
  { id: "alloy", name: "Alloy", lang: "EN", gender: "Neutral" },
  { id: "nova", name: "Nova", lang: "EN", gender: "Female" },
  { id: "shimmer", name: "Shimmer", lang: "EN", gender: "Female" },
  { id: "echo", name: "Echo", lang: "EN", gender: "Male" },
  { id: "onyx", name: "Onyx", lang: "EN", gender: "Male" },
  { id: "fable", name: "Fable", lang: "EN", gender: "Neutral" },
  { id: "olena", name: "Olena", lang: "UK", gender: "Female" },
  { id: "dmytro", name: "Dmytro", lang: "UK", gender: "Male" },
  { id: "sofia", name: "Sofia", lang: "UK", gender: "Female" },
  { id: "taras", name: "Taras", lang: "UK", gender: "Male" },
  { id: "maria", name: "Maria", lang: "UK/EN", gender: "Female" },
  { id: "custom", name: "Custom Clone", lang: "Any", gender: "\u2014" },
];

const availableLanguages = [
  { code: "uk", name: "Ukrainian", nameUa: "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430", flag: "\ud83c\uddfa\ud83c\udde6" },
  { code: "en", name: "English", nameUa: "\u0410\u043d\u0433\u043b\u0456\u0439\u0441\u044c\u043a\u0430", flag: "\ud83c\uddec\ud83c\udde7" },
  { code: "uk-en", name: "Ukrainian + English", nameUa: "\u0423\u043a\u0440\u0430\u0457\u043d\u0441\u044c\u043a\u0430 + \u0410\u043d\u0433\u043b\u0456\u0439\u0441\u044c\u043a\u0430", flag: "\ud83c\uddfa\ud83c\udde6\ud83c\uddec\ud83c\udde7" },
  { code: "de", name: "German", nameUa: "\u041d\u0456\u043c\u0435\u0446\u044c\u043a\u0430", flag: "\ud83c\udde9\ud83c\uddea" },
  { code: "pl", name: "Polish", nameUa: "\u041f\u043e\u043b\u044c\u0441\u044c\u043a\u0430", flag: "\ud83c\uddf5\ud83c\uddf1" },
  { code: "fr", name: "French", nameUa: "\u0424\u0440\u0430\u043d\u0446\u0443\u0437\u044c\u043a\u0430", flag: "\ud83c\uddeb\ud83c\uddf7" },
  { code: "es", name: "Spanish", nameUa: "\u0406\u0441\u043f\u0430\u043d\u0441\u044c\u043a\u0430", flag: "\ud83c\uddea\ud83c\uddf8" },
];

export default function VoicePage() {
  const dashLang = useDashboardLang();
  const t = dashLang === "ua";

  const [selectedVoices, setSelectedVoices] = useState<string[]>(["olena"]);
  const [voiceDropdownOpen, setVoiceDropdownOpen] = useState(false);
  const [language, setLanguage] = useState("uk");
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [personality, setPersonality] = useState("professional");

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<"idle" | "success" | "error">("idle");

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialLoadDone = useRef(false);

  // Fetch config on load
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch("/api/dashboard/voice");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setSelectedVoices(Array.isArray(data.selectedVoices) ? data.selectedVoices : ["olena"]);
        setLanguage(data.language || "uk");
        setPersonality(data.personality || "professional");
      } catch (err) {
        console.error("Failed to load voice config:", err);
      } finally {
        setLoading(false);
        // Mark initial load done after a tick so the effect doesn't trigger save
        setTimeout(() => {
          initialLoadDone.current = true;
        }, 100);
      }
    }
    fetchConfig();
  }, []);

  // Auto-save with debounce
  const saveConfig = useCallback(async (voices: string[], lang: string, pers: string) => {
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/dashboard/voice", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedVoices: voices,
          language: lang,
          personality: pers,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaveStatus("saved");
      toast.success(dashLang === "ua" ? "Налаштування збережено" : "Settings saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch {
      setSaveStatus("error");
      toast.error(dashLang === "ua" ? "Не вдалося зберегти" : "Failed to save settings");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  }, []);

  useEffect(() => {
    if (!initialLoadDone.current) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      saveConfig(selectedVoices, language, personality);
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [selectedVoices, language, personality, saveConfig]);

  const toggleVoice = (id: string) => {
    setSelectedVoices((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const removeVoice = (id: string) => {
    setSelectedVoices((prev) => prev.filter((v) => v !== id));
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult("idle");
    try {
      const res = await fetch("/api/dashboard/voice/sync", { method: "POST" });
      if (!res.ok) throw new Error("Sync failed");
      setSyncResult("success");
      toast.success(dashLang === "ua" ? "Синхронізовано з агентом" : "Synced to agent");
      setTimeout(() => setSyncResult("idle"), 3000);
    } catch {
      setSyncResult("error");
      toast.error(dashLang === "ua" ? "Не вдалося синхронізувати" : "Sync failed");
      setTimeout(() => setSyncResult("idle"), 3000);
    } finally {
      setSyncing(false);
    }
  };

  const selectedLang = availableLanguages.find((l) => l.code === language);

  if (loading) {
    return (
      <div>
        <PageHeader
          title={t ? "Налаштування голосу" : "Voice Settings"}
          description={t ? "Налаштуйте голос, мову та характер для вашого AI-агента." : "Configure voice, language, and personality for your AI agent."}
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
        title={t ? "Налаштування голосу" : "Voice Settings"}
        description={t ? "Налаштуйте голос, мову та характер для вашого AI-агента." : "Configure voice, language, and personality for your AI agent."}
        action={
          <div className="flex items-center gap-3">
            {/* Save status indicator */}
            {saveStatus === "saving" && (
              <span className="flex items-center gap-1.5 text-xs text-white/30">
                <Loader2 size={12} className="animate-spin" />
                {t ? "Збереження..." : "Saving..."}
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1.5 text-xs text-[#34d399]">
                <Check size={12} />
                {t ? "Збережено" : "Saved"}
              </span>
            )}
            {saveStatus === "error" && (
              <span className="flex items-center gap-1.5 text-xs text-red-400">
                <X size={12} />
                {t ? "Помилка збереження" : "Save failed"}
              </span>
            )}

            {/* Sync result indicator */}
            {syncResult === "success" && (
              <span className="flex items-center gap-1.5 text-xs text-[#34d399]">
                <Check size={12} />
                {t ? "Синхронізовано" : "Synced"}
              </span>
            )}
            {syncResult === "error" && (
              <span className="flex items-center gap-1.5 text-xs text-red-400">
                <X size={12} />
                {t ? "Помилка синхронізації" : "Sync failed"}
              </span>
            )}

            <GlassButton
              onClick={handleSync}
              className="glass-button-primary"
              size="sm"
              disabled={syncing}
            >
              <span className="flex items-center gap-2">
                {syncing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <RefreshCw size={14} />
                )}
                {t ? "Синхронізувати з агентом" : "Sync to Agent"}
              </span>
            </GlassButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Voice Selection */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.95)] p-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#a78bfa]/10 border border-[#a78bfa]/20 mb-4">
            <Mic size={18} className="text-[#a78bfa]" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1 font-display">
            {t ? "Вибір голосу" : "Voice Selection"}
          </h3>
          <p className="text-sm text-white/40 mb-4">
            {t ? "Оберіть один або кілька голосів. Кілька чергуються випадково." : "Pick one or more voices. Multiple rotate randomly."}
          </p>

          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setVoiceDropdownOpen(!voiceDropdownOpen)}
              className="w-full flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70 hover:border-[#a78bfa]/30 transition-all"
            >
              <span className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
                {selectedVoices.length === 0 ? (
                  <span>{t ? "Оберіть голоси..." : "Select voices..."}</span>
                ) : (
                  selectedVoices.map((vid) => {
                    const voice = availableVoices.find((v) => v.id === vid);
                    if (!voice) return null;
                    return (
                      <span key={vid} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#a78bfa]/10 border border-[#a78bfa]/20 text-xs text-[#a78bfa]">
                        {voice.name}
                        <button onClick={(e) => { e.stopPropagation(); removeVoice(vid); }} className="hover:text-white transition-colors"><X size={10} /></button>
                      </span>
                    );
                  })
                )}
              </span>
              <ChevronDown size={16} className={`text-white/30 transition-transform flex-shrink-0 ml-2 ${voiceDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {voiceDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-white/10 bg-[rgba(12,12,18,0.98)] backdrop-blur-xl shadow-2xl shadow-black/50 max-h-[280px] overflow-y-auto overscroll-contain">
                {availableVoices.map((voice) => {
                  const sel = selectedVoices.includes(voice.id);
                  return (
                    <button key={voice.id} onClick={() => toggleVoice(voice.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${sel ? "bg-[#a78bfa]/10 text-[#a78bfa]" : "text-white/60 hover:bg-white/5"}`}>
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${sel ? "bg-[#a78bfa] border-[#a78bfa]" : "border-white/20"}`}>
                        {sel && <Check size={10} className="text-white" />}
                      </div>
                      <Volume2 size={14} className="text-white/20" />
                      <span className="flex-1 text-left">{voice.name}</span>
                      <span className="text-[10px] text-white/25 font-mono">{voice.lang}</span>
                      <span className="text-[10px] text-white/20">{voice.gender}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          {selectedVoices.length > 1 && (
            <p className="text-[11px] text-white/25 mt-2">
              {t ? "Голоси призначаються випадково для кожного дзвінка." : "Voices assigned randomly to each call."}
            </p>
          )}
        </div>

        {/* Language */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.95)] p-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#0090f0]/10 border border-[#0090f0]/20 mb-4">
            <Globe size={18} className="text-[#0090f0]" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1 font-display">
            {t ? "Мова" : "Language"}
          </h3>
          <p className="text-sm text-white/40 mb-4">
            {t ? "Мова агента" : "Agent language"}
          </p>

          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="w-full flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70 hover:border-[#0090f0]/30 transition-all"
            >
              <span className="flex items-center gap-2">
                <span>{selectedLang?.flag}</span>
                <span>{t ? selectedLang?.nameUa : selectedLang?.name}</span>
              </span>
              <ChevronDown size={16} className={`text-white/30 transition-transform ${langDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {langDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-xl border border-white/10 bg-[rgba(12,12,18,0.98)] backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
                {availableLanguages.map((l) => (
                  <button key={l.code} onClick={() => { setLanguage(l.code); setLangDropdownOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${language === l.code ? "bg-[#0090f0]/10 text-[#36adff]" : "text-white/60 hover:bg-white/5"}`}>
                    <span className="text-base">{l.flag}</span>
                    <span className="flex-1 text-left">{t ? l.nameUa : l.name}</span>
                    {language === l.code && <Check size={14} className="text-[#0090f0]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Personality */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(0,0,0,0.95)] p-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#34d399]/10 border border-[#34d399]/20 mb-4">
            <Brain size={18} className="text-[#34d399]" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1 font-display">
            {t ? "Характер" : "Personality"}
          </h3>
          <p className="text-sm text-white/40 mb-4">
            {t ? "Тон агента" : "Agent tone"}
          </p>
          <select
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/70 outline-none focus:border-[#34d399]/40 transition-all appearance-none cursor-pointer"
          >
            <option value="professional">{t ? "Професійний" : "Professional"}</option>
            <option value="friendly">{t ? "Дружній" : "Friendly"}</option>
            <option value="assertive">{t ? "Наполегливий" : "Assertive"}</option>
            <option value="empathetic">{t ? "Емпатичний" : "Empathetic"}</option>
            <option value="casual">{t ? "Невимушений" : "Casual"}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
