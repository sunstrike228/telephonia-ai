"use client";
import { createContext, useContext, useState, useEffect } from "react";

export type Lang = "en" | "ua";

// Simple global state (no context needed for this scale)
let listeners: Array<(l: Lang) => void> = [];
let currentLang: Lang = "en";

export function setGlobalLang(l: Lang) {
  currentLang = l;
  if (typeof window !== "undefined") localStorage.setItem("lang", l);
  listeners.forEach((fn) => fn(l));
}

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>(currentLang);

  useEffect(() => {
    const stored = localStorage.getItem("lang");
    if (stored === "ua") {
      currentLang = "ua";
      setLang("ua");
    }
    const listener = (l: Lang) => setLang(l);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((fn) => fn !== listener);
    };
  }, []);

  return [lang, setGlobalLang];
}
