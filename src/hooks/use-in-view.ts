"use client";
import { useEffect, useRef, useState } from "react";

export function useInView(threshold = 0.05) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) { setIsInView(true); return; }

    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "100px" }
    );
    observer.observe(el);

    // Fallback: if not triggered within 2s, force show
    const fallback = setTimeout(() => setIsInView(true), 2000);

    return () => { observer.disconnect(); clearTimeout(fallback); };
  }, [threshold]);

  return { ref, isInView };
}
