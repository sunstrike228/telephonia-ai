"use client";

import { motion } from "framer-motion";
import { Tilt } from "@/components/ui/tilt";
import { Spotlight } from "@/components/ui/spotlight";

const steps = [
  { num: "1", color: "#0090f0", title: "Upload Your Script", desc: "Paste your sales script or describe your use case. Our AI adapts to your industry and tone." },
  { num: "2", color: "#a78bfa", title: "Choose Voice & Language", desc: "Pick from our voice library or clone your own. Set primary language and fallback behavior." },
  { num: "3", color: "#34d399", title: "Launch & Monitor", desc: "Connect your phone number, upload leads, and go live. Watch calls happen in real time from your dashboard." },
];

export function HowItWorks() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#0090f0] text-sm font-semibold uppercase tracking-widest">How it works</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 font-display tracking-tight">Live in 3 steps</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Tilt rotationFactor={6} isRevese className="h-full">
                <div className="relative rounded-2xl border border-white/10 bg-[rgba(16,16,24,0.94)] p-8 overflow-hidden h-full group hover:border-white/18 transition-colors">
                  <Spotlight size={200} />
                  <div
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-5"
                    style={{ background: `${s.color}18`, border: `1px solid ${s.color}35` }}
                  >
                    <span className="text-lg font-bold font-display" style={{ color: s.color }}>{s.num}</span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-white mb-3">{s.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
