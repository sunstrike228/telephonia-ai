"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Can people tell it's not a real person?",
    a: "In blind tests, 98% of listeners couldn't distinguish our AI agents from human callers. We use state-of-the-art voice synthesis with natural pauses, filler words, and emotional intonation.",
  },
  {
    q: "What languages do you support?",
    a: "Ukrainian and English — both spoken natively. The agent can switch languages mid-conversation if the caller prefers a different language.",
  },
  {
    q: "How fast does the AI respond?",
    a: "Under 0.5 second end-to-end latency. The conversation feels completely natural — no awkward pauses or robotic delays.",
  },
  {
    q: "Can I use my own phone number?",
    a: "Yes. Port your existing number or get new ones from us. We support Ukrainian, European and US phone numbers via SIP trunking.",
  },
  {
    q: "Is it legal to use AI for calls?",
    a: "Yes, when used in compliance with local regulations. We help you stay compliant with disclosure requirements and do-not-call lists. Enterprise plans include a compliance consultation.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-32 overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-[#0090f0] text-sm font-semibold uppercase tracking-widest">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 font-display tracking-tight">
            Questions & Answers
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border-b border-white/8 cursor-pointer"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <div className="flex items-center justify-between py-6">
                <h3 className="text-base font-medium text-white pr-8">{faq.q}</h3>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 text-white/30 flex-shrink-0" />
                </motion.div>
              </div>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm text-white/55 pb-6">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
