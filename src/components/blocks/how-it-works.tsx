"use client";

import { useInView } from "@/hooks/use-in-view";
import { useLang } from "@/hooks/use-lang";
import { FlippingCard } from "@/components/ui/flipping-card";
import { Upload, Users, Rocket } from "lucide-react";

const steps = [
  {
    num: "1",
    color: "#0090f0",
    icon: Upload,
    title: "Upload Script & Choose Channels",
    titleUa: "Завантажте скрипт та оберіть канали",
    desc: "Paste your sales script, select channels — voice calls, Telegram, email — or all three. Our AI adapts to your industry and tone.",
    descUa: "Вставте свій скрипт продажів, оберіть канали — голосові дзвінки, Telegram, email — або всі три. Наш AI адаптується до вашої галузі та тону.",
    backDesc: "Our AI analyzes your script structure, identifies key selling points, and automatically generates natural conversation flows for each channel — voice, Telegram, and email — with objection handling built in.",
    backDescUa: "Наш AI аналізує структуру скрипту, визначає ключові переваги та автоматично генерує природні потоки комунікації для кожного каналу — голос, Telegram та email — із вбудованою обробкою заперечень.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=220&fit=crop",
  },
  {
    num: "2",
    color: "#a78bfa",
    icon: Users,
    title: "Import Leads",
    titleUa: "Імпортуйте ліди",
    desc: "Upload a CSV with phone numbers, email addresses, and Telegram usernames. Map fields automatically.",
    descUa: "Завантажте CSV з номерами телефонів, email-адресами та username Telegram. Поля мапляться автоматично.",
    backDesc: "Supports CSV, Excel, or direct CRM import. Auto-detects phone, email, and Telegram fields. Deduplicates contacts, validates data, and segments leads by channel availability.",
    backDescUa: "Підтримує CSV, Excel або прямий імпорт з CRM. Автоматично визначає поля телефону, email та Telegram. Дедуплікація контактів, валідація даних та сегментація лідів за доступністю каналів.",
    image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=400&h=220&fit=crop",
  },
  {
    num: "3",
    color: "#34d399",
    icon: Rocket,
    title: "Launch & Monitor",
    titleUa: "Запускайте та контролюйте",
    desc: "Go live across all channels simultaneously. Monitor calls, messages, and emails in one real-time dashboard.",
    descUa: "Запустіть всі канали одночасно. Відстежуйте дзвінки, повідомлення та листи в одній панелі реального часу.",
    backDesc: "Cross-channel dashboard shows live calls, Telegram conversations, and email opens side by side. A/B test different scripts per channel. Auto-fallback between channels if no response.",
    backDescUa: "Кросс-канальна панель показує живі дзвінки, розмови в Telegram та відкриття email поруч. A/B тестування різних скриптів по каналах. Автоматичний перехід між каналами при відсутності відповіді.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=220&fit=crop",
  },
];

export function HowItWorks() {
  const { ref, isInView } = useInView();
  const v = isInView ? "reveal-visible" : "";
  const [lang] = useLang();
  const ua = lang === "ua";

  return (
    <section className="relative py-32 overflow-hidden" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className={`reveal-hidden ${v} text-center mb-20`}>
          <span className="text-[#0090f0] text-sm font-semibold uppercase tracking-widest">
            {ua ? "Як це працює" : "How it works"}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 font-display tracking-tight">
            {ua ? "Запуск за 3 кроки" : "Live in 3 steps"}
          </h2>
          <p className="text-white/40 mt-4 text-sm">
            {ua ? "Наведіть мишкою на карточку щоб дізнатись більше" : "Hover over a card to learn more"}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className={`reveal-hidden ${v}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <FlippingCard
                  width={340}
                  height={380}
                  frontContent={
                    <div className="flex flex-col h-full p-5">
                      <img
                        src={s.image}
                        alt={ua ? s.titleUa : s.title}
                        className="w-full h-40 object-cover rounded-xl"
                      />
                      <div className="mt-4 flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${s.color}18`, border: `1px solid ${s.color}35` }}
                        >
                          <span className="text-base font-bold font-display" style={{ color: s.color }}>
                            {s.num}
                          </span>
                        </div>
                        <h3 className="font-display text-lg font-semibold text-white">
                          {ua ? s.titleUa : s.title}
                        </h3>
                      </div>
                      <p className="text-white/50 text-sm mt-3 leading-relaxed">
                        {ua ? s.descUa : s.desc}
                      </p>
                    </div>
                  }
                  backContent={
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                        style={{ background: `${s.color}15`, border: `1px solid ${s.color}30` }}
                      >
                        <Icon size={28} stroke={s.color} />
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {ua ? s.backDescUa : s.backDesc}
                      </p>
                    </div>
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
