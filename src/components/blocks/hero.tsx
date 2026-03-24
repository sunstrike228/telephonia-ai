"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLang } from "@/hooks/use-lang";
import { GlassButton } from "@/components/ui/glass-button";
import { Phone, MessageCircle, Mail } from "lucide-react";

const t = {
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
  const s = t[lang];

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
      const res = await fetch("https://telephonia-telegram-worker-production.up.railway.app/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          message: "Hey! This is a demo message from Telephonia.ai \u{1F916}\n\nThis is what AI outreach on Telegram looks like. Natural, conversational, and personalized to each lead.\n\nWant to see more? Visit https://telephonia.ai",
        }),
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
          <span className="bg-gradient-to-r from-[#36adff] via-[#78c8ff] to-[#a78bfa] bg-clip-text text-transparent">
            {s.h1_2}
          </span>
          <br />
          {s.h1_3}
        </h1>

        <p className="hero-p text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10">
          {s.sub1}{" "}
          <span className="bg-gradient-to-r from-[#36adff] via-[#78c8ff] to-[#a78bfa] bg-clip-text text-transparent font-medium">
            {s.sub2}
          </span>
        </p>

        <div className="hero-cta flex flex-col items-center gap-4">
          {/* Row of CTA buttons */}
          {activeInput === null && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <GlassButton onClick={() => setActiveInput("phone")} contentClassName="flex items-center gap-2">
                <Phone size={18} className="text-[#0090f0]" />
                {s.ctaCall}
              </GlassButton>

              <GlassButton onClick={() => setActiveInput("telegram")} contentClassName="flex items-center gap-2">
                <MessageCircle size={18} className="text-[#a78bfa]" />
                {s.ctaTelegram}
              </GlassButton>

              <GlassButton onClick={() => setActiveInput("email")} contentClassName="flex items-center gap-2">
                <Mail size={18} className="text-[#34d399]" />
                {s.ctaEmail}
              </GlassButton>
            </div>
          )}

          {/* Phone input */}
          {activeInput === "phone" && (
            <form onSubmit={handleSubmitPhone} className="phone-input-wrap flex items-center gap-1 px-2 py-2 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-sm relative">
              {submitted === "phone" ? (
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-[#34d399] font-medium">
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
                                    ? 'bg-[#0090f0]/10 text-[#36adff]'
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
                    className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-[#0090f0] hover:bg-[#0090f0]/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 whitespace-nowrap"
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
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-[#a78bfa] font-medium">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  {s.telegramSuccess}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1 px-3 py-2 text-white/50 text-sm">
                    <MessageCircle size={16} className="text-[#a78bfa]" />
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
                    className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-[#a78bfa] hover:bg-[#a78bfa]/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 whitespace-nowrap"
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
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-[#34d399] font-medium">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  {s.emailSuccess}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1 px-3 py-2 text-white/50 text-sm">
                    <Mail size={16} className="text-[#34d399]" />
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
                    className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-[#34d399] hover:bg-[#34d399]/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 whitespace-nowrap"
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
