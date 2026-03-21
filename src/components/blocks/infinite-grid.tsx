"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useMotionValue, useMotionTemplate, useAnimationFrame } from "framer-motion";

function GridPattern({ offsetX, offsetY }: { offsetX: any; offsetY: any }) {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-white/60" />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />
    </svg>
  );
}

export function InfiniteGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + 0.3) % 40);
    gridOffsetY.set((gridOffsetY.get() + 0.3) % 40);
  });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  }, [mouseX, mouseY]);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none">
      {/* Base grid */}
      <div className="absolute inset-0 opacity-[0.06]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>
      {/* Mouse reveal grid */}
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>
      {/* Glow orbs */}
      <div className="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full bg-orange-500/20 blur-[120px]" />
      <div className="absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full bg-[#0090f0]/20 blur-[100px]" />
      <div className="absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px]" />
    </div>
  );
}
