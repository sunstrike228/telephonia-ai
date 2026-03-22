"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DollarSign, HelpCircle, LayoutGrid } from "lucide-react";
import { useLang } from "@/hooks/use-lang";
import { GlassButton } from "@/components/ui/glass-button";

interface NavItem {
  name: string;
  nameUa: string;
  url: string;
  sectionId: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: "Features", nameUa: "Можливості", url: "#features", sectionId: "features", icon: LayoutGrid },
  { name: "Pricing", nameUa: "Ціни", url: "#pricing", sectionId: "pricing", icon: DollarSign },
  { name: "FAQ", nameUa: "FAQ", url: "#faq", sectionId: "faq", icon: HelpCircle },
];

export function Navbar() {
  const [activeTab, setActiveTab] = useState("");
  const [lang, switchLang] = useLang();

  // Track which section is in view via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    navItems.forEach((item) => {
      const el = document.getElementById(item.sectionId);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveTab(item.name);
          }
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <>
      {/* Desktop nav */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 pt-4 sm:pt-6 hidden md:block">
        <nav className="flex items-center gap-1 bg-[rgba(10,10,15,0.4)] border border-white/10 backdrop-blur-xl py-1.5 px-2 rounded-full shadow-lg shadow-black/20">
          <a href="#" onClick={() => setActiveTab("")} className="font-display font-bold text-base tracking-[-0.04em] px-3 py-1.5 mr-1">
            <span className="bg-gradient-to-r from-white via-white to-[#0090f0] bg-clip-text text-transparent">
              telephonia
            </span>
            <span className="text-[#0090f0]">.ai</span>
          </a>

          {navItems.map((item) => {
            const isActive = activeTab === item.name;
            return (
              <a
                key={item.name}
                href={item.url}
                onClick={() => setActiveTab(item.name)}
                className={cn(
                  "relative cursor-pointer text-[13px] font-semibold px-4 py-1.5 rounded-full transition-colors",
                  "text-white/60 hover:text-white",
                  isActive && "text-white"
                )}
              >
                {lang === "en" ? item.name : item.nameUa}
                {isActive && (
                  <motion.div
                    layoutId="tubelight"
                    className="absolute inset-0 w-full bg-white/[0.08] rounded-full -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-t-full">
                      <div className="absolute w-12 h-6 bg-white/20 rounded-full blur-md -top-2 -left-2" />
                      <div className="absolute w-8 h-6 bg-white/20 rounded-full blur-md -top-1" />
                      <div className="absolute w-4 h-4 bg-white/20 rounded-full blur-sm top-0 left-2" />
                    </div>
                  </motion.div>
                )}
              </a>
            );
          })}

          <div className="flex bg-white/5 rounded-full p-0.5 gap-0.5 mx-1">
            <button
              onClick={() => switchLang("en")}
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium transition-colors",
                lang === "en" ? "bg-white/15 text-white" : "text-white/50 hover:text-white"
              )}
            >
              EN
            </button>
            <button
              onClick={() => switchLang("ua")}
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium transition-colors",
                lang === "ua" ? "bg-white/15 text-white" : "text-white/50 hover:text-white"
              )}
            >
              UA
            </button>
          </div>

          <GlassButton href="#cta" className="glass-button-primary ml-1" size="sm">
            {lang === "en" ? "Get Access" : "Доступ"}
          </GlassButton>
        </nav>
      </div>

      {/* Mobile nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 mb-4 md:hidden">
        <nav className="flex items-center gap-2 bg-[rgba(10,10,15,0.6)] border border-white/10 backdrop-blur-xl py-2 px-3 rounded-full shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.url}
                onClick={() => setActiveTab(item.name)}
                className={cn(
                  "relative p-2 rounded-full transition-colors",
                  activeTab === item.name ? "text-white bg-white/10" : "text-white/50"
                )}
              >
                <Icon size={18} strokeWidth={2.5} />
              </a>
            );
          })}
          <div className="flex bg-white/5 rounded-full p-0.5 gap-0.5">
            <button onClick={() => switchLang("en")} className={cn("px-2 py-1 rounded-full text-[10px] font-medium", lang === "en" ? "bg-white/15 text-white" : "text-white/40")}>EN</button>
            <button onClick={() => switchLang("ua")} className={cn("px-2 py-1 rounded-full text-[10px] font-medium", lang === "ua" ? "bg-white/15 text-white" : "text-white/40")}>UA</button>
          </div>
        </nav>
      </div>
    </>
  );
}
