"use client";

import { useState, useRef, useEffect } from "react";

export function Hero() {
  const [showPhone, setShowPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showPhone && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showPhone]);

  const handleSubmitPhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setShowPhone(false);
        setPhone("");
      }, 4000);
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-h1 { animation: fadeInUp 0.8s ease-out 0.2s both; }
        .hero-p { animation: fadeInUp 0.6s ease-out 0.5s both; }
        .hero-cta { animation: fadeInUp 0.6s ease-out 0.7s both; }
        @keyframes expandIn {
          from { opacity: 0; transform: scaleX(0.8); }
          to { opacity: 1; transform: scaleX(1); }
        }
        .phone-input-wrap { animation: expandIn 0.3s ease-out both; }
      `}</style>
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h1 className="hero-h1 text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[0.95] font-display">
          AI agents that
          <br />
          <span className="bg-gradient-to-r from-[#36adff] via-[#78c8ff] to-[#a78bfa] bg-clip-text text-transparent">
            sound human.
          </span>
          <br />
          Sell like pros.
        </h1>

        <p className="hero-p text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10">
          Замініть команду холодних дзвінків на ШІ-агентів, яких не відрізнити від живих людей. Не сплять. Продають як профі. Доступний прайс.
        </p>

        <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#cta"
            className="group relative overflow-hidden px-8 py-4 rounded-full text-base font-semibold text-white bg-[rgba(0,144,240,0.15)] border border-[rgba(0,144,240,0.25)] backdrop-blur-sm hover:bg-[rgba(0,144,240,0.25)] hover:scale-[1.04] active:scale-[0.97] transition-all duration-300"
          >
            Зв&apos;язатися з нами
          </a>

          {!showPhone ? (
            <button
              onClick={() => setShowPhone(true)}
              className="group relative overflow-hidden px-8 py-4 rounded-full text-base font-medium text-white/80 bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:bg-white/[0.08] hover:scale-[1.04] active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-3"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#0090f0]">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              Замовити тестовий дзвінок
            </button>
          ) : (
            <form
              onSubmit={handleSubmitPhone}
              className="phone-input-wrap flex items-center gap-2 px-2 py-2 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-sm"
            >
              {submitted ? (
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-[#34d399] font-medium">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  Дзвінок надійде протягом хвилини!
                </div>
              ) : (
                <>
                  <input
                    ref={inputRef}
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+380 __ ___ ____"
                    className="bg-transparent text-white placeholder-white/30 text-sm px-4 py-2 outline-none w-44 md:w-52"
                  />
                  <button
                    type="submit"
                    disabled={phone.length < 10}
                    className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-[#0090f0] hover:bg-[#0090f0]/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 whitespace-nowrap"
                  >
                    Зателефонувати
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowPhone(false); setPhone(""); }}
                    className="p-2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
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
