"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X, Sparkles, DollarSign, HelpCircle, LayoutGrid } from "lucide-react";

interface NavItem {
  name: string;
  nameUa: string;
  url: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { name: "Features", nameUa: "Можливості", url: "#features", icon: LayoutGrid },
  { name: "Pricing", nameUa: "Ціни", url: "#pricing", icon: DollarSign },
  { name: "FAQ", nameUa: "FAQ", url: "#faq", icon: HelpCircle },
];

export function Navbar() {
  const [activeTab, setActiveTab] = useState("");
  const [lang, setLang] = useState<"en" | "ua">("en");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (stored === "ua") setLang("ua");
  }, []);

  const switchLang = (l: "en" | "ua") => {
    setLang(l);
    localStorage.setItem("lang", l);
    document.documentElement.setAttribute("data-lang", l);
  };

  return (
    <>
      {/* Desktop nav */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 pt-4 sm:pt-6 hidden md:block">
        <nav className="flex items-center gap-1 bg-[rgba(10,10,15,0.4)] border border-white/10 backdrop-blur-xl py-1.5 px-2 rounded-full shadow-lg shadow-black/20">
          <a href="#" className="font-display font-bold text-base tracking-[-0.04em] px-3 py-1.5 mr-1">
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
                  isActive && "text-[#36adff]"
                )}
              >
                {lang === "en" ? item.name : item.nameUa}
                {isActive && (
                  <motion.div
                    layoutId="tubelight"
                    className="absolute inset-0 w-full bg-[#0090f0]/8 rounded-full -z-10"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#0090f0] rounded-t-full">
                      <div className="absolute w-12 h-6 bg-[#0090f0]/20 rounded-full blur-md -top-2 -left-2" />
                      <div className="absolute w-8 h-6 bg-[#0090f0]/20 rounded-full blur-md -top-1" />
                      <div className="absolute w-4 h-4 bg-[#0090f0]/20 rounded-full blur-sm top-0 left-2" />
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
                lang === "en" ? "bg-[#0090f0]/20 text-[#36adff]" : "text-white/50 hover:text-white"
              )}
            >
              EN
            </button>
            <button
              onClick={() => switchLang("ua")}
              className={cn(
                "px-2 py-1 rounded-full text-xs font-medium transition-colors",
                lang === "ua" ? "bg-[#0090f0]/20 text-[#36adff]" : "text-white/50 hover:text-white"
              )}
            >
              UA
            </button>
          </div>

          <a
            href="#cta"
            className="px-4 py-1.5 rounded-full text-xs font-semibold text-white ml-1 bg-[rgba(0,144,240,0.15)] border border-[rgba(0,144,240,0.25)] backdrop-blur-sm hover:bg-[rgba(0,144,240,0.25)] transition-colors"
          >
            {lang === "en" ? "Get Access" : "Доступ"}
          </a>
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
                  activeTab === item.name ? "text-[#36adff] bg-[#0090f0]/10" : "text-white/50"
                )}
              >
                <Icon size={18} strokeWidth={2.5} />
              </a>
            );
          })}
          <div className="flex bg-white/5 rounded-full p-0.5 gap-0.5">
            <button onClick={() => switchLang("en")} className={cn("px-2 py-1 rounded-full text-[10px] font-medium", lang === "en" ? "bg-[#0090f0]/20 text-[#36adff]" : "text-white/40")}>EN</button>
            <button onClick={() => switchLang("ua")} className={cn("px-2 py-1 rounded-full text-[10px] font-medium", lang === "ua" ? "bg-[#0090f0]/20 text-[#36adff]" : "text-white/40")}>UA</button>
          </div>
        </nav>
      </div>
    </>
  );
}
