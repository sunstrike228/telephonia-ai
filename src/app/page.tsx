"use client";

import { Navbar } from "@/components/blocks/navbar";
import { InfiniteGrid } from "@/components/blocks/infinite-grid";
import { Hero } from "@/components/blocks/hero";
import { Features } from "@/components/blocks/features";
import { HowItWorks } from "@/components/blocks/how-it-works";
import { Pricing } from "@/components/blocks/pricing";
import { FAQ } from "@/components/blocks/faq";
import { CTA } from "@/components/blocks/cta";
import { Footer } from "@/components/blocks/footer";

const pricingPlans = [
  {
    name: "Starter", nameUa: "Старт",
    price: "40", yearlyPrice: "32", period: "per month",
    features: ["500 minutes / month", "1 phone number", "Basic analytics", "Ukrainian & English", "Community support"],
    featuresUa: ["500 хвилин / місяць", "1 номер телефону", "Базова аналітика", "Українська та англійська", "Підтримка спільноти"],
    description: "Perfect for individuals and small projects",
    descriptionUa: "Ідеально для індивідуальних та малих проєктів",
    buttonText: "Start Free Trial", buttonTextUa: "Спробувати безкоштовно",
    href: "#cta", isPopular: false,
  },
  {
    name: "Growth", nameUa: "Зростання",
    price: "99", yearlyPrice: "79", period: "per month",
    features: ["5,000 minutes / month", "5 phone numbers", "CRM integrations", "Custom voice cloning", "Advanced analytics", "Priority support", "Team collaboration"],
    featuresUa: ["5 000 хвилин / місяць", "5 номерів телефону", "Інтеграція з CRM", "Клонування голосу", "Розширена аналітика", "Пріоритетна підтримка", "Командна робота"],
    description: "Ideal for growing teams and businesses",
    descriptionUa: "Ідеально для команд та бізнесів, що зростають",
    buttonText: "Get Started", buttonTextUa: "Почати",
    href: "#cta", isPopular: true,
  },
  {
    name: "Enterprise", nameUa: "Корпоративний",
    price: "299", yearlyPrice: "239", period: "per month",
    features: ["Everything in Growth", "Unlimited minutes", "Dedicated account manager", "1-hour support response", "SSO & advanced security", "Custom contracts & SLA"],
    featuresUa: ["Все з плану Зростання", "Безлімітні хвилини", "Персональний менеджер", "Підтримка за 1 годину", "SSO та розширена безпека", "Індивідуальні контракти та SLA"],
    description: "For large organizations with specific needs",
    descriptionUa: "Для великих організацій зі специфічними потребами",
    buttonText: "Contact Sales", buttonTextUa: "Зв'язатися з відділом продажів",
    href: "#cta", isPopular: false,
  },
];

export default function Home() {
  return (
    <>
      <InfiniteGrid />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Features />
        <HowItWorks />
        <section id="pricing">
          <Pricing
            plans={pricingPlans}
            title="Simple, Transparent Pricing"
            description={"Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support."}
          />
        </section>
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
