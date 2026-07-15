"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { translations, Language, TranslationKey } from "./translations";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLang = localStorage.getItem("siteLang") as Language;
    if (storedLang && (storedLang === "en" || storedLang === "ur")) {
      setLangState(storedLang);
      document.documentElement.lang = storedLang;
      document.documentElement.dir = storedLang === "ur" ? "rtl" : "ltr";
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("siteLang", newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ur" ? "rtl" : "ltr";
  };

  const t = (key: TranslationKey): string => {
    if (!mounted) return translations["en"][key];
    return translations[lang][key] || translations["en"][key];
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <div dir={mounted && lang === "ur" ? "rtl" : "ltr"}>{children}</div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
