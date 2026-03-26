"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLang, type Lang } from "@/hooks/use-lang";
import { GlassButton } from "@/components/ui/glass-button";
import { Phone, MessageCircle, Mail } from "lucide-react";

const t: Record<Lang, {
  h1_1: string; h1_2: string; h1_3: string;
  sub1: string; sub2: string;
  cta1: string; ctaCall: string; ctaTelegram: string; ctaEmail: string;
  callBtn: string; callSuccess: string;
  telegramBtn: string; telegramSuccess: string; telegramPlaceholder: string;
  emailBtn: string; emailSuccess: string; emailPlaceholder: string;
  searchPlaceholder: string; rateLimited: string;
}> = {
  en: {
    h1_1: "AI agents that",
    h1_2: "sound human.",
    h1_3: "Sell like pros.",
    sub1: "Replace your outreach team with AI agents that call, message, and email your leads.",
    sub2: "Indistinguishable from real humans.",
    cta1: "Contact us",
    ctaCall: "Request a test call",
    ctaTelegram: "Get a test message",
    ctaEmail: "Get a test email",
    callBtn: "Call me",
    callSuccess: "You'll receive a call within a minute!",
    telegramBtn: "Send message",
    telegramSuccess: "Check your Telegram!",
    telegramPlaceholder: "your_username",
    emailBtn: "Send email",
    emailSuccess: "Check your inbox!",
    emailPlaceholder: "you@email.com",
    searchPlaceholder: "Search country...",
    rateLimited: "Already sent. Try again later.",
  },
  ua: {
    h1_1: "ШІ-агенти, яких",
    h1_2: "не відрізнити від людей.",
    h1_3: "Продають як профі.",
    sub1: "Замініть команду аутрічу на ШІ-агентів, які дзвонять, пишуть в Telegram та відправляють email.",
    sub2: "Не відрізнити від людей.",
    cta1: "Зв'язатися з нами",
    ctaCall: "Замовити тестовий дзвінок",
    ctaTelegram: "Отримати повідомлення",
    ctaEmail: "Отримати тестовий email",
    callBtn: "Зателефонувати",
    callSuccess: "Дзвінок надійде протягом хвилини!",
    telegramBtn: "Надіслати",
    telegramSuccess: "Перевірте Telegram!",
    telegramPlaceholder: "ваш_username",
    emailBtn: "Надіслати",
    emailSuccess: "Перевірте пошту!",
    emailPlaceholder: "ви@email.com",
    searchPlaceholder: "Пошук країни...",
    rateLimited: "Вже надіслано. Спробуйте пізніше.",
  },
  de: {
    h1_1: "KI-Agenten, die",
    h1_2: "menschlich klingen.",
    h1_3: "Verkaufen wie Profis.",
    sub1: "Ersetzen Sie Ihr Outreach-Team durch KI-Agenten, die Ihre Leads anrufen, anschreiben und mailen.",
    sub2: "Nicht von echten Menschen zu unterscheiden.",
    cta1: "Kontakt",
    ctaCall: "Testanruf anfordern",
    ctaTelegram: "Testnachricht erhalten",
    ctaEmail: "Test-E-Mail erhalten",
    callBtn: "Anrufen",
    callSuccess: "Sie erhalten innerhalb einer Minute einen Anruf!",
    telegramBtn: "Nachricht senden",
    telegramSuccess: "Prüfen Sie Ihr Telegram!",
    telegramPlaceholder: "ihr_username",
    emailBtn: "E-Mail senden",
    emailSuccess: "Prüfen Sie Ihren Posteingang!",
    emailPlaceholder: "sie@email.de",
    searchPlaceholder: "Land suchen...",
    rateLimited: "Bereits gesendet. Versuchen Sie es später.",
  },
  fr: {
    h1_1: "Des agents IA qui",
    h1_2: "parlent comme des humains.",
    h1_3: "Vendent comme des pros.",
    sub1: "Remplacez votre équipe de prospection par des agents IA qui appellent, envoient des messages et des emails à vos prospects.",
    sub2: "Impossibles à distinguer de vrais humains.",
    cta1: "Contactez-nous",
    ctaCall: "Demander un appel test",
    ctaTelegram: "Recevoir un message test",
    ctaEmail: "Recevoir un email test",
    callBtn: "Appeler",
    callSuccess: "Vous recevrez un appel dans la minute !",
    telegramBtn: "Envoyer",
    telegramSuccess: "Vérifiez votre Telegram !",
    telegramPlaceholder: "votre_pseudo",
    emailBtn: "Envoyer",
    emailSuccess: "Vérifiez votre boîte mail !",
    emailPlaceholder: "vous@email.fr",
    searchPlaceholder: "Chercher un pays...",
    rateLimited: "Déjà envoyé. Réessayez plus tard.",
  },
  es: {
    h1_1: "Agentes de IA que",
    h1_2: "suenan humanos.",
    h1_3: "Venden como profesionales.",
    sub1: "Reemplace su equipo de prospección con agentes de IA que llaman, envían mensajes y emails a sus leads.",
    sub2: "Indistinguibles de humanos reales.",
    cta1: "Contáctenos",
    ctaCall: "Solicitar llamada de prueba",
    ctaTelegram: "Recibir mensaje de prueba",
    ctaEmail: "Recibir email de prueba",
    callBtn: "Llamar",
    callSuccess: "¡Recibirá una llamada en un minuto!",
    telegramBtn: "Enviar",
    telegramSuccess: "¡Revise su Telegram!",
    telegramPlaceholder: "su_usuario",
    emailBtn: "Enviar",
    emailSuccess: "¡Revise su bandeja de entrada!",
    emailPlaceholder: "usted@email.es",
    searchPlaceholder: "Buscar país...",
    rateLimited: "Ya enviado. Inténtelo más tarde.",
  },
  pl: {
    h1_1: "Agenci AI, którzy",
    h1_2: "brzmią jak ludzie.",
    h1_3: "Sprzedają jak profesjonaliści.",
    sub1: "Zastąp swój zespół sprzedaży agentami AI, którzy dzwonią, piszą i wysyłają maile do Twoich leadów.",
    sub2: "Nie do odróżnienia od prawdziwych ludzi.",
    cta1: "Skontaktuj się",
    ctaCall: "Zamów połączenie testowe",
    ctaTelegram: "Otrzymaj wiadomość testową",
    ctaEmail: "Otrzymaj testowy email",
    callBtn: "Zadzwoń",
    callSuccess: "Otrzymasz połączenie w ciągu minuty!",
    telegramBtn: "Wyślij",
    telegramSuccess: "Sprawdź swojego Telegrama!",
    telegramPlaceholder: "twoja_nazwa",
    emailBtn: "Wyślij",
    emailSuccess: "Sprawdź swoją skrzynkę!",
    emailPlaceholder: "ty@email.pl",
    searchPlaceholder: "Szukaj kraju...",
    rateLimited: "Już wysłano. Spróbuj później.",
  },
  pt: {
    h1_1: "Agentes de IA que",
    h1_2: "soam humanos.",
    h1_3: "Vendem como profissionais.",
    sub1: "Substitua sua equipe de prospecção por agentes de IA que ligam, enviam mensagens e emails para seus leads.",
    sub2: "Indistinguíveis de humanos reais.",
    cta1: "Fale conosco",
    ctaCall: "Solicitar ligação teste",
    ctaTelegram: "Receber mensagem teste",
    ctaEmail: "Receber email teste",
    callBtn: "Ligar",
    callSuccess: "Você receberá uma ligação em um minuto!",
    telegramBtn: "Enviar",
    telegramSuccess: "Verifique seu Telegram!",
    telegramPlaceholder: "seu_usuario",
    emailBtn: "Enviar",
    emailSuccess: "Verifique sua caixa de entrada!",
    emailPlaceholder: "voce@email.com.br",
    searchPlaceholder: "Buscar país...",
    rateLimited: "Já enviado. Tente novamente mais tarde.",
  },
  ja: {
    h1_1: "人間そっくりの",
    h1_2: "AIエージェント。",
    h1_3: "プロのように売る。",
    sub1: "電話、メッセージ、メールでリードにアプローチするAIエージェントで、営業チームを置き換えましょう。",
    sub2: "本物の人間と区別がつきません。",
    cta1: "お問い合わせ",
    ctaCall: "テスト通話を依頼",
    ctaTelegram: "テストメッセージを受信",
    ctaEmail: "テストメールを受信",
    callBtn: "電話する",
    callSuccess: "1分以内にお電話いたします！",
    telegramBtn: "送信",
    telegramSuccess: "Telegramをご確認ください！",
    telegramPlaceholder: "ユーザー名",
    emailBtn: "送信",
    emailSuccess: "受信トレイをご確認ください！",
    emailPlaceholder: "you@email.jp",
    searchPlaceholder: "国を検索...",
    rateLimited: "送信済みです。後でもう一度お試しください。",
  },
};

const allCountryCodes = [
  { code: "+380", flag: "\u{1F1FA}\u{1F1E6}", name: "Ukraine" },
  { code: "+1", flag: "\u{1F1FA}\u{1F1F8}", name: "USA" },
  { code: "+44", flag: "\u{1F1EC}\u{1F1E7}", name: "United Kingdom" },
  { code: "+49", flag: "\u{1F1E9}\u{1F1EA}", name: "Germany" },
  { code: "+48", flag: "\u{1F1F5}\u{1F1F1}", name: "Poland" },
  { code: "+33", flag: "\u{1F1EB}\u{1F1F7}", name: "France" },
  { code: "+34", flag: "\u{1F1EA}\u{1F1F8}", name: "Spain" },
  { code: "+39", flag: "\u{1F1EE}\u{1F1F9}", name: "Italy" },
  { code: "+31", flag: "\u{1F1F3}\u{1F1F1}", name: "Netherlands" },
  { code: "+46", flag: "\u{1F1F8}\u{1F1EA}", name: "Sweden" },
  { code: "+47", flag: "\u{1F1F3}\u{1F1F4}", name: "Norway" },
  { code: "+45", flag: "\u{1F1E9}\u{1F1F0}", name: "Denmark" },
  { code: "+358", flag: "\u{1F1EB}\u{1F1EE}", name: "Finland" },
  { code: "+43", flag: "\u{1F1E6}\u{1F1F9}", name: "Austria" },
  { code: "+41", flag: "\u{1F1E8}\u{1F1ED}", name: "Switzerland" },
  { code: "+32", flag: "\u{1F1E7}\u{1F1EA}", name: "Belgium" },
  { code: "+351", flag: "\u{1F1F5}\u{1F1F9}", name: "Portugal" },
  { code: "+353", flag: "\u{1F1EE}\u{1F1EA}", name: "Ireland" },
  { code: "+420", flag: "\u{1F1E8}\u{1F1FF}", name: "Czech Republic" },
  { code: "+421", flag: "\u{1F1F8}\u{1F1F0}", name: "Slovakia" },
  { code: "+40", flag: "\u{1F1F7}\u{1F1F4}", name: "Romania" },
  { code: "+359", flag: "\u{1F1E7}\u{1F1EC}", name: "Bulgaria" },
  { code: "+385", flag: "\u{1F1ED}\u{1F1F7}", name: "Croatia" },
  { code: "+36", flag: "\u{1F1ED}\u{1F1FA}", name: "Hungary" },
  { code: "+370", flag: "\u{1F1F1}\u{1F1F9}", name: "Lithuania" },
  { code: "+371", flag: "\u{1F1F1}\u{1F1FB}", name: "Latvia" },
  { code: "+372", flag: "\u{1F1EA}\u{1F1EA}", name: "Estonia" },
  { code: "+995", flag: "\u{1F1EC}\u{1F1EA}", name: "Georgia" },
  { code: "+994", flag: "\u{1F1E6}\u{1F1FF}", name: "Azerbaijan" },
  { code: "+374", flag: "\u{1F1E6}\u{1F1F2}", name: "Armenia" },
  { code: "+90", flag: "\u{1F1F9}\u{1F1F7}", name: "Turkey" },
  { code: "+972", flag: "\u{1F1EE}\u{1F1F1}", name: "Israel" },
  { code: "+971", flag: "\u{1F1E6}\u{1F1EA}", name: "UAE" },
  { code: "+966", flag: "\u{1F1F8}\u{1F1E6}", name: "Saudi Arabia" },
  { code: "+91", flag: "\u{1F1EE}\u{1F1F3}", name: "India" },
  { code: "+86", flag: "\u{1F1E8}\u{1F1F3}", name: "China" },
  { code: "+81", flag: "\u{1F1EF}\u{1F1F5}", name: "Japan" },
  { code: "+82", flag: "\u{1F1F0}\u{1F1F7}", name: "South Korea" },
  { code: "+61", flag: "\u{1F1E6}\u{1F1FA}", name: "Australia" },
  { code: "+64", flag: "\u{1F1F3}\u{1F1FF}", name: "New Zealand" },
  { code: "+55", flag: "\u{1F1E7}\u{1F1F7}", name: "Brazil" },
  { code: "+52", flag: "\u{1F1F2}\u{1F1FD}", name: "Mexico" },
  { code: "+57", flag: "\u{1F1E8}\u{1F1F4}", name: "Colombia" },
  { code: "+56", flag: "\u{1F1E8}\u{1F1F1}", name: "Chile" },
  { code: "+54", flag: "\u{1F1E6}\u{1F1F7}", name: "Argentina" },
  { code: "+234", flag: "\u{1F1F3}\u{1F1EC}", name: "Nigeria" },
  { code: "+27", flag: "\u{1F1FF}\u{1F1E6}", name: "South Africa" },
  { code: "+254", flag: "\u{1F1F0}\u{1F1EA}", name: "Kenya" },
  { code: "+20", flag: "\u{1F1EA}\u{1F1EC}", name: "Egypt" },
  { code: "+212", flag: "\u{1F1F2}\u{1F1E6}", name: "Morocco" },
  { code: "+65", flag: "\u{1F1F8}\u{1F1EC}", name: "Singapore" },
  { code: "+60", flag: "\u{1F1F2}\u{1F1FE}", name: "Malaysia" },
  { code: "+66", flag: "\u{1F1F9}\u{1F1ED}", name: "Thailand" },
  { code: "+84", flag: "\u{1F1FB}\u{1F1F3}", name: "Vietnam" },
  { code: "+63", flag: "\u{1F1F5}\u{1F1ED}", name: "Philippines" },
  { code: "+62", flag: "\u{1F1EE}\u{1F1E9}", name: "Indonesia" },
];

type ActiveInput = null | "phone" | "telegram" | "email";

export function Hero() {
  const [lang] = useLang();
  const [activeInput, setActiveInput] = useState<ActiveInput>(null);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+380");
  const [showCodes, setShowCodes] = useState(false);
  const [codeSearch, setCodeSearch] = useState("");
  const [telegram, setTelegram] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState<ActiveInput>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const telegramRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const s = t[lang] || t.en;

  // All demo buttons active by default — no status check needed
  const demoStatus = { call: true, telegram: true, email: true };

  useEffect(() => {
    if (activeInput === "phone" && inputRef.current) inputRef.current.focus();
    if (activeInput === "telegram" && telegramRef.current) telegramRef.current.focus();
    if (activeInput === "email" && emailRef.current) emailRef.current.focus();
  }, [activeInput]);

  useEffect(() => {
    if (showCodes && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
    if (!showCodes) setCodeSearch("");
  }, [showCodes]);

  useEffect(() => {
    if (!showCodes) return;
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCodes(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showCodes]);

  const filteredCodes = codeSearch
    ? allCountryCodes.filter(c =>
        c.name.toLowerCase().includes(codeSearch.toLowerCase()) ||
        c.code.includes(codeSearch)
      )
    : allCountryCodes;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const closeInput = () => {
    setActiveInput(null);
    setPhone("");
    setTelegram("");
    setEmail("");
    setShowCodes(false);
    setError("");
  };

  const handleSubmitPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 6) return;
    setLoading(true);
    setError("");
    try {
      const fullNumber = countryCode + phone.replace(/\s/g, "");
      const res = await fetch("https://telephonia-voice-agent-production.up.railway.app/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: fullNumber }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted("phone");
        setTimeout(() => { setSubmitted(null); closeInput(); }, 5000);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (telegram.length < 2) return;
    setLoading(true);
    setError("");
    try {
      const username = telegram.replace(/^@/, "");
      const res = await fetch("/api/demo/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted("telegram");
        setTimeout(() => { setSubmitted(null); closeInput(); }, 5000);
      } else {
        if (data.error?.includes("rate") || data.error?.includes("limit")) {
          setError(s.rateLimited);
        } else {
          setError(data.error || "Something went wrong");
        }
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || email.length < 5) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/demo/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted("email");
        setTimeout(() => { setSubmitted(null); closeInput(); }, 5000);
      } else {
        if (data.error?.includes("rate") || data.error?.includes("limit") || data.error?.includes("already")) {
          setError(s.rateLimited);
        } else {
          setError(data.error || "Something went wrong");
        }
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCountry = allCountryCodes.find(c => c.code === countryCode);

  const successMessage = submitted === "phone" ? s.callSuccess : submitted === "telegram" ? s.telegramSuccess : s.emailSuccess;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .hero-h1 { animation: fadeInUp 0.8s ease-out 0.2s both; }
        .hero-p { animation: fadeInUp 0.6s ease-out 0.5s both; }
        .hero-cta { animation: fadeInUp 0.6s ease-out 0.7s both; }
        @keyframes expandIn { from { opacity: 0; transform: scaleX(0.8); } to { opacity: 1; transform: scaleX(1); } }
        .phone-input-wrap { animation: expandIn 0.3s ease-out both; }
      `}</style>
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h1 className="hero-h1 text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[0.95] font-display">
          {s.h1_1}
          <br />
          <span className="bg-gradient-to-r from-[#ff4d4d] via-[#ff6b6b] to-[#ff8a8a] bg-clip-text text-transparent">
            {s.h1_2}
          </span>
          <br />
          {s.h1_3}
        </h1>

        <p className="hero-p text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10">
          {s.sub1}{" "}
          <span className="bg-gradient-to-r from-[#ff4d4d] via-[#ff6b6b] to-[#ff8a8a] bg-clip-text text-transparent font-medium">
            {s.sub2}
          </span>
        </p>

        <div className="hero-cta flex flex-col items-center gap-4">
          {/* Row of CTA buttons */}
          {activeInput === null && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <GlassButton
                onClick={() => demoStatus.call && setActiveInput("phone")}
                contentClassName="flex items-center gap-2"
                className={!demoStatus.call ? "opacity-40 cursor-not-allowed" : ""}
              >
                <Phone size={18} className="text-[#ff4d4d]" />
                {demoStatus.call ? s.ctaCall : "Coming soon"}
              </GlassButton>

              <GlassButton
                onClick={() => demoStatus.telegram && setActiveInput("telegram")}
                contentClassName="flex items-center gap-2"
                className={!demoStatus.telegram ? "opacity-40 cursor-not-allowed" : ""}
              >
                <MessageCircle size={18} className="text-[#ff4d4d]" />
                {demoStatus.telegram ? s.ctaTelegram : "Coming soon"}
              </GlassButton>

              <GlassButton
                onClick={() => demoStatus.email && setActiveInput("email")}
                contentClassName="flex items-center gap-2"
                className={!demoStatus.email ? "opacity-40 cursor-not-allowed" : ""}
              >
                <Mail size={18} className="text-[#ff6b6b]" />
                {demoStatus.email ? s.ctaEmail : "Coming soon"}
              </GlassButton>
            </div>
          )}

          {/* Phone input */}
          {activeInput === "phone" && (
            <form onSubmit={handleSubmitPhone} className="phone-input-wrap flex items-center gap-1 px-2 py-2 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-sm relative">
              {submitted === "phone" ? (
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-[#ff6b6b] font-medium">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  {s.callSuccess}
                </div>
              ) : (
                <>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setShowCodes(!showCodes)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm text-white/80 hover:text-white rounded-full hover:bg-white/5 transition-colors"
                    >
                      <span className="text-base">{selectedCountry?.flag}</span>
                      <span className="font-medium">{countryCode}</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white/30"><polyline points="6 9 12 15 18 9"/></svg>
                    </button>

                    {showCodes && (
                      <div className="absolute bottom-full left-0 mb-2 bg-[rgba(12,12,18,0.98)] border border-white/10 rounded-2xl backdrop-blur-xl z-50 w-[260px] shadow-2xl shadow-black/50 overflow-hidden">
                        <div className="p-2 border-b border-white/5">
                          <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/30 flex-shrink-0">
                              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            <input
                              ref={searchRef}
                              type="text"
                              value={codeSearch}
                              onChange={(e) => setCodeSearch(e.target.value)}
                              placeholder={s.searchPlaceholder}
                              className="bg-transparent text-white placeholder-white/30 text-sm outline-none w-full"
                            />
                          </div>
                        </div>
                        <div className="max-h-[240px] overflow-y-auto overscroll-contain py-1">
                          {filteredCodes.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-white/30 text-center">No results</div>
                          ) : (
                            filteredCodes.map(c => (
                              <button
                                key={c.code + c.name}
                                type="button"
                                onClick={() => { setCountryCode(c.code); setShowCodes(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                                  countryCode === c.code
                                    ? 'bg-[#ff4d4d]/10 text-[#ff4d4d]'
                                    : 'text-white/70 hover:bg-white/5'
                                }`}
                              >
                                <span className="text-base">{c.flag}</span>
                                <span className="flex-1 text-left">{c.name}</span>
                                <span className="text-white/30 text-xs font-mono">{c.code}</span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <input
                    ref={inputRef}
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="__ ___ ____"
                    className="bg-transparent text-white placeholder-white/30 text-sm py-2 outline-none w-28 md:w-36"
                  />

                  <button
                    type="submit"
                    disabled={phone.length < 6 || loading}
                    className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-[#ff4d4d] hover:bg-[#ff4d4d]/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 whitespace-nowrap"
                  >
                    {loading ? "..." : s.callBtn}
                  </button>

                  <button
                    type="button"
                    onClick={closeInput}
                    className="p-2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  {error && <p className="absolute -bottom-8 left-0 right-0 text-xs text-red-400">{error}</p>}
                </>
              )}
            </form>
          )}

          {/* Telegram input */}
          {activeInput === "telegram" && (
            <form onSubmit={handleSubmitTelegram} className="phone-input-wrap flex items-center gap-1 px-2 py-2 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-sm relative">
              {submitted === "telegram" ? (
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-[#ff4d4d] font-medium">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  {s.telegramSuccess}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1 px-3 py-2 text-white/50 text-sm">
                    <MessageCircle size={16} className="text-[#ff4d4d]" />
                    <span className="font-medium">@</span>
                  </div>

                  <input
                    ref={telegramRef}
                    type="text"
                    value={telegram}
                    onChange={(e) => setTelegram(e.target.value.replace(/\s/g, ""))}
                    placeholder={s.telegramPlaceholder}
                    className="bg-transparent text-white placeholder-white/30 text-sm py-2 outline-none w-36 md:w-44"
                  />

                  <button
                    type="submit"
                    disabled={telegram.length < 2 || loading}
                    className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-[#ff4d4d] hover:bg-[#ff4d4d]/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 whitespace-nowrap"
                  >
                    {loading ? "..." : s.telegramBtn}
                  </button>

                  <button
                    type="button"
                    onClick={closeInput}
                    className="p-2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  {error && <p className="absolute -bottom-8 left-0 right-0 text-xs text-red-400">{error}</p>}
                </>
              )}
            </form>
          )}

          {/* Email input */}
          {activeInput === "email" && (
            <form onSubmit={handleSubmitEmail} className="phone-input-wrap flex items-center gap-1 px-2 py-2 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-sm relative">
              {submitted === "email" ? (
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-[#ff6b6b] font-medium">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  {s.emailSuccess}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1 px-3 py-2 text-white/50 text-sm">
                    <Mail size={16} className="text-[#ff6b6b]" />
                  </div>

                  <input
                    ref={emailRef}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={s.emailPlaceholder}
                    className="bg-transparent text-white placeholder-white/30 text-sm py-2 outline-none w-44 md:w-56"
                  />

                  <button
                    type="submit"
                    disabled={!email.includes("@") || email.length < 5 || loading}
                    className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-[#ff6b6b] hover:bg-[#ff6b6b]/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 whitespace-nowrap"
                  >
                    {loading ? "..." : s.emailBtn}
                  </button>

                  <button
                    type="button"
                    onClick={closeInput}
                    className="p-2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                  {error && <p className="absolute -bottom-8 left-0 right-0 text-xs text-red-400">{error}</p>}
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
