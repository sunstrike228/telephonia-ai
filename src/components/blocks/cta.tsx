"use client";

import { useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useLang } from "@/hooks/use-lang";
import { GlassButton } from "@/components/ui/glass-button";

export function CTA() {
  const [submitted, setSubmitted] = useState(false);
  const { ref, isInView } = useInView();
  const v = isInView ? 'reveal-visible' : '';
  const [lang] = useLang();
  const ua = lang === "ua";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="cta" className="relative min-h-[60vh] flex items-center overflow-hidden" ref={ref}>
      <div className={`reveal-hidden ${v} max-w-2xl mx-auto px-6 relative z-10 text-center`}>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 font-display tracking-tight">
          {ua ? <>Готові замінити<br />телефонну команду?</> : <>Ready to replace<br />your phone team?</>}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email"
            required
            placeholder="your@email.com"
            className="flex-1 px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#0090f0] focus:ring-1 focus:ring-[#0090f0]/30 transition-colors"
          />
          <GlassButton type="submit" className="glass-button-primary" size="sm">
            {submitted ? "Дякуємо!" : (ua ? "Отримати доступ" : "Get access")}
          </GlassButton>
        </form>
        <p className="text-white/20 text-xs mt-4">
          {ua ? "Ми зв\u0027яжемося протягом 24 годин." : "We\u0027ll reach out within 24 hours."}
        </p>
      </div>
    </section>
  );
}
