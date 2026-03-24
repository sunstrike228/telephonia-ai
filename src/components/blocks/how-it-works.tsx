"use client";

import { useInView } from "@/hooks/use-in-view";
import { useLang, type Lang } from "@/hooks/use-lang";
import { FlippingCard } from "@/components/ui/flipping-card";
import { Upload, Users, Rocket } from "lucide-react";

const steps = [
  {
    num: "1",
    color: "#ff4d4d",
    icon: Upload,
    title: {
      en: "Upload Script & Choose Channels",
      ua: "Завантажте скрипт та оберіть канали",
      de: "Skript hochladen & Kanäle wählen",
      fr: "Importez votre script et choisissez les canaux",
      es: "Suba su script y elija canales",
      pl: "Wgraj skrypt i wybierz kanały",
      pt: "Envie o script e escolha os canais",
      ja: "スクリプトをアップロードしてチャネルを選択",
    },
    desc: {
      en: "Paste your sales script, select channels — voice calls, Telegram, email — or all three. Our AI adapts to your industry and tone.",
      ua: "Вставте свій скрипт продажів, оберіть канали — голосові дзвінки, Telegram, email — або всі три. Наш AI адаптується до вашої галузі та тону.",
      de: "Fügen Sie Ihr Verkaufsskript ein, wählen Sie Kanäle — Sprachanrufe, Telegram, E-Mail — oder alle drei. Unsere KI passt sich Ihrer Branche und Ihrem Ton an.",
      fr: "Collez votre script de vente, sélectionnez les canaux — appels vocaux, Telegram, email — ou les trois. Notre IA s'adapte à votre secteur et à votre ton.",
      es: "Pegue su script de ventas, seleccione canales — llamadas de voz, Telegram, email — o los tres. Nuestra IA se adapta a su industria y tono.",
      pl: "Wklej swój skrypt sprzedażowy, wybierz kanały — połączenia głosowe, Telegram, email — lub wszystkie trzy. Nasz AI dostosowuje się do Twojej branży i tonu.",
      pt: "Cole seu script de vendas, selecione canais — chamadas de voz, Telegram, email — ou todos os três. Nossa IA se adapta ao seu setor e tom.",
      ja: "セールススクリプトを貼り付け、チャネルを選択 — 音声通話、Telegram、メール — または3つすべて。AIが業界とトーンに適応します。",
    },
    backDesc: {
      en: "Our AI analyzes your script structure, identifies key selling points, and automatically generates natural conversation flows for each channel — voice, Telegram, and email — with objection handling built in.",
      ua: "Наш AI аналізує структуру скрипту, визначає ключові переваги та автоматично генерує природні потоки комунікації для кожного каналу — голос, Telegram та email — із вбудованою обробкою заперечень.",
      de: "Unsere KI analysiert die Skriptstruktur, identifiziert wichtige Verkaufsargumente und generiert automatisch natürliche Gesprächsabläufe für jeden Kanal — Sprache, Telegram und E-Mail — mit integrierter Einwandbehandlung.",
      fr: "Notre IA analyse la structure de votre script, identifie les arguments clés et génère automatiquement des flux de conversation naturels pour chaque canal — voix, Telegram et email — avec gestion des objections intégrée.",
      es: "Nuestra IA analiza la estructura del script, identifica puntos clave de venta y genera automáticamente flujos de conversación naturales para cada canal — voz, Telegram y email — con manejo de objeciones integrado.",
      pl: "Nasz AI analizuje strukturę skryptu, identyfikuje kluczowe argumenty sprzedażowe i automatycznie generuje naturalne przepływy konwersacji dla każdego kanału — głos, Telegram i email — z wbudowaną obsługą obiekcji.",
      pt: "Nossa IA analisa a estrutura do script, identifica pontos-chave de venda e gera automaticamente fluxos de conversa naturais para cada canal — voz, Telegram e email — com tratamento de objeções integrado.",
      ja: "AIがスクリプト構造を分析し、主要なセールスポイントを特定し、各チャネル（音声、Telegram、メール）の自然な会話フローを反論処理を組み込んで自動生成します。",
    },
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=220&fit=crop",
  },
  {
    num: "2",
    color: "#ff4d4d",
    icon: Users,
    title: {
      en: "Import Leads",
      ua: "Імпортуйте ліди",
      de: "Leads importieren",
      fr: "Importez vos prospects",
      es: "Importe sus leads",
      pl: "Importuj leady",
      pt: "Importe seus leads",
      ja: "リードをインポート",
    },
    desc: {
      en: "Upload a CSV with phone numbers, email addresses, and Telegram usernames. Map fields automatically.",
      ua: "Завантажте CSV з номерами телефонів, email-адресами та username Telegram. Поля мапляться автоматично.",
      de: "Laden Sie eine CSV mit Telefonnummern, E-Mail-Adressen und Telegram-Benutzernamen hoch. Felder werden automatisch zugeordnet.",
      fr: "Importez un CSV avec numéros de téléphone, adresses email et pseudos Telegram. Mappage automatique des champs.",
      es: "Suba un CSV con números de teléfono, emails y usuarios de Telegram. Los campos se mapean automáticamente.",
      pl: "Wgraj CSV z numerami telefonów, adresami email i nazwami użytkowników Telegram. Pola mapują się automatycznie.",
      pt: "Envie um CSV com números de telefone, emails e usernames do Telegram. Os campos são mapeados automaticamente.",
      ja: "電話番号、メールアドレス、TelegramユーザーネームのCSVをアップロード。フィールドは自動マッピング。",
    },
    backDesc: {
      en: "Supports CSV, Excel, or direct CRM import. Auto-detects phone, email, and Telegram fields. Deduplicates contacts, validates data, and segments leads by channel availability.",
      ua: "Підтримує CSV, Excel або прямий імпорт з CRM. Автоматично визначає поля телефону, email та Telegram. Дедуплікація контактів, валідація даних та сегментація лідів за доступністю каналів.",
      de: "Unterstützt CSV, Excel oder direkten CRM-Import. Erkennt automatisch Telefon-, E-Mail- und Telegram-Felder. Dedupliziert Kontakte, validiert Daten und segmentiert Leads nach Kanalverfügbarkeit.",
      fr: "Prend en charge CSV, Excel ou import CRM direct. Détection automatique des champs téléphone, email et Telegram. Déduplique les contacts, valide les données et segmente les prospects par disponibilité de canal.",
      es: "Soporta CSV, Excel o importación directa de CRM. Detecta automáticamente campos de teléfono, email y Telegram. Deduplica contactos, valida datos y segmenta leads por disponibilidad de canal.",
      pl: "Obsługuje CSV, Excel lub bezpośredni import z CRM. Automatycznie wykrywa pola telefonu, emaila i Telegrama. Deduplikuje kontakty, waliduje dane i segmentuje leady według dostępności kanałów.",
      pt: "Suporta CSV, Excel ou importação direta do CRM. Detecta automaticamente campos de telefone, email e Telegram. Deduplica contatos, valida dados e segmenta leads por disponibilidade de canal.",
      ja: "CSV、Excel、またはCRMからの直接インポートに対応。電話、メール、Telegramフィールドを自動検出。連絡先の重複排除、データ検証、チャネル別リードセグメンテーション。",
    },
    image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=400&h=220&fit=crop",
  },
  {
    num: "3",
    color: "#ff4d4d",
    icon: Rocket,
    title: {
      en: "Launch & Monitor",
      ua: "Запускайте та контролюйте",
      de: "Starten & überwachen",
      fr: "Lancez et surveillez",
      es: "Lance y monitoree",
      pl: "Uruchom i monitoruj",
      pt: "Lance e monitore",
      ja: "ローンチして監視",
    },
    desc: {
      en: "Go live across all channels simultaneously. Monitor calls, messages, and emails in one real-time dashboard.",
      ua: "Запустіть всі канали одночасно. Відстежуйте дзвінки, повідомлення та листи в одній панелі реального часу.",
      de: "Gehen Sie auf allen Kanälen gleichzeitig live. Überwachen Sie Anrufe, Nachrichten und E-Mails in einem Echtzeit-Dashboard.",
      fr: "Passez en direct sur tous les canaux simultanément. Surveillez appels, messages et emails dans un tableau de bord en temps réel.",
      es: "Salga en vivo en todos los canales simultáneamente. Monitoree llamadas, mensajes y emails en un panel en tiempo real.",
      pl: "Wystartuj na wszystkich kanałach jednocześnie. Monitoruj połączenia, wiadomości i emaile w jednym panelu w czasie rzeczywistym.",
      pt: "Entre no ar em todos os canais simultaneamente. Monitore chamadas, mensagens e emails em um painel em tempo real.",
      ja: "すべてのチャネルで同時にライブ配信。通話、メッセージ、メールをリアルタイムダッシュボードで一元監視。",
    },
    backDesc: {
      en: "Cross-channel dashboard shows live calls, Telegram conversations, and email opens side by side. A/B test different scripts per channel. Auto-fallback between channels if no response.",
      ua: "Кросс-канальна панель показує живі дзвінки, розмови в Telegram та відкриття email поруч. A/B тестування різних скриптів по каналах. Автоматичний перехід між каналами при відсутності відповіді.",
      de: "Das kanalübergreifende Dashboard zeigt Live-Anrufe, Telegram-Gespräche und E-Mail-Öffnungen nebeneinander. A/B-Tests verschiedener Skripte pro Kanal. Automatischer Kanalwechsel bei ausbleibender Antwort.",
      fr: "Le tableau de bord multicanal affiche les appels en direct, les conversations Telegram et les ouvertures d'emails côte à côte. Tests A/B de différents scripts par canal. Bascule automatique entre canaux sans réponse.",
      es: "El panel multicanal muestra llamadas en vivo, conversaciones de Telegram y aperturas de email lado a lado. Pruebas A/B de diferentes scripts por canal. Cambio automático entre canales sin respuesta.",
      pl: "Panel wielokanałowy pokazuje na żywo połączenia, rozmowy na Telegramie i otwarcia emaili obok siebie. Testy A/B różnych skryptów na kanał. Automatyczne przełączanie kanałów przy braku odpowiedzi.",
      pt: "O painel multicanal mostra chamadas ao vivo, conversas no Telegram e aberturas de email lado a lado. Testes A/B de diferentes scripts por canal. Fallback automático entre canais sem resposta.",
      ja: "クロスチャネルダッシュボードでライブ通話、Telegram会話、メール開封を並べて表示。チャネルごとに異なるスクリプトのA/Bテスト。無応答時のチャネル間自動フォールバック。",
    },
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=220&fit=crop",
  },
];

const sectionText: Record<Lang, { tag: string; h2: string; hint: string }> = {
  en: { tag: "How it works", h2: "Live in 3 steps", hint: "Hover over a card to learn more" },
  ua: { tag: "Як це працює", h2: "Запуск за 3 кроки", hint: "Наведіть мишкою на карточку щоб дізнатись більше" },
  de: { tag: "So funktioniert's", h2: "In 3 Schritten live", hint: "Fahren Sie mit der Maus über eine Karte, um mehr zu erfahren" },
  fr: { tag: "Comment ça marche", h2: "En ligne en 3 étapes", hint: "Survolez une carte pour en savoir plus" },
  es: { tag: "Cómo funciona", h2: "En vivo en 3 pasos", hint: "Pase el cursor sobre una tarjeta para saber más" },
  pl: { tag: "Jak to działa", h2: "Na żywo w 3 krokach", hint: "Najedź na kartę, aby dowiedzieć się więcej" },
  pt: { tag: "Como funciona", h2: "Ao vivo em 3 passos", hint: "Passe o mouse sobre um cartão para saber mais" },
  ja: { tag: "仕組み", h2: "3ステップで開始", hint: "カードにホバーして詳細を確認" },
};

export function HowItWorks() {
  const { ref, isInView } = useInView();
  const v = isInView ? "reveal-visible" : "";
  const [lang] = useLang();
  const st = sectionText[lang] || sectionText.en;

  return (
    <section className="relative py-32 overflow-hidden" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className={`reveal-hidden ${v} text-center mb-20`}>
          <span className="text-[#ff4d4d] text-sm font-semibold uppercase tracking-widest">
            {st.tag}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 font-display tracking-tight">
            {st.h2}
          </h2>
          <p className="text-white/40 mt-4 text-sm">
            {st.hint}
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
                        alt={s.title[lang] || s.title.en}
                        className="w-full h-40 object-cover rounded-xl grayscale"
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
                          {s.title[lang] || s.title.en}
                        </h3>
                      </div>
                      <p className="text-white/50 text-sm mt-3 leading-relaxed">
                        {s.desc[lang] || s.desc.en}
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
                        {s.backDesc[lang] || s.backDesc.en}
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
