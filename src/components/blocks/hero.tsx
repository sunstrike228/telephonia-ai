"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useLang } from "@/hooks/use-lang";
import { GlassButton } from "@/components/ui/glass-button";

const t = {
  en: {
    h1_1: "AI agents that",
    h1_2: "sound human.",
    h1_3: "Sell like pros.",
    sub1: "Replace your cold-calling team with AI voice agents indistinguishable from real humans.",
    sub2: "Never sleep. Sell like pros. Affordable pricing.",
    cta1: "Contact us",
    cta2: "Request a test call",
    callBtn: "Call me",
    callSuccess: "You'll receive a call within a minute!",
    searchPlaceholder: "Search country...",
  },
  ua: {
    h1_1: "ШІ-агенти, яких",
    h1_2: "не відрізнити.",
    h1_3: "Продають як профі.",
    sub1: "Замініть команду холодних дзвінків на ШІ-агентів, яких не відрізнити від живих людей.",
    sub2: "Не сплять. Продають як профі. Доступний прайс.",
    cta1: "Зв'язатися з нами",
    cta2: "Замовити тестовий дзвінок",
    callBtn: "Зателефонувати",
    callSuccess: "Дзвінок надійде протягом хвилини!",
    searchPlaceholder: "Пошук країни...",
  },
};

const allCountryCodes = [
  { code: "+380", flag: "🇺🇦", name: "Ukraine" },
  { code: "+1", flag: "🇺🇸", name: "USA" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+49", flag: "🇩🇪", name: "Germany" },
  { code: "+48", flag: "🇵🇱", name: "Poland" },
  { code: "+33", flag: "🇫🇷", name: "France" },
  { code: "+34", flag: "🇪🇸", name: "Spain" },
  { code: "+39", flag: "🇮🇹", name: "Italy" },
  { code: "+31", flag: "🇳🇱", name: "Netherlands" },
  { code: "+46", flag: "🇸🇪", name: "Sweden" },
  { code: "+47", flag: "🇳🇴", name: "Norway" },
  { code: "+45", flag: "🇩🇰", name: "Denmark" },
  { code: "+358", flag: "🇫🇮", name: "Finland" },
  { code: "+43", flag: "🇦🇹", name: "Austria" },
  { code: "+41", flag: "🇨🇭", name: "Switzerland" },
  { code: "+32", flag: "🇧🇪", name: "Belgium" },
  { code: "+351", flag: "🇵🇹", name: "Portugal" },
  { code: "+353", flag: "🇮🇪", name: "Ireland" },
  { code: "+420", flag: "🇨🇿", name: "Czech Republic" },
  { code: "+421", flag: "🇸🇰", name: "Slovakia" },
  { code: "+40", flag: "🇷🇴", name: "Romania" },
  { code: "+359", flag: "🇧🇬", name: "Bulgaria" },
  { code: "+385", flag: "🇭🇷", name: "Croatia" },
  { code: "+36", flag: "🇭🇺", name: "Hungary" },
  { code: "+370", flag: "🇱🇹", name: "Lithuania" },
  { code: "+371", flag: "🇱🇻", name: "Latvia" },
  { code: "+372", flag: "🇪🇪", name: "Estonia" },
  { code: "+995", flag: "🇬🇪", name: "Georgia" },
  { code: "+994", flag: "🇦🇿", name: "Azerbaijan" },
  { code: "+374", flag: "🇦🇲", name: "Armenia" },
  { code: "+90", flag: "🇹🇷", name: "Turkey" },
  { code: "+972", flag: "🇮🇱", name: "Israel" },
  { code: "+971", flag: "🇦🇪", name: "UAE" },
  { code: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+86", flag: "🇨🇳", name: "China" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
  { code: "+82", flag: "🇰🇷", name: "South Korea" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+64", flag: "🇳🇿", name: "New Zealand" },
  { code: "+55", flag: "🇧🇷", name: "Brazil" },
  { code: "+52", flag: "🇲🇽", name: "Mexico" },
  { code: "+57", flag: "🇨🇴", name: "Colombia" },
  { code: "+56", flag: "🇨🇱", name: "Chile" },
  { code: "+54", flag: "🇦🇷", name: "Argentina" },
  { code: "+234", flag: "🇳🇬", name: "Nigeria" },
  { code: "+27", flag: "🇿🇦", name: "South Africa" },
  { code: "+254", flag: "🇰🇪", name: "Kenya" },
  { code: "+20", flag: "🇪🇬", name: "Egypt" },
  { code: "+212", flag: "🇲🇦", name: "Morocco" },
  { code: "+65", flag: "🇸🇬", name: "Singapore" },
  { code: "+60", flag: "🇲🇾", name: "Malaysia" },
  { code: "+66", flag: "🇹🇭", name: "Thailand" },
  { code: "+84", flag: "🇻🇳", name: "Vietnam" },
  { code: "+63", flag: "🇵🇭", name: "Philippines" },
  { code: "+62", flag: "🇮🇩", name: "Indonesia" },
];

export function Hero() {
  const [lang] = useLang();
  const [showPhone, setShowPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+380");
  const [showCodes, setShowCodes] = useState(false);
  const [codeSearch, setCodeSearch] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const s = t[lang];

  useEffect(() => {
    if (showPhone && inputRef.current) inputRef.current.focus();
  }, [showPhone]);

  // Focus search when dropdown opens
  useEffect(() => {
    if (showCodes && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
    if (!showCodes) setCodeSearch("");
  }, [showCodes]);

  // Close dropdown on outside click
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

  const handleSubmitPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 6) {
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setShowPhone(false); setPhone(""); }, 4000);
    }
  };

  const selectedCountry = allCountryCodes.find(c => c.code === countryCode);

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

        <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
          <GlassButton href="#cta" className="glass-button-primary" contentClassName="flex items-center gap-2">
            {s.cta1}
          </GlassButton>

          {!showPhone ? (
            <GlassButton onClick={() => setShowPhone(true)} contentClassName="flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0090f0]">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              {s.cta2}
            </GlassButton>
          ) : (
            <form onSubmit={handleSubmitPhone} className="phone-input-wrap flex items-center gap-1 px-2 py-2 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-sm">
              {submitted ? (
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-[#34d399] font-medium">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  {s.callSuccess}
                </div>
              ) : (
                <>
                  {/* Country code selector */}
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
                        {/* Search */}
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

                        {/* Country list */}
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

                  {/* Phone input */}
                  <input
                    ref={inputRef}
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="__ ___ ____"
                    className="bg-transparent text-white placeholder-white/30 text-sm py-2 outline-none w-28 md:w-36"
                  />

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={phone.length < 6}
                    className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-[#0090f0] hover:bg-[#0090f0]/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
                  >
                    {s.callBtn}
                  </button>

                  {/* Close */}
                  <button
                    type="button"
                    onClick={() => { setShowPhone(false); setPhone(""); setShowCodes(false); }}
                    className="p-2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
