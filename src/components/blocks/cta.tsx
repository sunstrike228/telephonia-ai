"use client";

import { useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useLang, type Lang } from "@/hooks/use-lang";
import { GlassButton } from "@/components/ui/glass-button";

const t: Record<Lang, { h2_1: string; h2_2: string; btn: string; thanks: string; desc: string }> = {
  en: {
    h2_1: "Ready to automate",
    h2_2: "your outreach?",
    btn: "Get access",
    thanks: "Thank you!",
    desc: "Our manager will contact you, provide a consultation, and schedule a call if needed.",
  },
  ua: {
    h2_1: "Готові автоматизувати",
    h2_2: "ваш аутріч?",
    btn: "Отримати доступ",
    thanks: "Дякуємо!",
    desc: "Наш менеджер зв\u0027яжеться з вами, проконсультує та за потреби призначить дзвінок.",
  },
  de: {
    h2_1: "Bereit, Ihren",
    h2_2: "Outreach zu automatisieren?",
    btn: "Zugang erhalten",
    thanks: "Danke!",
    desc: "Unser Manager wird Sie kontaktieren, beraten und bei Bedarf einen Anruf vereinbaren.",
  },
  fr: {
    h2_1: "Prêt à automatiser",
    h2_2: "votre prospection ?",
    btn: "Obtenir l'accès",
    thanks: "Merci !",
    desc: "Notre manager vous contactera, vous conseillera et planifiera un appel si nécessaire.",
  },
  es: {
    h2_1: "¿Listo para automatizar",
    h2_2: "su prospección?",
    btn: "Obtener acceso",
    thanks: "¡Gracias!",
    desc: "Nuestro gerente se pondrá en contacto, le brindará una consulta y programará una llamada si es necesario.",
  },
  pl: {
    h2_1: "Gotowy zautomatyzować",
    h2_2: "swój outreach?",
    btn: "Uzyskaj dostęp",
    thanks: "Dziękujemy!",
    desc: "Nasz manager skontaktuje się z Tobą, doradzi i w razie potrzeby umówi rozmowę.",
  },
  pt: {
    h2_1: "Pronto para automatizar",
    h2_2: "sua prospecção?",
    btn: "Obter acesso",
    thanks: "Obrigado!",
    desc: "Nosso gerente entrará em contato, fornecerá uma consultoria e agendará uma ligação se necessário.",
  },
  ja: {
    h2_1: "アウトリーチを",
    h2_2: "自動化する準備はできましたか？",
    btn: "アクセスを取得",
    thanks: "ありがとうございます！",
    desc: "マネージャーがご連絡し、コンサルティングを行い、必要に応じて通話を予約します。",
  },
};

export function CTA() {
  const [submitted, setSubmitted] = useState(false);
  const { ref, isInView } = useInView();
  const v = isInView ? 'reveal-visible' : '';
  const [lang] = useLang();
  const s = t[lang] || t.en;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section id="cta" className="relative min-h-[60vh] flex items-center overflow-hidden -mt-32" ref={ref}>
      <div className={`reveal-hidden ${v} max-w-2xl mx-auto px-6 relative z-10 text-center`}>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-10 font-display tracking-tight">
          {s.h2_1}<br />{s.h2_2}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email"
            required
            placeholder="your@email.com"
            className="flex-1 px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#ff4d4d] focus:ring-1 focus:ring-[#ff4d4d]/30 transition-colors"
          />
          <GlassButton type="submit" className="glass-button-primary" size="sm">
            {submitted ? s.thanks : s.btn}
          </GlassButton>
        </form>
        <p className="text-white/50 text-sm mt-6">
          {s.desc}
        </p>
      </div>
    </section>
  );
}
