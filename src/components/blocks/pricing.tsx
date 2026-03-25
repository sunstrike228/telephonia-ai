"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GlassButton } from "@/components/ui/glass-button";
import { useInView } from "@/hooks/use-in-view";
import { useLang, type Lang } from "@/hooks/use-lang";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";

/* ── Shader Canvas (WebGL ring animation) ── */
function ShaderCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const bgLocRef = useRef<WebGLUniformLocation | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, alpha: true });
    if (!gl) return;
    glRef.current = gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const vs = `attribute vec2 aPosition; void main(){ gl_Position=vec4(aPosition,0.,1.); }`;
    const fs = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec3 uBg;

      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){
        vec2 i=floor(p),f=fract(p);
        f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
      }
      float fbm(vec2 p){
        float v=0.0,a=0.5;
        for(int i=0;i<4;i++){v+=a*noise(p);p*=2.0;a*=0.5;}
        return v;
      }

      void main(){
        vec2 uv=gl_FragCoord.xy/iResolution.xy;
        float aspect=iResolution.x/iResolution.y;
        uv.x*=aspect;
        vec2 c=vec2(aspect*0.5,0.58);
        float r=0.38;

        // Distance with subtle organic wobble
        vec2 d=uv-c;
        float angle=atan(d.y,d.x);
        float dist=length(d);
        dist+=sin(angle*5.0+iTime*0.8)*0.006;
        dist+=sin(angle*8.0-iTime*1.2)*0.003;
        dist+=fbm(vec2(angle*1.5,iTime*0.3))*0.008;

        // Ring mask — single clean band
        float ring=smoothstep(r-0.035,r-0.01,dist)*smoothstep(r+0.035,r+0.01,dist);
        // Soft outer glow
        float glow=smoothstep(r-0.08,r,dist)*smoothstep(r+0.08,r,dist)*0.15;
        float m=clamp(ring+glow,0.0,1.0);

        // === BLACK RING with subtle edge light ===
        // Base: very dark, almost black
        vec3 col=vec3(0.03);

        // Subtle edge highlight — faint white on edges
        float edgeDist=abs(dist-r)/0.035;
        float edge=pow(clamp(edgeDist,0.0,1.0),0.6);
        col=mix(col,vec3(0.12),edge*0.5);

        // One slow-moving faint specular glint
        float spec=pow(max(0.0,cos(angle-iTime*0.3)),30.0);
        col+=vec3(0.15)*spec*0.4;

        // Thin bright edge line
        float edgeLine=smoothstep(0.002,0.0,abs(dist-r))*0.3;
        col+=vec3(0.2)*edgeLine;

        gl_FragColor=vec4(col,m);
      }`;

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s); return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const iTimeLoc = gl.getUniformLocation(prog, "iTime");
    const iResLoc = gl.getUniformLocation(prog, "iResolution");
    bgLocRef.current = gl.getUniformLocation(prog, "uBg");
    gl.uniform3fv(bgLocRef.current, [0.04, 0.04, 0.06]);

    let af: number;
    const render = (t: number) => {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(iTimeLoc, t * 0.001);
      gl.uniform2f(iResLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      af = requestAnimationFrame(render);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = parent.clientWidth * dpr;
      canvas.height = parent.clientHeight * dpr;
      canvas.style.width = parent.clientWidth + "px";
      canvas.style.height = parent.clientHeight + "px";
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);
    af = requestAnimationFrame(render);

    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(af); };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />;
}

/* ── Check Icon ── */
const CheckIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/* ── Types ── */
interface PricingPlan {
  name: Record<Lang, string>;
  price: string;
  yearlyPrice: string;
  period: string;
  features: Record<Lang, string[]>;
  description: Record<Lang, string>;
  buttonText: Record<Lang, string>;
  href: string;
  isPopular: boolean;
}

interface PricingProps {
  plans: PricingPlan[];
}

const sectionText: Record<Lang, { title: string; description: string; annual: string; save: string; monthly: string; yearly: string; mo: string; popular: string }> = {
  en: { title: "Simple, Transparent Pricing", description: "Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support.", annual: "Annual billing", save: "Save 20%", monthly: "billed monthly", yearly: "billed annually", mo: "/mo", popular: "Most Popular" },
  ua: { title: "Прості, прозорі ціни", description: "Оберіть план, який підходить вам\nУсі плани включають доступ до платформи, інструменти генерації лідів та підтримку.", annual: "Річна оплата", save: "Економія 20%", monthly: "щомісячна оплата", yearly: "річна оплата", mo: "/міс", popular: "Найпопулярніший" },
  de: { title: "Einfache, transparente Preise", description: "Wählen Sie den Plan, der zu Ihnen passt\nAlle Pläne beinhalten Zugang zur Plattform, Lead-Generierung und dedizierten Support.", annual: "Jährliche Abrechnung", save: "20% sparen", monthly: "monatliche Abrechnung", yearly: "jährliche Abrechnung", mo: "/Mo", popular: "Am beliebtesten" },
  fr: { title: "Tarifs simples et transparents", description: "Choisissez le plan qui vous convient\nTous les plans incluent l'accès à la plateforme, les outils de génération de leads et un support dédié.", annual: "Facturation annuelle", save: "Économisez 20%", monthly: "facturé mensuellement", yearly: "facturé annuellement", mo: "/mois", popular: "Le plus populaire" },
  es: { title: "Precios simples y transparentes", description: "Elija el plan que mejor le funcione\nTodos los planes incluyen acceso a la plataforma, herramientas de generación de leads y soporte dedicado.", annual: "Facturación anual", save: "Ahorre 20%", monthly: "facturado mensualmente", yearly: "facturado anualmente", mo: "/mes", popular: "Más popular" },
  pl: { title: "Proste, przejrzyste ceny", description: "Wybierz plan, który Ci odpowiada\nWszystkie plany obejmują dostęp do platformy, narzędzia do generowania leadów i dedykowane wsparcie.", annual: "Rozliczenie roczne", save: "Oszczędź 20%", monthly: "rozliczenie miesięczne", yearly: "rozliczenie roczne", mo: "/mies", popular: "Najpopularniejszy" },
  pt: { title: "Preços simples e transparentes", description: "Escolha o plano que funciona para você\nTodos os planos incluem acesso à plataforma, ferramentas de geração de leads e suporte dedicado.", annual: "Cobrança anual", save: "Economize 20%", monthly: "cobrado mensalmente", yearly: "cobrado anualmente", mo: "/mês", popular: "Mais popular" },
  ja: { title: "シンプルで透明な料金", description: "あなたに合ったプランをお選びください\nすべてのプランにプラットフォームへのアクセス、リード生成ツール、専任サポートが含まれます。", annual: "年間請求", save: "20%節約", monthly: "月額請求", yearly: "年間請求", mo: "/月", popular: "最も人気" },
};

/* ── Main Component ── */
export function Pricing({ plans }: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const switchRef = useRef<HTMLButtonElement>(null);
  const { ref: sectionRef, isInView } = useInView();
  const v = isInView ? 'reveal-visible' : '';
  const [lang] = useLang();
  const st = sectionText[lang] || sectionText.en;

  const handleToggle = (checked: boolean) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight },
        colors: ["#0090f0", "#ff4d4d", "#34d399", "#ff6b6b"],
        ticks: 200, gravity: 1.2, decay: 0.94, startVelocity: 30, shapes: ["circle"],
      });
    }
  };

  return (
    <div className="relative overflow-hidden py-28" ref={sectionRef}>
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-[48px] md:text-[64px] font-extralight leading-tight tracking-[-0.03em] text-white font-display">
            {st.title}
          </h2>
          <p className="mt-3 text-base md:text-lg text-white/80 max-w-2xl mx-auto whitespace-pre-line">
            {st.description}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12 items-center">
          <label className="relative inline-flex items-center cursor-pointer">
            <Label>
              <Switch
                ref={switchRef as React.Ref<HTMLButtonElement>}
                checked={!isMonthly}
                onCheckedChange={handleToggle}
                className="relative data-[state=checked]:bg-red-400 data-[state=unchecked]:bg-white/20"
              />
            </Label>
          </label>
          <span className="ml-3 font-semibold text-white text-sm">
            {st.annual} <span className="text-red-400">({st.save})</span>
          </span>
        </div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-6 justify-center items-center">
          {plans.map((plan) => {
            const planName = plan.name[lang] || plan.name.en;
            const planDesc = plan.description[lang] || plan.description.en;
            const planFeatures = plan.features[lang] || plan.features.en;
            const planBtn = plan.buttonText[lang] || plan.buttonText.en;

            return (
              <div
                key={plan.name.en}
                className={cn(
                  `reveal-hidden ${v}`,
                  "rounded-2xl shadow-xl flex-1 max-w-xs px-7 py-8 flex flex-col transition-all duration-300",
                  "border",
                  plan.isPopular
                    ? "scale-105 relative ring-2 ring-red-400/20 border-red-400/30 shadow-2xl bg-[rgba(14,14,14,0.97)]"
                    : "border-white/10 bg-[rgba(0,0,0,0.97)] mt-6"
                )}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 right-4 px-3 py-1 text-[12px] font-semibold rounded-full bg-red-400 text-black">
                    {st.popular}
                  </div>
                )}

                {/* Plan name */}
                <div className="mb-3">
                  <h3 className="text-[28px] md:text-[34px] font-extralight tracking-[-0.03em] text-white font-display leading-tight">
                    {planName}
                  </h3>
                  <p className="text-sm text-white/50 mt-1">{planDesc}</p>
                </div>

                {/* Price */}
                <div className="my-6 flex items-baseline gap-2">
                  <span className="text-[48px] font-extralight text-white font-display">
                    <NumberFlow
                      value={isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)}
                      format={{ style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }}
                      transformTiming={{ duration: 500, easing: "ease-out" }}
                      willChange
                      className="tabular-nums"
                    />
                  </span>
                  <span className="text-sm text-white/40">{st.mo}</span>
                </div>
                <p className="text-xs text-white/25 -mt-4 mb-4">
                  {isMonthly ? st.monthly : st.yearly}
                </p>

                {/* Divider */}
                <div className="w-full mb-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

                {/* Features */}
                <ul className="flex flex-col gap-2 text-sm text-white/70 mb-6">
                  {planFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckIcon className="text-red-400 w-4 h-4 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <GlassButton
                  className={cn(
                    "mt-auto w-full",
                    plan.isPopular ? "glass-button-cyan" : ""
                  )}
                  size="sm"
                >
                  {planBtn}
                </GlassButton>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
