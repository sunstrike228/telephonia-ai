"use client";

import { Tilt } from "@/components/ui/tilt";
import { Spotlight } from "@/components/ui/spotlight";
import { Phone, MessageCircle, Mail, Layers, BarChart3, Monitor } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { useLang } from "@/hooks/use-lang";

const features = [
  { icon: Phone, color: "#ff4d4d", title: "AI Voice Calls", titleUa: "AI-голосові дзвінки", desc: "AI agents call your leads, qualify them, handle objections and book meetings at scale. Hundreds of simultaneous calls, zero burnout.", descUa: "AI-агенти дзвонять вашим лідам, кваліфікують їх, обробляють заперечення та бронюють зустрічі масштабно. Сотні одночасних дзвінків, нуль вигорання." },
  { icon: MessageCircle, color: "#ff4d4d", title: "Telegram Outreach", titleUa: "Аутріч в Telegram", desc: "AI agents message your leads on Telegram from real accounts. Natural conversations, not bots.", descUa: "AI-агенти пишуть вашим лідам в Telegram з реальних акаунтів. Природні розмови, а не боти." },
  { icon: Mail, color: "#34d399", title: "Email Campaigns", titleUa: "Email-кампанії", desc: "AI-generated personalized emails. Follow-up sequences. Track opens and replies.", descUa: "AI-генеровані персоналізовані листи. Ланцюжки follow-up. Відстежуйте відкриття та відповіді." },
  { icon: Layers, color: "#f97316", title: "Multi-Channel Orchestration", titleUa: "Мульти-канальна оркестрація", desc: "Set channel priority. If no reply on Telegram, auto-fallback to call, then email.", descUa: "Встановіть пріоритет каналів. Якщо немає відповіді в Telegram, автоматичний перехід на дзвінок, потім email." },
  { icon: BarChart3, color: "#fbbf24", title: "Real-Time Analytics", titleUa: "Аналітика в реальному часі", desc: "Every interaction transcribed, scored, and analyzed. See conversion rates, objection patterns, and sentiment live in your dashboard.", descUa: "Кожна взаємодія транскрибована, оцінена та проаналізована. Конверсії, патерни заперечень та настрої - наживо у вашій панелі." },
  { icon: Monitor, color: "#fb7185", title: "CRM Integration", titleUa: "Інтеграція з CRM", desc: "Plug into your existing stack. HubSpot, Salesforce, Pipedrive, Close - data flows directly into your pipeline.", descUa: "Підключайтесь до вашого стеку. HubSpot, Salesforce, Pipedrive, Close - дані надходять прямо у ваш pipeline." },
];

export function Features() {
  const { ref, isInView } = useInView();
  const v = isInView ? 'reveal-visible' : '';
  const [lang] = useLang();
  const ua = lang === "ua";

  return (
    <section id="features" className="relative py-32 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className={`reveal-hidden ${v} text-center mb-20`}>
          <span className="text-[#ff4d4d] text-sm font-semibold uppercase tracking-widest">{ua ? "Що ми робимо" : "What we do"}</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 font-display tracking-tight">
            {ua ? <>Одна платформа.<br />Кожен канал опрацьований.</> : <>One platform.<br />Every channel covered.</>}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`reveal-hidden ${v}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <Tilt rotationFactor={6} isRevese className="h-full">
                  <div className="relative rounded-2xl border border-white/10 bg-[rgba(18,18,26,0.95)] p-8 h-full overflow-hidden group hover:border-[rgba(0,144,240,0.3)] transition-colors duration-300">
                    <Spotlight size={200} />
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                      <Icon size={24} stroke={f.color} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 font-display">{ua ? f.titleUa : f.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{ua ? f.descUa : f.desc}</p>
                  </div>
                </Tilt>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
