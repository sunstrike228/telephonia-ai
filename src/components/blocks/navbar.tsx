"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DollarSign, HelpCircle, LayoutGrid, ChevronDown, Globe } from "lucide-react";
import { useLang, type Lang } from "@/hooks/use-lang";
import { GlassButton } from "@/components/ui/glass-button";

interface NavItem {
  name: string;
  names: Record<Lang, string>;
  url: string;
  sectionId: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: "Features", names: { en: "Features", ua: "Можливості", de: "Funktionen", fr: "Fonctions", es: "Funciones", pl: "Funkcje", pt: "Recursos", ja: "機能" }, url: "#features", sectionId: "features", icon: LayoutGrid },
  { name: "Pricing", names: { en: "Pricing", ua: "Ціни", de: "Preise", fr: "Tarifs", es: "Precios", pl: "Cennik", pt: "Preços", ja: "料金" }, url: "#pricing", sectionId: "pricing", icon: DollarSign },
  { name: "FAQ", names: { en: "FAQ", ua: "FAQ", de: "FAQ", fr: "FAQ", es: "FAQ", pl: "FAQ", pt: "FAQ", ja: "FAQ" }, url: "#faq", sectionId: "faq", icon: HelpCircle },
];

const ctaText: Record<Lang, string> = {
  en: "Get Access", ua: "Доступ", de: "Zugang", fr: "Accès", es: "Acceso", pl: "Dostęp", pt: "Acesso", ja: "アクセス",
};

interface LangOption {
  code: Lang;
  flag: string;
  label: string;
  short: string;
}

const LANGUAGES: LangOption[] = [
  { code: "en", flag: "\u{1F1EC}\u{1F1E7}", label: "English", short: "EN" },
  { code: "ua", flag: "\u{1F1FA}\u{1F1E6}", label: "Українська", short: "UA" },
  { code: "de", flag: "\u{1F1E9}\u{1F1EA}", label: "Deutsch", short: "DE" },
  { code: "fr", flag: "\u{1F1EB}\u{1F1F7}", label: "Français", short: "FR" },
  { code: "es", flag: "\u{1F1EA}\u{1F1F8}", label: "Español", short: "ES" },
  { code: "pl", flag: "\u{1F1F5}\u{1F1F1}", label: "Polski", short: "PL" },
  { code: "pt", flag: "\u{1F1F5}\u{1F1F9}", label: "Português", short: "PT" },
  { code: "ja", flag: "\u{1F1EF}\u{1F1F5}", label: "日本語", short: "JA" },
];

function LanguageDropdown({ lang, switchLang, size = "default" }: { lang: Lang; switchLang: (l: Lang) => void; size?: "default" | "small" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];
  const isSmall = size === "small";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 rounded-full transition-colors duration-200",
          "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white",
          isSmall ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs"
        )}
      >
        <span className={isSmall ? "text-sm" : "text-base"}>{current.flag}</span>
        <span className="font-medium">{current.short}</span>
        <ChevronDown size={isSmall ? 10 : 12} className={cn("text-white/30 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div className={cn(
          "absolute z-[100] mt-2 w-48 py-1.5 rounded-xl border border-white/10 bg-[rgba(10,10,15,0.92)] backdrop-blur-xl shadow-2xl shadow-black/40",
          isSmall ? "bottom-full mb-2" : "top-full"
        )}>
          {LANGUAGES.map((option) => (
            <button
              key={option.code}
              onClick={() => { switchLang(option.code); setOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150",
                lang === option.code
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              )}
            >
              <span className="text-base">{option.flag}</span>
              <span className="flex-1 text-left">{option.label}</span>
              {lang === option.code && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#ff4d4d]"><path d="M20 6 9 17l-5-5"/></svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

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
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 pt-4 sm:pt-6 hidden md:flex items-center gap-3">
        <a href="/dashboard" className="self-stretch flex items-center bg-[rgba(10,10,15,0.4)] border border-white/10 backdrop-blur-xl px-4 rounded-full shadow-lg shadow-black/20 text-[13px] font-semibold text-white/60 hover:text-white transition-colors">
          <span className="translate-y-[0.5px]">Dashboard</span>
        </a>

        <nav className="flex items-center gap-1 bg-[rgba(10,10,15,0.4)] border border-white/10 backdrop-blur-xl py-1.5 px-2 rounded-full shadow-lg shadow-black/20">
          <a href="#" onClick={() => setActiveTab("")} className="font-display font-bold text-base tracking-[-0.04em] px-3 py-1.5 mr-1 inline-flex items-center gap-1.5">
            <span className="text-white">project</span>
            <span className="bg-white text-black px-1.5 py-0.5 rounded-[4px] text-[13px] leading-none font-bold">noir</span>
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
                {item.names[lang] || item.names.en}
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

          <LanguageDropdown lang={lang} switchLang={switchLang} />

          <GlassButton href="#cta" className="glass-button-primary ml-1" size="sm">
            {ctaText[lang] || ctaText.en}
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
          <LanguageDropdown lang={lang} switchLang={switchLang} size="small" />
        </nav>
      </div>
    </>
  );
}
