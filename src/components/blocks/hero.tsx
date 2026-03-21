"use client";

import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-[0.95] font-display"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          AI agents that
          <br />
          <span className="bg-gradient-to-r from-[#36adff] via-[#78c8ff] to-[#a78bfa] bg-clip-text text-transparent">
            sound human.
          </span>
          <br />
          Sell like pros.
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Replace your cold-calling team with AI voice agents indistinguishable
          from real humans. Never sleep. Sell like pros. Affordable pricing.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <a
            href="#cta"
            className="group relative overflow-hidden px-8 py-4 rounded-full text-base font-semibold text-white bg-[rgba(0,144,240,0.15)] border border-[rgba(0,144,240,0.25)] backdrop-blur-sm hover:bg-[rgba(0,144,240,0.25)] hover:scale-[1.04] active:scale-[0.97] transition-all duration-300"
          >
            Request Early Access
          </a>
          <button
            className="group relative overflow-hidden px-8 py-4 rounded-full text-base font-medium text-white/80 bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:bg-white/[0.08] hover:scale-[1.04] active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-3"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-[#0090f0]">
              <polygon points="5,3 17,10 5,17" />
            </svg>
            Listen to a Demo Call
          </button>
        </motion.div>
      </div>
    </section>
  );
}
