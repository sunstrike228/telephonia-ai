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
    name: "Starter",
    price: "40",
    yearlyPrice: "32",
    period: "per month",
    features: [
      "500 minutes / month",
      "1 phone number",
      "Basic analytics",
      "Ukrainian & English",
      "Community support",
    ],
    description: "Perfect for individuals and small projects",
    buttonText: "Start Free Trial",
    href: "#cta",
    isPopular: false,
  },
  {
    name: "Growth",
    price: "99",
    yearlyPrice: "79",
    period: "per month",
    features: [
      "5,000 minutes / month",
      "5 phone numbers",
      "CRM integrations",
      "Custom voice cloning",
      "Advanced analytics",
      "Priority support",
      "Team collaboration",
    ],
    description: "Ideal for growing teams and businesses",
    buttonText: "Get Started",
    href: "#cta",
    isPopular: true,
  },
  {
    name: "Enterprise",
    price: "299",
    yearlyPrice: "239",
    period: "per month",
    features: [
      "Everything in Growth",
      "Unlimited minutes",
      "Dedicated account manager",
      "1-hour support response",
      "SSO & advanced security",
      "Custom contracts & SLA",
    ],
    description: "For large organizations with specific needs",
    buttonText: "Contact Sales",
    href: "#cta",
    isPopular: false,
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
