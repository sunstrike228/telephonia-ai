"use client";

import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";

interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  description: string;
  buttonText: string;
  href: string;
  isPopular: boolean;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

export function Pricing({
  plans,
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support.",
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef<HTMLButtonElement>(null);

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: [
          "#0090f0",
          "#a78bfa",
          "#34d399",
          "#36adff",
        ],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-white font-display">
          {title}
        </h2>
        <p className="text-white/50 text-lg whitespace-pre-line">
          {description}
        </p>
      </div>

      <div className="flex justify-center mb-10 items-center">
        <label className="relative inline-flex items-center cursor-pointer">
          <Label>
            <Switch
              ref={switchRef as React.Ref<HTMLButtonElement>}
              checked={!isMonthly}
              onCheckedChange={handleToggle}
              className="relative data-[state=checked]:bg-[#0090f0] data-[state=unchecked]:bg-white/20"
            />
          </Label>
        </label>
        <span className="ml-3 font-semibold text-white text-sm">
          Annual billing <span className="text-[#0090f0]">(Save 20%)</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ y: 50, opacity: 0 }}
            whileInView={
              isDesktop
                ? {
                    y: plan.isPopular ? -20 : 0,
                    opacity: 1,
                    x: index === 2 ? -30 : index === 0 ? 30 : 0,
                    scale: index === 0 || index === 2 ? 0.94 : 1.0,
                  }
                : { y: 0, opacity: 1 }
            }
            viewport={{ once: true }}
            transition={{
              duration: 1.6,
              type: "spring",
              stiffness: 100,
              damping: 30,
              delay: 0.4,
              opacity: { duration: 0.5 },
            }}
            className={cn(
              "rounded-2xl border p-6 text-center lg:flex lg:flex-col lg:justify-center relative",
              "flex flex-col",
              plan.isPopular
                ? "border-[#0090f0] border-2 bg-[rgba(0,144,240,0.06)]"
                : "border-white/10 bg-[rgba(18,18,26,0.95)]",
              !plan.isPopular && "mt-5",
              index === 0 && "z-0 origin-right",
              index === 2 && "z-0 origin-left",
              index === 1 && "z-10",
            )}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-[#0090f0] py-0.5 px-2 rounded-bl-xl rounded-tr-xl flex items-center">
                <Star className="text-white h-4 w-4 fill-current" />
                <span className="text-white ml-1 font-sans font-semibold text-sm">
                  Popular
                </span>
              </div>
            )}
            <div className="flex-1 flex flex-col">
              <p className="text-base font-semibold text-white/50 uppercase tracking-wider">
                {plan.name}
              </p>
              <div className="mt-6 flex items-center justify-center gap-x-2">
                <span className="text-5xl font-bold tracking-tight text-white font-display">
                  <NumberFlow
                    value={
                      isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                    }
                    format={{
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }}
                    transformTiming={{
                      duration: 500,
                      easing: "ease-out",
                    }}
                    willChange
                    className="tabular-nums"
                  />
                </span>
                {plan.period !== "Next 3 months" && (
                  <span className="text-sm font-semibold leading-6 tracking-wide text-white/40">
                    / {plan.period}
                  </span>
                )}
              </div>
              <p className="text-xs leading-5 text-white/30 mt-1">
                {isMonthly ? "billed monthly" : "billed annually"}
              </p>

              <ul className="mt-5 gap-2 flex flex-col text-left">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-white/60">
                    <Check className="h-4 w-4 text-[#0090f0] mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <hr className="w-full my-4 border-white/10" />

              <Link
                href={plan.href}
                className={cn(
                  "group relative w-full gap-2 overflow-hidden text-sm font-semibold tracking-tight",
                  "inline-flex items-center justify-center rounded-lg h-11 px-4",
                  "transform-gpu ring-offset-current transition-all duration-300 ease-out",
                  "hover:ring-2 hover:ring-[#0090f0] hover:ring-offset-1",
                  plan.isPopular
                    ? "bg-[#0090f0] text-white hover:bg-[#0090f0]/90"
                    : "bg-white/5 border border-white/10 text-white hover:bg-[#0090f0] hover:text-white hover:border-[#0090f0]"
                )}
              >
                {plan.buttonText}
              </Link>

              <p className="mt-6 text-xs leading-5 text-white/30">
                {plan.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
