"use client";

import { useLang } from "@/hooks/use-lang";

export function Footer() {
  const [lang] = useLang();
  const ua = lang === "ua";

  return (
    <footer className="border-t border-white/5 py-12 relative z-10 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col">
          <div className="font-display font-bold text-lg tracking-[-0.04em] inline-flex items-center gap-1.5">
            <span className="text-white">project</span>
            <span className="bg-white text-black px-1.5 py-0.5 rounded-[4px] text-[14px] leading-none font-bold">noir</span>
          </div>
          <span className="text-[10px] text-white/20 mt-0.5">A product by Void Research</span>
        </div>
        <div className="flex gap-8 text-sm text-white/30">
          <a href="#" className="hover:text-white/60 transition-colors">{ua ? "Конфіденційність" : "Privacy"}</a>
          <a href="#" className="hover:text-white/60 transition-colors">{ua ? "Умови" : "Terms"}</a>
          <a href="mailto:hello@projectnoir.ai" className="hover:text-white/60 transition-colors">
            hello@projectnoir.ai
          </a>
        </div>
        <div className="text-xs text-white/20">&copy; 2026 Void Research</div>
      </div>
    </footer>
  );
}
