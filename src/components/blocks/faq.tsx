"use client";

import { useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useLang, type Lang } from "@/hooks/use-lang";

interface FaqItem {
  q: Record<Lang, string>;
  a: Record<Lang, string>;
}

const faqs: FaqItem[] = [
  {
    q: {
      en: "Can people tell it's not a real person?",
      ua: "Чи можуть люди зрозуміти, що це не справжня людина?",
      de: "Können Menschen erkennen, dass es keine echte Person ist?",
      fr: "Les gens peuvent-ils se rendre compte que ce n'est pas une vraie personne ?",
      es: "¿Pueden las personas darse cuenta de que no es una persona real?",
      pl: "Czy ludzie mogą rozpoznać, że to nie prawdziwa osoba?",
      pt: "As pessoas conseguem perceber que não é uma pessoa real?",
      ja: "本物の人間ではないと気づかれますか？",
    },
    a: {
      en: "In blind tests, 98% of listeners couldn't distinguish our AI agents from human callers. We use state-of-the-art voice synthesis with natural pauses, filler words, and emotional intonation.",
      ua: "У сліпих тестах 98% слухачів не змогли відрізнити наших AI-агентів від людей. Ми використовуємо найсучасніший синтез голосу з природними паузами, словами-заповнювачами та емоційною інтонацією.",
      de: "In Blindtests konnten 98% der Zuhörer unsere KI-Agenten nicht von menschlichen Anrufern unterscheiden. Wir verwenden modernste Sprachsynthese mit natürlichen Pausen, Füllwörtern und emotionaler Intonation.",
      fr: "Lors de tests en aveugle, 98% des auditeurs n'ont pas pu distinguer nos agents IA de vrais appelants. Nous utilisons une synthèse vocale de pointe avec des pauses naturelles, des mots de remplissage et une intonation émotionnelle.",
      es: "En pruebas ciegas, el 98% de los oyentes no pudieron distinguir nuestros agentes de IA de llamantes humanos. Utilizamos síntesis de voz de última generación con pausas naturales, muletillas e entonación emocional.",
      pl: "W ślepych testach 98% słuchaczy nie potrafiło odróżnić naszych agentów AI od ludzkich rozmówców. Używamy najnowocześniejszej syntezy mowy z naturalnymi pauzami, słowami wypełniającymi i emocjonalną intonacją.",
      pt: "Em testes cegos, 98% dos ouvintes não conseguiram distinguir nossos agentes de IA de chamadores humanos. Usamos síntese de voz de última geração com pausas naturais, palavras de preenchimento e entonação emocional.",
      ja: "ブラインドテストでは、98%のリスナーがAIエージェントと人間の電話を区別できませんでした。自然なポーズ、フィラーワード、感情的なイントネーションを備えた最先端の音声合成を使用しています。",
    },
  },
  {
    q: {
      en: "What languages do you support?",
      ua: "Які мови ви підтримуєте?",
      de: "Welche Sprachen unterstützen Sie?",
      fr: "Quelles langues prenez-vous en charge ?",
      es: "¿Qué idiomas soportan?",
      pl: "Jakie języki obsługujecie?",
      pt: "Quais idiomas vocês suportam?",
      ja: "どの言語に対応していますか？",
    },
    a: {
      en: "Ukrainian and English — both spoken natively. The agent can switch languages mid-conversation if the caller prefers a different language.",
      ua: "Українську та англійську — обидві як рідні. Агент може переключати мови посеред розмови, якщо співрозмовник надає перевагу іншій мові.",
      de: "Ukrainisch und Englisch — beide auf muttersprachlichem Niveau. Der Agent kann mitten im Gespräch die Sprache wechseln, wenn der Anrufer eine andere Sprache bevorzugt.",
      fr: "Ukrainien et anglais — les deux parlés nativement. L'agent peut changer de langue en cours de conversation si l'interlocuteur préfère une autre langue.",
      es: "Ucraniano e inglés — ambos hablados de forma nativa. El agente puede cambiar de idioma a mitad de conversación si el interlocutor prefiere otro idioma.",
      pl: "Ukraiński i angielski — oba na poziomie natywnym. Agent może przełączać języki w trakcie rozmowy, jeśli rozmówca preferuje inny język.",
      pt: "Ucraniano e inglês — ambos falados nativamente. O agente pode trocar de idioma no meio da conversa se o interlocutor preferir outro idioma.",
      ja: "ウクライナ語と英語 — どちらもネイティブレベル。通話相手が別の言語を希望すれば、会話の途中で言語を切り替えられます。",
    },
  },
  {
    q: {
      en: "How does Telegram outreach work?",
      ua: "Як працює аутріч в Telegram?",
      de: "Wie funktioniert Telegram-Outreach?",
      fr: "Comment fonctionne la prospection sur Telegram ?",
      es: "¿Cómo funciona la prospección en Telegram?",
      pl: "Jak działa outreach na Telegramie?",
      pt: "Como funciona a prospecção no Telegram?",
      ja: "Telegramアウトリーチはどのように機能しますか？",
    },
    a: {
      en: "Our AI agents message leads from real Telegram accounts with personalized, natural conversations. They handle replies, answer questions, and qualify leads — just like a human SDR would. No bots, no spam vibes.",
      ua: "Наші AI-агенти пишуть лідам з реальних акаунтів Telegram персоналізовані, природні повідомлення. Вони обробляють відповіді, відповідають на питання та кваліфікують лідів — як живий SDR. Жодних ботів, жодного спаму.",
      de: "Unsere KI-Agenten schreiben Leads von echten Telegram-Konten mit personalisierten, natürlichen Gesprächen. Sie bearbeiten Antworten, beantworten Fragen und qualifizieren Leads — genau wie ein menschlicher SDR. Keine Bots, kein Spam.",
      fr: "Nos agents IA contactent les prospects depuis de vrais comptes Telegram avec des conversations personnalisées et naturelles. Ils traitent les réponses, répondent aux questions et qualifient les prospects — comme un SDR humain. Pas de bots, pas de spam.",
      es: "Nuestros agentes de IA envían mensajes a leads desde cuentas reales de Telegram con conversaciones personalizadas y naturales. Manejan respuestas, contestan preguntas y califican leads — como lo haría un SDR humano. Sin bots, sin spam.",
      pl: "Nasi agenci AI piszą do leadów z prawdziwych kont na Telegramie, prowadząc spersonalizowane, naturalne rozmowy. Obsługują odpowiedzi, odpowiadają na pytania i kwalifikują leady — tak jak ludzki SDR. Żadnych botów, żadnego spamu.",
      pt: "Nossos agentes de IA enviam mensagens para leads de contas reais do Telegram com conversas personalizadas e naturais. Eles lidam com respostas, respondem perguntas e qualificam leads — assim como um SDR humano. Sem bots, sem spam.",
      ja: "AIエージェントが実際のTelegramアカウントからリードにパーソナライズされた自然な会話でメッセージを送信します。返信への対応、質問への回答、リードの適格性判断 — 人間のSDRと同じように。ボットなし、スパム感なし。",
    },
  },
  {
    q: {
      en: "Can I use all channels in one campaign?",
      ua: "Чи можу я використовувати всі канали в одній кампанії?",
      de: "Kann ich alle Kanäle in einer Kampagne verwenden?",
      fr: "Puis-je utiliser tous les canaux dans une seule campagne ?",
      es: "¿Puedo usar todos los canales en una campaña?",
      pl: "Czy mogę używać wszystkich kanałów w jednej kampanii?",
      pt: "Posso usar todos os canais em uma campanha?",
      ja: "1つのキャンペーンですべてのチャネルを使用できますか？",
    },
    a: {
      en: "Absolutely. Set up multi-channel sequences — for example, start with a Telegram message, follow up with a call if no reply within 24h, then send an email. Priority and fallback rules are fully customizable.",
      ua: "Звичайно. Налаштуйте мульти-канальні послідовності — наприклад, почніть з повідомлення в Telegram, зателефонуйте якщо немає відповіді протягом 24 годин, потім надішліть email. Правила пріоритету та фолбеку повністю налаштовуються.",
      de: "Absolut. Richten Sie Multi-Channel-Sequenzen ein — beginnen Sie beispielsweise mit einer Telegram-Nachricht, rufen Sie an, wenn innerhalb von 24 Stunden keine Antwort kommt, und senden Sie dann eine E-Mail. Prioritäts- und Fallback-Regeln sind vollständig anpassbar.",
      fr: "Absolument. Configurez des séquences multicanales — par exemple, commencez par un message Telegram, relancez par téléphone sans réponse sous 24h, puis envoyez un email. Les règles de priorité et de bascule sont entièrement personnalisables.",
      es: "Por supuesto. Configure secuencias multicanal — por ejemplo, comience con un mensaje de Telegram, haga seguimiento con una llamada si no hay respuesta en 24h, luego envíe un email. Las reglas de prioridad y respaldo son totalmente personalizables.",
      pl: "Oczywiście. Skonfiguruj sekwencje wielokanałowe — na przykład zacznij od wiadomości na Telegramie, zadzwoń jeśli nie ma odpowiedzi w ciągu 24h, potem wyślij email. Reguły priorytetów i fallbacku są w pełni konfigurowalne.",
      pt: "Com certeza. Configure sequências multicanal — por exemplo, comece com uma mensagem no Telegram, faça follow-up com uma ligação se não houver resposta em 24h, depois envie um email. As regras de prioridade e fallback são totalmente personalizáveis.",
      ja: "もちろんです。マルチチャネルシーケンスを設定できます — 例えば、Telegramメッセージから始め、24時間以内に返信がなければ電話でフォローアップし、その後メールを送信。優先順位とフォールバックルールは完全にカスタマイズ可能です。",
    },
  },
  {
    q: {
      en: "How fast does the AI respond?",
      ua: "Як швидко відповідає AI?",
      de: "Wie schnell reagiert die KI?",
      fr: "Quelle est la rapidité de réponse de l'IA ?",
      es: "¿Qué tan rápido responde la IA?",
      pl: "Jak szybko odpowiada AI?",
      pt: "Quão rápido a IA responde?",
      ja: "AIの応答速度はどのくらいですか？",
    },
    a: {
      en: "Under 0.5 second end-to-end latency for voice calls. Telegram and email responses are generated instantly and sent according to your configured schedule to feel natural.",
      ua: "Менше 0.5 секунди наскрізної затримки для голосових дзвінків. Відповіді в Telegram та email генеруються миттєво та надсилаються відповідно до налаштованого графіку, щоб виглядати природно.",
      de: "Unter 0,5 Sekunden End-to-End-Latenz für Sprachanrufe. Telegram- und E-Mail-Antworten werden sofort generiert und gemäß Ihrem konfigurierten Zeitplan versendet, um natürlich zu wirken.",
      fr: "Moins de 0,5 seconde de latence de bout en bout pour les appels vocaux. Les réponses Telegram et email sont générées instantanément et envoyées selon votre planning configuré pour paraître naturelles.",
      es: "Menos de 0,5 segundos de latencia de extremo a extremo para llamadas de voz. Las respuestas de Telegram y email se generan al instante y se envían según su programación configurada para sentirse naturales.",
      pl: "Poniżej 0,5 sekundy opóźnienia end-to-end dla połączeń głosowych. Odpowiedzi na Telegramie i emailach generowane są natychmiast i wysyłane zgodnie ze skonfigurowanym harmonogramem, aby wyglądały naturalnie.",
      pt: "Menos de 0,5 segundo de latência ponta a ponta para chamadas de voz. Respostas no Telegram e email são geradas instantaneamente e enviadas de acordo com sua programação configurada para parecer natural.",
      ja: "音声通話のエンドツーエンドレイテンシーは0.5秒未満。TelegramとメールのレスポンスはXから生成され、自然に感じるよう設定されたスケジュールに従って送信されます。",
    },
  },
  {
    q: {
      en: "Can I use my own phone number?",
      ua: "Чи можу я використовувати свій номер телефону?",
      de: "Kann ich meine eigene Telefonnummer verwenden?",
      fr: "Puis-je utiliser mon propre numéro de téléphone ?",
      es: "¿Puedo usar mi propio número de teléfono?",
      pl: "Czy mogę użyć swojego numeru telefonu?",
      pt: "Posso usar meu próprio número de telefone?",
      ja: "自分の電話番号を使用できますか？",
    },
    a: {
      en: "Yes. Port your existing number or get new ones from us. We support Ukrainian, European and US phone numbers via SIP trunking.",
      ua: "Так. Перенесіть свій існуючий номер або отримайте нові від нас. Ми підтримуємо українські, європейські та американські номери через SIP-транкінг.",
      de: "Ja. Portieren Sie Ihre bestehende Nummer oder erhalten Sie neue von uns. Wir unterstützen ukrainische, europäische und US-Telefonnummern über SIP-Trunking.",
      fr: "Oui. Transférez votre numéro existant ou obtenez-en de nouveaux chez nous. Nous prenons en charge les numéros ukrainiens, européens et américains via SIP trunking.",
      es: "Sí. Porte su número existente u obtenga nuevos de nosotros. Soportamos números de teléfono ucranianos, europeos y estadounidenses mediante SIP trunking.",
      pl: "Tak. Przenieś swój istniejący numer lub uzyskaj nowe od nas. Obsługujemy ukraińskie, europejskie i amerykańskie numery telefonów przez SIP trunking.",
      pt: "Sim. Porte seu número existente ou obtenha novos conosco. Suportamos números ucranianos, europeus e americanos via SIP trunking.",
      ja: "はい。既存の番号を移行するか、新しい番号を取得できます。SIPトランキングを介してウクライナ、ヨーロッパ、米国の電話番号をサポートしています。",
    },
  },
  {
    q: {
      en: "Is it legal to use AI for calls?",
      ua: "Чи законно використовувати AI для дзвінків?",
      de: "Ist es legal, KI für Anrufe zu nutzen?",
      fr: "Est-il légal d'utiliser l'IA pour les appels ?",
      es: "¿Es legal usar IA para llamadas?",
      pl: "Czy używanie AI do połączeń jest legalne?",
      pt: "É legal usar IA para ligações?",
      ja: "AIを電話に使用することは合法ですか？",
    },
    a: {
      en: "Yes, when used in compliance with local regulations. We help you stay compliant with disclosure requirements and do-not-call lists. Enterprise plans include a compliance consultation.",
      ua: "Так, при дотриманні місцевих нормативних актів. Ми допоможемо вам відповідати вимогам розкриття інформації та спискам заборонених дзвінків. Корпоративні плани включають консультацію з комплаєнсу.",
      de: "Ja, bei Einhaltung lokaler Vorschriften. Wir helfen Ihnen, die Offenlegungspflichten und Sperrlisten einzuhalten. Enterprise-Pläne beinhalten eine Compliance-Beratung.",
      fr: "Oui, dans le respect des réglementations locales. Nous vous aidons à rester conforme aux exigences de divulgation et aux listes de numéros interdits. Les plans Entreprise incluent une consultation de conformité.",
      es: "Sí, cuando se usa en cumplimiento con las regulaciones locales. Le ayudamos a cumplir con los requisitos de divulgación y listas de no llamar. Los planes empresariales incluyen una consulta de cumplimiento.",
      pl: "Tak, przy zachowaniu zgodności z lokalnymi przepisami. Pomagamy zachować zgodność z wymogami ujawniania informacji i listami zakazanych połączeń. Plany Enterprise obejmują konsultację compliance.",
      pt: "Sim, quando usado em conformidade com as regulamentações locais. Ajudamos você a manter conformidade com requisitos de divulgação e listas de não ligar. Planos empresariais incluem consultoria de compliance.",
      ja: "はい、現地の規制に準拠して使用する場合は合法です。開示要件やDo-Not-Callリストへの準拠をサポートします。エンタープライズプランにはコンプライアンスコンサルティングが含まれます。",
    },
  },
];

const sectionTitle: Record<Lang, { tag: string; h2: string }> = {
  en: { tag: "FAQ", h2: "Questions & Answers" },
  ua: { tag: "FAQ", h2: "Питання та відповіді" },
  de: { tag: "FAQ", h2: "Fragen & Antworten" },
  fr: { tag: "FAQ", h2: "Questions & Réponses" },
  es: { tag: "FAQ", h2: "Preguntas y respuestas" },
  pl: { tag: "FAQ", h2: "Pytania i odpowiedzi" },
  pt: { tag: "FAQ", h2: "Perguntas e respostas" },
  ja: { tag: "FAQ", h2: "よくある質問" },
};

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, isInView } = useInView();
  const v = isInView ? 'reveal-visible' : '';
  const [lang] = useLang();
  const st = sectionTitle[lang] || sectionTitle.en;

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
          <span className="text-[#ff4d4d] text-sm font-semibold uppercase tracking-widest">{st.tag}</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 font-display tracking-tight">{st.h2}</h2>
        </div>

        <div className={`reveal-hidden ${v}`} style={{ transitionDelay: '200ms' }}>
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-white/8 cursor-pointer" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
              <div className="flex items-center justify-between py-6">
                <h3 className="text-base font-medium text-white pr-8">{faq.q[lang] || faq.q.en}</h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`w-5 h-5 text-white/30 flex-shrink-0 faq-chevron ${openIndex === i ? 'open' : ''}`}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
              <div className={`faq-answer ${openIndex === i ? 'open' : ''}`}>
                <p className="text-sm text-white/55">{faq.a[lang] || faq.a.en}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
