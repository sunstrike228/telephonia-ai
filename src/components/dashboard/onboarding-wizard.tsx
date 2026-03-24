"use client";

import { useState, useCallback, useRef } from "react";
import { useDashboardLang } from "@/hooks/use-dashboard-lang";
import { GlassButton } from "@/components/ui/glass-button";
import { FileText, Mic, Users, Check, Upload, Plus, X } from "lucide-react";
import confetti from "canvas-confetti";

interface OnboardingWizardProps {
  onComplete: () => void;
}

const VOICES = [
  { id: "olena", name: "Olena", lang: "uk" },
  { id: "dmytro", name: "Dmytro", lang: "uk" },
  { id: "sarah", name: "Sarah", lang: "en" },
  { id: "james", name: "James", lang: "en" },
  { id: "emma", name: "Emma", lang: "en" },
];

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const lang = useDashboardLang();
  const t = lang === "ua";

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Step 1: Script
  const [scriptName, setScriptName] = useState("");
  const [scriptContent, setScriptContent] = useState("");
  const [objectionHandlers, setObjectionHandlers] = useState("");

  // Step 2: Voice
  const [voiceLanguage, setVoiceLanguage] = useState("uk");
  const [personality, setPersonality] = useState("professional");
  const [selectedVoice, setSelectedVoice] = useState("olena");

  // Step 3: Leads
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [manualMode, setManualMode] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleStep1 = useCallback(async () => {
    if (!scriptName.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/dashboard/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: scriptName.trim(),
          content: scriptContent,
          objectionHandlers: objectionHandlers
            .split("\n")
            .map((h) => h.trim())
            .filter(Boolean),
        }),
      });
    } catch {
      // continue even if fails
    }
    setLoading(false);
    setStep(2);
  }, [scriptName, scriptContent, objectionHandlers]);

  const handleStep2 = useCallback(async () => {
    setLoading(true);
    try {
      await fetch("/api/dashboard/voice", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedVoices: [selectedVoice],
          language: voiceLanguage,
          personality,
        }),
      });
    } catch {
      // continue
    }
    setLoading(false);
    setStep(3);
  }, [selectedVoice, voiceLanguage, personality]);

  const handleStep3 = useCallback(async () => {
    setLoading(true);
    try {
      if (csvFile) {
        const formData = new FormData();
        formData.append("file", csvFile);
        await fetch("/api/dashboard/leads/import", {
          method: "POST",
          body: formData,
        });
      } else if (manualMode && (leadName || leadPhone || leadEmail)) {
        const nameParts = leadName.trim().split(" ");
        await fetch("/api/dashboard/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: nameParts[0] || null,
            lastName: nameParts.slice(1).join(" ") || null,
            phone: leadPhone || null,
            email: leadEmail || null,
            company: leadCompany || null,
          }),
        });
      }
    } catch {
      // continue
    }
    setLoading(false);
    await finishOnboarding();
  }, [csvFile, manualMode, leadName, leadPhone, leadEmail, leadCompany]);

  const finishOnboarding = useCallback(async () => {
    try {
      await fetch("/api/dashboard/onboarding/complete", { method: "POST" });
    } catch {
      // continue
    }

    setCompleted(true);

    // Fire confetti
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#00d4ff", "#0090f0", "#ff4d4d", "#34d399"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#00d4ff", "#0090f0", "#ff4d4d", "#34d399"],
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    setTimeout(() => {
      onComplete();
    }, 2500);
  }, [onComplete]);

  const skipStep = useCallback(() => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else finishOnboarding();
  }, [step, finishOnboarding]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".csv")) {
      setCsvFile(file);
      setManualMode(false);
    }
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.name.endsWith(".csv")) {
        setCsvFile(file);
        setManualMode(false);
      }
    },
    []
  );

  const inputClass =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#00d4ff]/40 focus:ring-1 focus:ring-[#00d4ff]/20 transition-colors duration-200";
  const textareaClass =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-[#00d4ff]/40 focus:ring-1 focus:ring-[#00d4ff]/20 transition-colors duration-200 resize-none";
  const selectClass =
    "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-[#00d4ff]/40 focus:ring-1 focus:ring-[#00d4ff]/20 transition-colors duration-200 appearance-none cursor-pointer [&>option]:bg-[#0e0e16] [&>option]:text-white";

  const stepIcons = [FileText, Mic, Users];
  const stepLabels = t
    ? ["Скрипт", "Голос", "Ліди"]
    : ["Script", "Voice", "Leads"];

  if (completed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(4,4,8,0.95)] backdrop-blur-xl">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#34d399]/20 border border-[#34d399]/30">
            <Check size={40} className="text-[#34d399]" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 font-display">
            {t ? "Все готово!" : "You're all set!"}
          </h2>
          <p className="text-white/40 text-sm">
            {t
              ? "Переспрямовуємо на дашборд..."
              : "Redirecting to dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(4,4,8,0.95)] backdrop-blur-xl p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[rgba(14,14,22,0.98)] shadow-2xl">
        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s, i) => {
              const Icon = stepIcons[i];
              const isActive = s === step;
              const isDone = s < step;
              return (
                <div key={s} className="flex items-center gap-2">
                  {i > 0 && (
                    <div
                      className={`h-px w-8 transition-colors duration-300 ${
                        isDone ? "bg-[#00d4ff]" : "bg-white/10"
                      }`}
                    />
                  )}
                  <div
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-[#00d4ff]/15 text-[#00d4ff] border border-[#00d4ff]/30"
                        : isDone
                          ? "bg-[#34d399]/15 text-[#34d399] border border-[#34d399]/30"
                          : "bg-white/5 text-white/30 border border-white/[0.06]"
                    }`}
                  >
                    {isDone ? (
                      <Check size={12} />
                    ) : (
                      <Icon size={12} />
                    )}
                    {stepLabels[i]}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-white/30 mb-1">
            {t ? `Крок ${step} з 3` : `Step ${step} of 3`}
          </p>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {/* Step 1: Script */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-white mb-1 font-display">
                  {t ? "Створіть перший скрипт" : "Create Your First Script"}
                </h3>
                <p className="text-sm text-white/40">
                  {t
                    ? "Напишіть скрипт, який ваш AI-агент буде використовувати під час дзвінків."
                    : "Write the script your AI agent will use during calls."}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">
                  {t ? "Назва скрипта" : "Script name"}
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder={
                    t ? "напр. Холодний обдзвін B2B" : "e.g. B2B Cold Call"
                  }
                  value={scriptName}
                  onChange={(e) => setScriptName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">
                  {t ? "Текст скрипта" : "Script content"}
                </label>
                <textarea
                  className={textareaClass}
                  rows={6}
                  placeholder={
                    t
                      ? "Привіт, мене звати {agent_name}. Я дзвоню від компанії..."
                      : "Hi, my name is {agent_name}. I'm calling from..."
                  }
                  value={scriptContent}
                  onChange={(e) => setScriptContent(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">
                  {t
                    ? "Обробка заперечень (по одному на рядок)"
                    : "Objection handlers (one per line)"}
                </label>
                <textarea
                  className={textareaClass}
                  rows={3}
                  placeholder={
                    t
                      ? '"Мені не цікаво" → Я розумію, але дозвольте мені...\n"У мене немає часу" → Це займе лише 30 секунд...'
                      : '"Not interested" → I understand, but let me...\n"No time" → This will only take 30 seconds...'
                  }
                  value={objectionHandlers}
                  onChange={(e) => setObjectionHandlers(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={skipStep}
                  className="text-xs text-white/30 hover:text-white/50 transition-colors duration-200"
                >
                  {t ? "Зроблю це пізніше" : "I'll do this later"}
                </button>
                <GlassButton
                  size="sm"
                  onClick={handleStep1}
                  disabled={loading || !scriptName.trim()}
                >
                  {loading
                    ? t
                      ? "Збереження..."
                      : "Saving..."
                    : t
                      ? "Далі"
                      : "Next"}
                </GlassButton>
              </div>
            </div>
          )}

          {/* Step 2: Voice */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-white mb-1 font-display">
                  {t ? "Налаштуйте голос" : "Configure Voice"}
                </h3>
                <p className="text-sm text-white/40">
                  {t
                    ? "Виберіть мову, характер та голос для вашого AI-агента."
                    : "Choose language, personality, and voice for your AI agent."}
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">
                  {t ? "Мова" : "Language"}
                </label>
                <select
                  className={selectClass}
                  value={voiceLanguage}
                  onChange={(e) => setVoiceLanguage(e.target.value)}
                >
                  <option value="uk">
                    {t ? "Українська" : "Ukrainian"}
                  </option>
                  <option value="en">{t ? "Англійська" : "English"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">
                  {t ? "Характер" : "Personality"}
                </label>
                <select
                  className={selectClass}
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                >
                  <option value="professional">
                    {t ? "Професійний" : "Professional"}
                  </option>
                  <option value="friendly">
                    {t ? "Дружній" : "Friendly"}
                  </option>
                  <option value="assertive">
                    {t ? "Наполегливий" : "Assertive"}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-3">
                  {t ? "Голос" : "Voice"}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {VOICES.filter(
                    (v) => v.lang === voiceLanguage
                  ).map((voice) => (
                    <button
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice.id)}
                      className={`rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 ${
                        selectedVoice === voice.id
                          ? "border-[#00d4ff]/40 bg-[#00d4ff]/10 text-[#00d4ff]"
                          : "border-white/[0.08] bg-white/[0.03] text-white/60 hover:border-white/15 hover:text-white/80"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Mic size={14} />
                        <span className="font-medium">{voice.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={skipStep}
                  className="text-xs text-white/30 hover:text-white/50 transition-colors duration-200"
                >
                  {t ? "Зроблю це пізніше" : "I'll do this later"}
                </button>
                <GlassButton size="sm" onClick={handleStep2} disabled={loading}>
                  {loading
                    ? t
                      ? "Збереження..."
                      : "Saving..."
                    : t
                      ? "Далі"
                      : "Next"}
                </GlassButton>
              </div>
            </div>
          )}

          {/* Step 3: Leads */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-white mb-1 font-display">
                  {t ? "Імпортуйте ліди" : "Import Your Leads"}
                </h3>
                <p className="text-sm text-white/40">
                  {t
                    ? "Завантажте CSV-файл з контактами або додайте ліда вручну."
                    : "Upload a CSV file with contacts or add a lead manually."}
                </p>
              </div>

              {!manualMode ? (
                <>
                  {/* CSV Drop Zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center cursor-pointer transition-all duration-200 ${
                      dragOver
                        ? "border-[#00d4ff]/50 bg-[#00d4ff]/5"
                        : csvFile
                          ? "border-[#34d399]/40 bg-[#34d399]/5"
                          : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    {csvFile ? (
                      <>
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#34d399]/20">
                          <Check size={20} className="text-[#34d399]" />
                        </div>
                        <p className="text-sm font-medium text-white">
                          {csvFile.name}
                        </p>
                        <p className="mt-1 text-xs text-white/30">
                          {(csvFile.size / 1024).toFixed(1)} KB
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCsvFile(null);
                          }}
                          className="mt-2 text-xs text-white/30 hover:text-white/50 flex items-center gap-1"
                        >
                          <X size={12} />
                          {t ? "Видалити" : "Remove"}
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                          <Upload size={20} className="text-white/30" />
                        </div>
                        <p className="text-sm text-white/60">
                          {t
                            ? "Перетягніть CSV-файл сюди"
                            : "Drag & drop CSV file here"}
                        </p>
                        <p className="mt-1 text-xs text-white/25">
                          {t
                            ? "або натисніть, щоб вибрати файл"
                            : "or click to browse"}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-white/[0.06]" />
                    <span className="text-xs text-white/20">
                      {t ? "або" : "or"}
                    </span>
                    <div className="h-px flex-1 bg-white/[0.06]" />
                  </div>

                  <button
                    onClick={() => setManualMode(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white/50 hover:border-white/15 hover:text-white/70 transition-colors duration-200"
                  >
                    <Plus size={14} />
                    {t ? "Додати вручну" : "Add manually"}
                  </button>
                </>
              ) : (
                <>
                  {/* Manual lead form */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5">
                        {t ? "Ім'я" : "Name"}
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder={
                          t ? "Іван Петренко" : "John Smith"
                        }
                        value={leadName}
                        onChange={(e) => setLeadName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5">
                        {t ? "Телефон" : "Phone"}
                      </label>
                      <input
                        type="tel"
                        className={inputClass}
                        placeholder="+380..."
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        className={inputClass}
                        placeholder="email@example.com"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/50 mb-1.5">
                        {t ? "Компанія" : "Company"}
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder={t ? "Назва компанії" : "Company name"}
                        value={leadCompany}
                        onChange={(e) => setLeadCompany(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setManualMode(false);
                      setLeadName("");
                      setLeadPhone("");
                      setLeadEmail("");
                      setLeadCompany("");
                    }}
                    className="text-xs text-white/30 hover:text-white/50 transition-colors duration-200"
                  >
                    {t ? "Завантажити CSV замість цього" : "Upload CSV instead"}
                  </button>
                </>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={skipStep}
                  className="text-xs text-white/30 hover:text-white/50 transition-colors duration-200"
                >
                  {t ? "Зроблю це пізніше" : "I'll do this later"}
                </button>
                <GlassButton size="sm" onClick={handleStep3} disabled={loading}>
                  {loading
                    ? t
                      ? "Збереження..."
                      : "Saving..."
                    : t
                      ? "Завершити"
                      : "Finish"}
                </GlassButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
