"use client";

import { Tilt } from "@/components/ui/tilt";
import { Spotlight } from "@/components/ui/spotlight";
import { useInView } from "@/hooks/use-in-view";
import { useLang } from "@/hooks/use-lang";

const steps = [
  { num: "1", color: "#0090f0", title: "Upload Your Script", titleUa: "Завантажте свій скрипт", desc: "Paste your sales script or describe your use case. Our AI adapts to your industry and tone.", descUa: "Вставте свій скрипт продажів або опишіть ваш кейс. Наш AI адаптується до вашої галузі та тону." },
  { num: "2", color: "#a78bfa", title: "Choose Voice & Language", titleUa: "Оберіть голос та мову", desc: "Pick from our voice library or clone your own. Set primary language and fallback behavior.", descUa: "Оберіть з нашої бібліотеки голосів або клонуйте свій. Налаштуйте основну мову та резервну поведінку." },
  { num: "3", color: "#34d399", title: "Launch & Monitor", titleUa: "Запускайте та контролюйте", desc: "Connect your phone number, upload leads, and go live. Watch calls happen in real time from your dashboard.", descUa: "Підключіть номер телефону, завантажте ліди та запустіть. Спостерігайте за дзвінками в реальному часі з вашої панелі." },
];

export function HowItWorks() {
  const { ref, isInView } = useInView();
  const v = isInView ? 'reveal-visible' : '';
  const [lang] = useLang();
  const ua = lang === "ua";

  return (
    <section className="relative py-32 overflow-hidden" ref={ref}>
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div className={`reveal-hidden ${v} text-center mb-20`}>
          <span className="text-[#0090f0] text-sm font-semibold uppercase tracking-widest">{ua ? "Як це працює" : "How it works"}</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 font-display tracking-tight">{ua ? "Запуск за 3 кроки" : "Live in 3 steps"}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className={`reveal-hidden ${v}`} style={{ transitionDelay: `${i * 150}ms` }}>
              <Tilt rotationFactor={6} isRevese className="h-full">
                <div className="relative rounded-2xl border border-white/10 bg-[rgba(16,16,24,0.94)] p-8 overflow-hidden h-full group hover:border-white/18 transition-colors">
                  <Spotlight size={200} />
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-5" style={{ background: `${s.color}18`, border: `1px solid ${s.color}35` }}>
                    <span className="text-lg font-bold font-display" style={{ color: s.color }}>{s.num}</span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-white mb-3">{ua ? s.titleUa : s.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{ua ? s.descUa : s.desc}</p>
                </div>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
