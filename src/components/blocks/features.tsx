"use client";

import { Tilt } from "@/components/ui/tilt";
import { Spotlight } from "@/components/ui/spotlight";
import { Phone, MessageCircle, Mail, Layers, BarChart3, Monitor } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { useLang, type Lang } from "@/hooks/use-lang";

interface FeatureItem {
  icon: React.ElementType;
  color: string;
  title: Record<Lang, string>;
  desc: Record<Lang, string>;
}

const features: FeatureItem[] = [
  {
    icon: Phone, color: "#ff4d4d",
    title: {
      en: "AI Voice Calls",
      ua: "AI-голосові дзвінки",
      de: "KI-Sprachanrufe",
      fr: "Appels vocaux IA",
      es: "Llamadas de voz con IA",
      pl: "Połączenia głosowe AI",
      pt: "Chamadas de voz com IA",
      ja: "AI音声通話",
    },
    desc: {
      en: "AI agents call your leads, qualify them, handle objections and book meetings at scale. Hundreds of simultaneous calls, zero burnout.",
      ua: "AI-агенти дзвонять вашим лідам, кваліфікують їх, обробляють заперечення та бронюють зустрічі масштабно. Сотні одночасних дзвінків, нуль вигорання.",
      de: "KI-Agenten rufen Ihre Leads an, qualifizieren sie, behandeln Einwände und buchen Termine im großen Stil. Hunderte gleichzeitige Anrufe, kein Burnout.",
      fr: "Les agents IA appellent vos prospects, les qualifient, traitent les objections et prennent des rendez-vous à grande échelle. Des centaines d'appels simultanés, zéro épuisement.",
      es: "Los agentes de IA llaman a sus leads, los califican, manejan objeciones y reservan reuniones a escala. Cientos de llamadas simultáneas, cero agotamiento.",
      pl: "Agenci AI dzwonią do Twoich leadów, kwalifikują ich, obsługują obiekcje i rezerwują spotkania na dużą skalę. Setki jednoczesnych połączeń, zero wypalenia.",
      pt: "Agentes de IA ligam para seus leads, qualificam, tratam objeções e agendam reuniões em escala. Centenas de chamadas simultâneas, zero esgotamento.",
      ja: "AIエージェントがリードに電話し、適格性を判断し、反論に対応し、大規模にミーティングを予約します。同時に数百件の通話、燃え尽きゼロ。",
    },
  },
  {
    icon: MessageCircle, color: "#ff4d4d",
    title: {
      en: "Telegram Outreach",
      ua: "Аутріч в Telegram",
      de: "Telegram-Outreach",
      fr: "Prospection Telegram",
      es: "Prospección en Telegram",
      pl: "Outreach na Telegramie",
      pt: "Prospecção no Telegram",
      ja: "Telegramアウトリーチ",
    },
    desc: {
      en: "AI agents message your leads on Telegram from real accounts. Natural conversations, not bots.",
      ua: "AI-агенти пишуть вашим лідам в Telegram з реальних акаунтів. Природні розмови, а не боти.",
      de: "KI-Agenten schreiben Ihren Leads auf Telegram von echten Konten. Natürliche Gespräche, keine Bots.",
      fr: "Les agents IA contactent vos prospects sur Telegram depuis de vrais comptes. Des conversations naturelles, pas des bots.",
      es: "Los agentes de IA envían mensajes a sus leads en Telegram desde cuentas reales. Conversaciones naturales, no bots.",
      pl: "Agenci AI piszą do Twoich leadów na Telegramie z prawdziwych kont. Naturalne rozmowy, nie boty.",
      pt: "Agentes de IA enviam mensagens para seus leads no Telegram de contas reais. Conversas naturais, não bots.",
      ja: "AIエージェントが実際のアカウントからTelegramでリードにメッセージを送信します。ボットではなく、自然な会話。",
    },
  },
  {
    icon: Mail, color: "#ff6b6b",
    title: {
      en: "Email Campaigns",
      ua: "Email-кампанії",
      de: "E-Mail-Kampagnen",
      fr: "Campagnes email",
      es: "Campañas de email",
      pl: "Kampanie emailowe",
      pt: "Campanhas de email",
      ja: "メールキャンペーン",
    },
    desc: {
      en: "AI-generated personalized emails. Follow-up sequences. Track opens and replies.",
      ua: "AI-генеровані персоналізовані листи. Ланцюжки follow-up. Відстежуйте відкриття та відповіді.",
      de: "KI-generierte personalisierte E-Mails. Follow-up-Sequenzen. Öffnungen und Antworten verfolgen.",
      fr: "Emails personnalisés générés par IA. Séquences de relance. Suivi des ouvertures et réponses.",
      es: "Emails personalizados generados por IA. Secuencias de seguimiento. Rastree aperturas y respuestas.",
      pl: "Spersonalizowane emaile generowane przez AI. Sekwencje follow-up. Śledź otwarcia i odpowiedzi.",
      pt: "Emails personalizados gerados por IA. Sequências de follow-up. Acompanhe aberturas e respostas.",
      ja: "AIが生成するパーソナライズメール。フォローアップシーケンス。開封と返信を追跡。",
    },
  },
  {
    icon: Layers, color: "#ff8a8a",
    title: {
      en: "Multi-Channel Orchestration",
      ua: "Мульти-канальна оркестрація",
      de: "Multi-Channel-Orchestrierung",
      fr: "Orchestration multicanale",
      es: "Orquestación multicanal",
      pl: "Orkiestracja wielokanałowa",
      pt: "Orquestração multicanal",
      ja: "マルチチャネルオーケストレーション",
    },
    desc: {
      en: "Set channel priority. If no reply on Telegram, auto-fallback to call, then email.",
      ua: "Встановіть пріоритет каналів. Якщо немає відповіді в Telegram, автоматичний перехід на дзвінок, потім email.",
      de: "Kanalpriorität festlegen. Keine Antwort auf Telegram? Automatischer Rückfall auf Anruf, dann E-Mail.",
      fr: "Définissez la priorité des canaux. Pas de réponse sur Telegram ? Bascule automatique vers l'appel, puis l'email.",
      es: "Establezca la prioridad de canales. Sin respuesta en Telegram, cambio automático a llamada, luego email.",
      pl: "Ustaw priorytet kanałów. Brak odpowiedzi na Telegramie? Automatyczne przejście na połączenie, potem email.",
      pt: "Defina a prioridade dos canais. Sem resposta no Telegram, fallback automático para ligação, depois email.",
      ja: "チャネルの優先順位を設定。Telegramで返信がなければ、自動的に電話に切り替え、次にメール。",
    },
  },
  {
    icon: BarChart3, color: "#cc3333",
    title: {
      en: "Real-Time Analytics",
      ua: "Аналітика в реальному часі",
      de: "Echtzeit-Analysen",
      fr: "Analyses en temps réel",
      es: "Analítica en tiempo real",
      pl: "Analityka w czasie rzeczywistym",
      pt: "Análises em tempo real",
      ja: "リアルタイム分析",
    },
    desc: {
      en: "Every interaction transcribed, scored, and analyzed. See conversion rates, objection patterns, and sentiment live in your dashboard.",
      ua: "Кожна взаємодія транскрибована, оцінена та проаналізована. Конверсії, патерни заперечень та настрої — наживо у вашій панелі.",
      de: "Jede Interaktion transkribiert, bewertet und analysiert. Konversionsraten, Einwandmuster und Stimmung live in Ihrem Dashboard.",
      fr: "Chaque interaction transcrite, évaluée et analysée. Taux de conversion, schémas d'objections et sentiment en direct dans votre tableau de bord.",
      es: "Cada interacción transcrita, evaluada y analizada. Tasas de conversión, patrones de objeciones y sentimiento en vivo en su panel.",
      pl: "Każda interakcja transkrybowana, oceniona i przeanalizowana. Wskaźniki konwersji, wzorce obiekcji i sentyment na żywo w panelu.",
      pt: "Cada interação transcrita, avaliada e analisada. Taxas de conversão, padrões de objeções e sentimento ao vivo no seu painel.",
      ja: "すべてのインタラクションを文字起こし、スコアリング、分析。コンバージョン率、反論パターン、センチメントをダッシュボードでリアルタイムに確認。",
    },
  },
  {
    icon: Monitor, color: "#e63946",
    title: {
      en: "CRM Integration",
      ua: "Інтеграція з CRM",
      de: "CRM-Integration",
      fr: "Intégration CRM",
      es: "Integración CRM",
      pl: "Integracja z CRM",
      pt: "Integração com CRM",
      ja: "CRM連携",
    },
    desc: {
      en: "Plug into your existing stack. HubSpot, Salesforce, Pipedrive, Close — data flows directly into your pipeline.",
      ua: "Підключайтесь до вашого стеку. HubSpot, Salesforce, Pipedrive, Close — дані надходять прямо у ваш pipeline.",
      de: "In Ihren bestehenden Stack integrieren. HubSpot, Salesforce, Pipedrive, Close — Daten fließen direkt in Ihre Pipeline.",
      fr: "Connectez-vous à votre stack existant. HubSpot, Salesforce, Pipedrive, Close — les données affluent directement dans votre pipeline.",
      es: "Conéctese a su stack existente. HubSpot, Salesforce, Pipedrive, Close — los datos fluyen directamente a su pipeline.",
      pl: "Podłącz się do istniejącego stacku. HubSpot, Salesforce, Pipedrive, Close — dane trafiają bezpośrednio do Twojego pipeline.",
      pt: "Conecte-se ao seu stack existente. HubSpot, Salesforce, Pipedrive, Close — os dados fluem diretamente para seu pipeline.",
      ja: "既存のスタックに接続。HubSpot、Salesforce、Pipedrive、Close — データはパイプラインに直接流れます。",
    },
  },
];

const sectionTitle: Record<Lang, { tag: string; h2_1: string; h2_2: string }> = {
  en: { tag: "What we do", h2_1: "One platform.", h2_2: "Every channel covered." },
  ua: { tag: "Що ми робимо", h2_1: "Одна платформа.", h2_2: "Кожен канал опрацьований." },
  de: { tag: "Was wir tun", h2_1: "Eine Plattform.", h2_2: "Jeder Kanal abgedeckt." },
  fr: { tag: "Ce que nous faisons", h2_1: "Une plateforme.", h2_2: "Chaque canal couvert." },
  es: { tag: "Lo que hacemos", h2_1: "Una plataforma.", h2_2: "Cada canal cubierto." },
  pl: { tag: "Co robimy", h2_1: "Jedna platforma.", h2_2: "Każdy kanał obsłużony." },
  pt: { tag: "O que fazemos", h2_1: "Uma plataforma.", h2_2: "Cada canal coberto." },
  ja: { tag: "私たちの機能", h2_1: "一つのプラットフォーム。", h2_2: "すべてのチャネルをカバー。" },
};

export function Features() {
  const { ref, isInView } = useInView();
  const v = isInView ? 'reveal-visible' : '';
  const [lang] = useLang();
  const st = sectionTitle[lang] || sectionTitle.en;

  return (
    <section id="features" className="relative py-32 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className={`reveal-hidden ${v} text-center mb-20`}>
          <span className="text-[#ff4d4d] text-sm font-semibold uppercase tracking-widest">{st.tag}</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 font-display tracking-tight">
            {st.h2_1}<br />{st.h2_2}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title.en}
                className={`reveal-hidden ${v}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <Tilt rotationFactor={6} isRevese className="h-full">
                  <div className="relative rounded-2xl border border-white/10 bg-[rgba(18,18,26,0.95)] p-8 h-full overflow-hidden group hover:border-[rgba(255,77,77,0.3)] transition-colors duration-300">
                    <Spotlight size={200} />
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                      <Icon size={24} stroke={f.color} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 font-display">{f.title[lang] || f.title.en}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{f.desc[lang] || f.desc.en}</p>
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
