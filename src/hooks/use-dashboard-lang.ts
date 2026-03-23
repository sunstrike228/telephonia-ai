"use client";
import { useState, useEffect } from "react";

export function useDashboardLang() {
  const [lang, setLang] = useState<"en" | "ua">("en");

  useEffect(() => {
    const stored = localStorage.getItem("dashboard-lang");
    if (stored === "ua") setLang("ua");

    const handleStorage = () => {
      const val = localStorage.getItem("dashboard-lang");
      setLang(val === "ua" ? "ua" : "en");
    };
    window.addEventListener("storage", handleStorage);

    // Also poll for changes from same tab
    const interval = setInterval(() => {
      const val = localStorage.getItem("dashboard-lang");
      setLang(val === "ua" ? "ua" : "en");
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, []);

  return lang;
}
