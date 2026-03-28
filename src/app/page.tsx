"use client";

import { Navbar } from "@/components/blocks/navbar";
import { EtheralShadow } from "@/components/ui/etheral-shadow";
import { Hero } from "@/components/blocks/hero";
import { Features } from "@/components/blocks/features";
import { HowItWorks } from "@/components/blocks/how-it-works";
import { Pricing } from "@/components/blocks/pricing";
import { FAQ } from "@/components/blocks/faq";
import { CTA } from "@/components/blocks/cta";
import { Footer } from "@/components/blocks/footer";
import type { Lang } from "@/hooks/use-lang";

interface PricingPlan {
  name: Record<Lang, string>;
  price: string;
  yearlyPrice: string;
  period: string;
  features: Record<Lang, string[]>;
  description: Record<Lang, string>;
  buttonText: Record<Lang, string>;
  href: string;
  isPopular: boolean;
}

const pricingPlans: PricingPlan[] = [
  {
    name: {
      en: "Starter", ua: "Старт", de: "Starter", fr: "Starter", es: "Inicial", pl: "Start", pt: "Inicial", ja: "スターター",
    },
    price: "40", yearlyPrice: "32", period: "per month",
    features: {
      en: ["500 voice minutes / month", "100 Telegram messages / month", "500 emails / month", "1 phone number", "Basic analytics", "Ukrainian & English"],
      ua: ["500 голосових хвилин / місяць", "100 повідомлень Telegram / місяць", "500 email / місяць", "1 номер телефону", "Базова аналітика", "Українська та англійська"],
      de: ["500 Sprachminuten / Monat", "100 Telegram-Nachrichten / Monat", "500 E-Mails / Monat", "1 Telefonnummer", "Basis-Analysen", "Ukrainisch & Englisch"],
      fr: ["500 minutes vocales / mois", "100 messages Telegram / mois", "500 emails / mois", "1 numéro de téléphone", "Analyses de base", "Ukrainien & anglais"],
      es: ["500 minutos de voz / mes", "100 mensajes Telegram / mes", "500 emails / mes", "1 número de teléfono", "Analítica básica", "Ucraniano e inglés"],
      pl: ["500 minut głosowych / miesiąc", "100 wiadomości Telegram / miesiąc", "500 emaili / miesiąc", "1 numer telefonu", "Podstawowa analityka", "Ukraiński i angielski"],
      pt: ["500 minutos de voz / mês", "100 mensagens Telegram / mês", "500 emails / mês", "1 número de telefone", "Análises básicas", "Ucraniano e inglês"],
      ja: ["月500分の音声通話", "月100件のTelegramメッセージ", "月500件のメール", "電話番号1つ", "基本分析", "ウクライナ語と英語"],
    },
    description: {
      en: "Perfect for individuals and small projects",
      ua: "Ідеально для індивідуальних та малих проєктів",
      de: "Ideal für Einzelpersonen und kleine Projekte",
      fr: "Parfait pour les particuliers et petits projets",
      es: "Perfecto para individuos y proyectos pequeños",
      pl: "Idealny dla osób indywidualnych i małych projektów",
      pt: "Perfeito para indivíduos e pequenos projetos",
      ja: "個人や小規模プロジェクトに最適",
    },
    buttonText: {
      en: "Start Free Trial", ua: "Спробувати безкоштовно", de: "Kostenlos testen", fr: "Essai gratuit", es: "Prueba gratuita", pl: "Wypróbuj za darmo", pt: "Teste grátis", ja: "無料トライアル",
    },
    href: "#cta", isPopular: false,
  },
  {
    name: {
      en: "Growth", ua: "Зростання", de: "Wachstum", fr: "Croissance", es: "Crecimiento", pl: "Wzrost", pt: "Crescimento", ja: "グロース",
    },
    price: "99", yearlyPrice: "79", period: "per month",
    features: {
      en: ["2,000 voice minutes / month", "500 Telegram messages / month", "2,000 emails / month", "5 phone numbers", "CRM integrations", "Custom voice cloning", "Multi-channel sequences", "Priority support"],
      ua: ["2 000 голосових хвилин / місяць", "500 повідомлень Telegram / місяць", "2 000 email / місяць", "5 номерів телефону", "Інтеграція з CRM", "Клонування голосу", "Мульти-канальні послідовності", "Пріоритетна підтримка"],
      de: ["2.000 Sprachminuten / Monat", "500 Telegram-Nachrichten / Monat", "2.000 E-Mails / Monat", "5 Telefonnummern", "CRM-Integrationen", "Benutzerdefiniertes Voice-Cloning", "Multi-Channel-Sequenzen", "Prioritäts-Support"],
      fr: ["2 000 minutes vocales / mois", "500 messages Telegram / mois", "2 000 emails / mois", "5 numéros de téléphone", "Intégrations CRM", "Clonage vocal personnalisé", "Séquences multicanales", "Support prioritaire"],
      es: ["2000 minutos de voz / mes", "500 mensajes Telegram / mes", "2000 emails / mes", "5 números de teléfono", "Integraciones CRM", "Clonación de voz personalizada", "Secuencias multicanal", "Soporte prioritario"],
      pl: ["2000 minut głosowych / miesiąc", "500 wiadomości Telegram / miesiąc", "2000 emaili / miesiąc", "5 numerów telefonu", "Integracje z CRM", "Klonowanie głosu", "Sekwencje wielokanałowe", "Priorytetowe wsparcie"],
      pt: ["2.000 minutos de voz / mês", "500 mensagens Telegram / mês", "2.000 emails / mês", "5 números de telefone", "Integrações CRM", "Clonagem de voz personalizada", "Sequências multicanal", "Suporte prioritário"],
      ja: ["月2,000分の音声通話", "月500件のTelegramメッセージ", "月2,000件のメール", "電話番号5つ", "CRM連携", "カスタム音声クローニング", "マルチチャネルシーケンス", "優先サポート"],
    },
    description: {
      en: "Ideal for growing teams and businesses",
      ua: "Ідеально для команд та бізнесів, що зростають",
      de: "Ideal für wachsende Teams und Unternehmen",
      fr: "Idéal pour les équipes et entreprises en croissance",
      es: "Ideal para equipos y negocios en crecimiento",
      pl: "Idealny dla rosnących zespołów i firm",
      pt: "Ideal para equipes e negócios em crescimento",
      ja: "成長中のチームやビジネスに最適",
    },
    buttonText: {
      en: "Get Started", ua: "Почати", de: "Loslegen", fr: "Commencer", es: "Comenzar", pl: "Rozpocznij", pt: "Começar", ja: "始める",
    },
    href: "#cta", isPopular: true,
  },
  {
    name: {
      en: "Enterprise", ua: "Корпоративний", de: "Enterprise", fr: "Entreprise", es: "Empresarial", pl: "Enterprise", pt: "Empresarial", ja: "エンタープライズ",
    },
    price: "299", yearlyPrice: "239", period: "per month",
    features: {
      en: ["Everything in Growth", "Unlimited voice minutes", "Unlimited Telegram messages", "Unlimited emails", "Dedicated account manager", "1-hour support response", "SSO & advanced security", "Custom contracts & SLA"],
      ua: ["Все з плану Зростання", "Безлімітні голосові хвилини", "Безлімітні повідомлення Telegram", "Безлімітні email", "Персональний менеджер", "Підтримка за 1 годину", "SSO та розширена безпека", "Індивідуальні контракти та SLA"],
      de: ["Alles aus Wachstum", "Unbegrenzte Sprachminuten", "Unbegrenzte Telegram-Nachrichten", "Unbegrenzte E-Mails", "Dedizierter Account-Manager", "1-Stunden Support-Antwort", "SSO & erweiterte Sicherheit", "Individuelle Verträge & SLA"],
      fr: ["Tout de Croissance", "Minutes vocales illimitées", "Messages Telegram illimités", "Emails illimités", "Gestionnaire de compte dédié", "Réponse support en 1 heure", "SSO & sécurité avancée", "Contrats personnalisés & SLA"],
      es: ["Todo de Crecimiento", "Minutos de voz ilimitados", "Mensajes Telegram ilimitados", "Emails ilimitados", "Gerente de cuenta dedicado", "Respuesta de soporte en 1 hora", "SSO y seguridad avanzada", "Contratos personalizados y SLA"],
      pl: ["Wszystko z planu Wzrost", "Nieograniczone minuty głosowe", "Nieograniczone wiadomości Telegram", "Nieograniczone emaile", "Dedykowany opiekun konta", "Odpowiedź wsparcia w 1 godzinę", "SSO i zaawansowane bezpieczeństwo", "Indywidualne kontrakty i SLA"],
      pt: ["Tudo do Crescimento", "Minutos de voz ilimitados", "Mensagens Telegram ilimitadas", "Emails ilimitados", "Gerente de conta dedicado", "Resposta de suporte em 1 hora", "SSO e segurança avançada", "Contratos personalizados e SLA"],
      ja: ["グロースの全機能", "無制限の音声通話", "無制限のTelegramメッセージ", "無制限のメール", "専任アカウントマネージャー", "1時間以内のサポート対応", "SSOと高度なセキュリティ", "カスタム契約とSLA"],
    },
    description: {
      en: "For large organizations with specific needs",
      ua: "Для великих організацій зі специфічними потребами",
      de: "Für große Organisationen mit spezifischen Anforderungen",
      fr: "Pour les grandes organisations aux besoins spécifiques",
      es: "Para grandes organizaciones con necesidades específicas",
      pl: "Dla dużych organizacji o specyficznych potrzebach",
      pt: "Para grandes organizações com necessidades específicas",
      ja: "特定のニーズを持つ大規模組織向け",
    },
    buttonText: {
      en: "Contact Sales", ua: "Зв'язатися з відділом продажів", de: "Vertrieb kontaktieren", fr: "Contacter les ventes", es: "Contactar ventas", pl: "Skontaktuj się ze sprzedażą", pt: "Fale com vendas", ja: "営業に問い合わせ",
    },
    href: "#cta", isPopular: false,
  },
];

export default function Home() {
  return (
    <>
      <div className="fixed z-0" style={{ top: 'calc(-1 * env(safe-area-inset-top, 0px))', bottom: 'calc(-1 * env(safe-area-inset-bottom, 0px))', left: 'calc(-1 * env(safe-area-inset-left, 0px))', right: 'calc(-1 * env(safe-area-inset-right, 0px))' }}>
        <EtheralShadow
          color="rgba(128, 128, 128, 1)"
          animation={{ scale: 80, speed: 86 }}
          noise={{ opacity: 0.6, scale: 1.2 }}
          sizing="fill"
        />
      </div>
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Features />
        <HowItWorks />
        <section id="pricing">
          <Pricing plans={pricingPlans} />
        </section>
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
