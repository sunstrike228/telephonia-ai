"use client";
import { useState, useEffect } from "react";

export type Lang = "en" | "ua" | "de" | "fr" | "es" | "pl" | "pt" | "ja";

const SUPPORTED_LANGS: Lang[] = ["en", "ua", "de", "fr", "es", "pl", "pt", "ja"];

const STORAGE_KEY = "site-lang";

// Map browser language codes and country codes to our Lang type
const BROWSER_LANG_MAP: Record<string, Lang> = {
  en: "en", uk: "ua", ua: "ua", de: "de", fr: "fr", es: "es", pl: "pl", pt: "pt", ja: "ja",
};

const COUNTRY_CODE_MAP: Record<string, Lang> = {
  US: "en", GB: "en", AU: "en", CA: "en", NZ: "en", IE: "en",
  UA: "ua",
  DE: "de", AT: "de", CH: "de",
  FR: "fr",
  ES: "es", MX: "es", AR: "es", CO: "es", CL: "es",
  PL: "pl",
  PT: "pt", BR: "pt",
  JP: "ja",
};

function detectFromNavigator(): Lang | null {
  if (typeof navigator === "undefined") return null;
  const raw = navigator.language || (navigator as { userLanguage?: string }).userLanguage || "";
  const prefix = raw.split("-")[0].toLowerCase();
  return BROWSER_LANG_MAP[prefix] || null;
}

// Simple global state (no context needed for this scale)
let listeners: Array<(l: Lang) => void> = [];
let currentLang: Lang = "en";

export function setGlobalLang(l: Lang) {
  currentLang = l;
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, l);
  listeners.forEach((fn) => fn(l));
}

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>(currentLang);

  useEffect(() => {
    // 1. Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGS.includes(stored as Lang)) {
      currentLang = stored as Lang;
      setLang(stored as Lang);
    } else {
      // 2. Try navigator.language
      const browserLang = detectFromNavigator();
      if (browserLang) {
        currentLang = browserLang;
        setLang(browserLang);
        localStorage.setItem(STORAGE_KEY, browserLang);
      }

      // 3. Try IP geolocation as backup (async)
      if (!stored && !browserLang) {
        fetch("https://ipapi.co/json/")
          .then((res) => res.json())
          .then((data) => {
            const country = (data?.country_code || "").toUpperCase();
            const ipLang = COUNTRY_CODE_MAP[country];
            if (ipLang) {
              currentLang = ipLang;
              setLang(ipLang);
              localStorage.setItem(STORAGE_KEY, ipLang);
              listeners.forEach((fn) => fn(ipLang));
            }
          })
          .catch(() => {
            // Silently fail, keep default "en"
          });
      }
    }

    const listener = (l: Lang) => setLang(l);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((fn) => fn !== listener);
    };
  }, []);

  return [lang, setGlobalLang];
}
