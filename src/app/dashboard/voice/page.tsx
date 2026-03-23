"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Mic, Globe, Brain, Check, X, ChevronDown, Volume2 } from "lucide-react";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";

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

  const toggleVoice = (id: string) => {
    setSelectedVoices((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const removeVoice = (id: string) => {
    setSelectedVoices((prev) => prev.filter((v) => v !== id));
  };

  const selectedLang = availableLanguages.find((l) => l.code === language);

  return (
    <div>
      <PageHeader
        title={t ? "Налаштування голосу" : "Voice Settings"}
        description={t ? "Налаштуйте голос, мову та характер для вашого AI-агента." : "Configure voice, language, and personality for your AI agent."}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Voice Selection */}
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6">
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
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6">
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
        <div className="rounded-2xl border border-white/8 bg-[rgba(14,14,22,0.95)] p-6">
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
