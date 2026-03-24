"use client";

import { useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useLang } from "@/hooks/use-lang";

const faqs = [
  { q: "Can people tell it's not a real person?", qUa: "Чи можуть люди зрозуміти, що це не справжня людина?", a: "In blind tests, 98% of listeners couldn't distinguish our AI agents from human callers. We use state-of-the-art voice synthesis with natural pauses, filler words, and emotional intonation.", aUa: "У сліпих тестах 98% слухачів не змогли відрізнити наших AI-агентів від людей. Ми використовуємо найсучасніший синтез голосу з природними паузами, словами-заповнювачами та емоційною інтонацією." },
  { q: "What languages do you support?", qUa: "Які мови ви підтримуєте?", a: "Ukrainian and English — both spoken natively. The agent can switch languages mid-conversation if the caller prefers a different language.", aUa: "Українську та англійську — обидві як рідні. Агент може переключати мови посеред розмови, якщо співрозмовник надає перевагу іншій мові." },
  { q: "How does Telegram outreach work?", qUa: "Як працює аутріч в Telegram?", a: "Our AI agents message leads from real Telegram accounts with personalized, natural conversations. They handle replies, answer questions, and qualify leads — just like a human SDR would. No bots, no spam vibes.", aUa: "Наші AI-агенти пишуть лідам з реальних акаунтів Telegram персоналізовані, природні повідомлення. Вони обробляють відповіді, відповідають на питання та кваліфікують лідів — як живий SDR. Жодних ботів, жодного спаму." },
  { q: "Can I use all channels in one campaign?", qUa: "Чи можу я використовувати всі канали в одній кампанії?", a: "Absolutely. Set up multi-channel sequences — for example, start with a Telegram message, follow up with a call if no reply within 24h, then send an email. Priority and fallback rules are fully customizable.", aUa: "Звичайно. Налаштуйте мульти-канальні послідовності — наприклад, почніть з повідомлення в Telegram, зателефонуйте якщо немає відповіді протягом 24 годин, потім надішліть email. Правила пріоритету та фолбеку повністю налаштовуються." },
  { q: "How fast does the AI respond?", qUa: "Як швидко відповідає AI?", a: "Under 0.5 second end-to-end latency for voice calls. Telegram and email responses are generated instantly and sent according to your configured schedule to feel natural.", aUa: "Менше 0.5 секунди наскрізної затримки для голосових дзвінків. Відповіді в Telegram та email генеруються миттєво та надсилаються відповідно до налаштованого графіку, щоб виглядати природно." },
  { q: "Can I use my own phone number?", qUa: "Чи можу я використовувати свій номер телефону?", a: "Yes. Port your existing number or get new ones from us. We support Ukrainian, European and US phone numbers via SIP trunking.", aUa: "Так. Перенесіть свій існуючий номер або отримайте нові від нас. Ми підтримуємо українські, європейські та американські номери через SIP-транкінг." },
  { q: "Is it legal to use AI for calls?", qUa: "Чи законно використовувати AI для дзвінків?", a: "Yes, when used in compliance with local regulations. We help you stay compliant with disclosure requirements and do-not-call lists. Enterprise plans include a compliance consultation.", aUa: "Так, при дотриманні місцевих нормативних актів. Ми допоможемо вам відповідати вимогам розкриття інформації та спискам заборонених дзвінків. Корпоративні плани включають консультацію з комплаєнсу." },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, isInView } = useInView();
  const v = isInView ? 'reveal-visible' : '';
  const [lang] = useLang();
  const ua = lang === "ua";

  return (
    <section id="faq" className="relative py-32 overflow-hidden" ref={ref}>
      <style>{`
        .faq-answer { max-height: 0; opacity: 0; overflow: hidden; transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease; padding-bottom: 0; }
        .faq-answer.open { max-height: 200px; opacity: 1; padding-bottom: 24px; }
        .faq-chevron { transition: transform 0.3s ease; }
        .faq-chevron.open { transform: rotate(180deg); }
      `}</style>
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div className={`reveal-hidden ${v} text-center mb-16`}>
          <span className="text-[#ff4d4d] text-sm font-semibold uppercase tracking-widest">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 font-display tracking-tight">{ua ? "Питання та відповіді" : "Questions & Answers"}</h2>
        </div>

        <div className={`reveal-hidden ${v}`} style={{ transitionDelay: '200ms' }}>
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-white/8 cursor-pointer" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
              <div className="flex items-center justify-between py-6">
                <h3 className="text-base font-medium text-white pr-8">{ua ? faq.qUa : faq.q}</h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`w-5 h-5 text-white/30 flex-shrink-0 faq-chevron ${openIndex === i ? 'open' : ''}`}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <div className={`faq-answer ${openIndex === i ? 'open' : ''}`}>
                <p className="text-sm text-white/55">{ua ? faq.aUa : faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
