"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { GlassButton } from "@/components/ui/glass-button";
import { useInView } from "@/hooks/use-in-view";
import { useLang } from "@/hooks/use-lang";
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
      mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
      float var2(vec2 v1,vec2 v2,float str,float spd){return sin(dot(normalize(v1),normalize(v2))*str+iTime*spd)/100.;}
      vec3 circle(vec2 uv,vec2 ctr,float r,float w){
        vec2 d=ctr-uv;float l=length(d);
        l+=var2(d,vec2(0.,1.),5.,2.);l-=var2(d,vec2(1.,0.),5.,2.);
        return vec3(smoothstep(r-w,r,l)-smoothstep(r,r+w,l));
      }
      void main(){
        vec2 uv=gl_FragCoord.xy/iResolution.xy;
        float aspect=iResolution.x/iResolution.y;
        uv.x*=aspect;
        vec2 c=vec2(aspect*0.5,0.5);float r=.4;
        float m=0.;
        m+=circle(uv,c,r,.035).r;
        m+=circle(uv,c,r-.018,.01).r;
        m+=circle(uv,c,r+.018,.005).r;
        vec2 v=rot(iTime*0.5)*uv;
        float silver=0.5+0.5*sin(v.x*3.0+v.y*2.0+iTime);
        vec3 fg=vec3(0.75+0.25*silver, 0.78+0.22*silver, 0.82+0.18*silver);
        float alpha=m;
        vec3 col=fg;
        col=mix(col,vec3(1.),circle(uv,c,r,.003).r);
        gl_FragColor=vec4(col,alpha);
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
  name: string;
  nameUa?: string;
  price: string;
  yearlyPrice: string;
  period: string;
  features: string[];
  featuresUa?: string[];
  description: string;
  descriptionUa?: string;
  buttonText: string;
  buttonTextUa?: string;
  href: string;
  isPopular: boolean;
}

interface PricingProps {
  plans: PricingPlan[];
  title?: string;
  description?: string;
}

/* ── Main Component ── */
export function Pricing({
  plans,
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support.",
}: PricingProps) {
  const [isMonthly, setIsMonthly] = useState(true);
  const switchRef = useRef<HTMLButtonElement>(null);
  const { ref: sectionRef, isInView } = useInView();
  const v = isInView ? 'reveal-visible' : '';
  const [lang] = useLang();
  const ua = lang === "ua";

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
      {/* Shader ring background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[900px] h-[900px] opacity-25">
          <ShaderCanvas />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-[48px] md:text-[64px] font-extralight leading-tight tracking-[-0.03em] text-white font-display">
            {ua ? "Прості, прозорі ціни" : title}
          </h2>
          <p className="mt-3 text-base md:text-lg text-white/50 max-w-2xl mx-auto whitespace-pre-line">
            {ua ? "Оберіть план, який підходить вам\nУсі плани включають доступ до платформи, інструменти генерації лідів та підтримку." : description}
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
                className="relative data-[state=checked]:bg-cyan-400 data-[state=unchecked]:bg-white/20"
              />
            </Label>
          </label>
          <span className="ml-3 font-semibold text-white text-sm">
            {ua ? "Річна оплата" : "Annual billing"} <span className="text-cyan-400">{ua ? "(Економія 20%)" : "(Save 20%)"}</span>
          </span>
        </div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-6 justify-center items-center">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={cn(
                `reveal-hidden ${v}`,
                "rounded-2xl shadow-xl flex-1 max-w-xs px-7 py-8 flex flex-col transition-all duration-300",
                "border",
                plan.isPopular
                  ? "scale-105 relative ring-2 ring-cyan-400/20 border-cyan-400/30 shadow-2xl bg-[rgba(12,18,30,0.97)] mt-6"
                  : "border-white/10 bg-[rgba(14,14,22,0.97)]"
              )}
            >
              {plan.isPopular && (
                <div className="absolute -top-4 right-4 px-3 py-1 text-[12px] font-semibold rounded-full bg-cyan-400 text-black">
                  {ua ? "Найпопулярніший" : "Most Popular"}
                </div>
              )}

              {/* Plan name */}
              <div className="mb-3">
                <h3 className="text-[28px] md:text-[34px] font-extralight tracking-[-0.03em] text-white font-display leading-tight">
                  {ua ? (plan.nameUa || plan.name) : plan.name}
                </h3>
                <p className="text-sm text-white/50 mt-1">{ua ? (plan.descriptionUa || plan.description) : plan.description}</p>
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
                <span className="text-sm text-white/40">{ua ? "/міс" : "/mo"}</span>
              </div>
              <p className="text-xs text-white/25 -mt-4 mb-4">
                {isMonthly ? (ua ? "щомісячна оплата" : "billed monthly") : (ua ? "річна оплата" : "billed annually")}
              </p>

              {/* Divider */}
              <div className="w-full mb-5 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              {/* Features */}
              <ul className="flex flex-col gap-2 text-sm text-white/70 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckIcon className="text-cyan-400 w-4 h-4 flex-shrink-0" />
                    {ua ? (plan.featuresUa?.[idx] || feature) : feature}
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
                {ua ? (plan.buttonTextUa || plan.buttonText) : plan.buttonText}
              </GlassButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
