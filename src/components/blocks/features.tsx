"use client";

import { Tilt } from "@/components/ui/tilt";
import { Spotlight } from "@/components/ui/spotlight";
import { Phone, MessageSquare, Globe, BarChart3, Monitor, Shield } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const features = [
  { icon: Phone, color: "#0090f0", title: "Outbound Cold Calls", desc: "AI agents call your leads, qualify them, handle objections and book meetings — at scale. Hundreds of simultaneous calls, zero burnout." },
  { icon: MessageSquare, color: "#34d399", title: "Inbound Reception", desc: "Never miss a call. AI answers instantly, understands context, routes to the right department or resolves the inquiry on its own." },
  { icon: Globe, color: "#a78bfa", title: "Multilingual Native", desc: "Ukrainian and English — spoken natively, not translated. Natural accents, idioms, cultural context. Switches mid-call if needed." },
  { icon: BarChart3, color: "#fbbf24", title: "Real-Time Analytics", desc: "Every call transcribed, scored, and analyzed. See conversion rates, objection patterns, and sentiment — live in your dashboard." },
  { icon: Monitor, color: "#fb7185", title: "CRM Integration", desc: "Plug into your existing stack. HubSpot, Salesforce, Pipedrive, Close — call data flows directly into your pipeline." },
  { icon: Shield, color: "#36adff", title: "Custom Voice & Script", desc: "Clone any voice or pick from our library. Upload your sales script, define objection handlers, set the personality. Full control." },
];

export function Features() {
  const { ref, isInView } = useInView();
  const v = isInView ? 'reveal-visible' : '';

  return (
    <section id="features" className="relative py-32 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className={`reveal-hidden ${v} text-center mb-20`}>
          <span className="text-[#0090f0] text-sm font-semibold uppercase tracking-widest">What we do</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 font-display tracking-tight">
            One platform.<br />Every call handled.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className={`reveal-hidden ${v}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <Tilt rotationFactor={6} isRevese className="h-full">
                  <div className="relative rounded-2xl border border-white/10 bg-[rgba(18,18,26,0.95)] p-8 h-full overflow-hidden group hover:border-[rgba(0,144,240,0.3)] transition-colors duration-300">
                    <Spotlight size={200} />
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: `${f.color}15`, border: `1px solid ${f.color}30` }}>
                      <Icon size={24} stroke={f.color} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3 font-display">{f.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </Tilt>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
