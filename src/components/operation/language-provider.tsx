"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

type Language = "en" | "th";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (copy: LocalizedCopy) => string;
};

export type LocalizedCopy = {
  en: string;
  th: string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("tikkie-ops-language");
    if (savedLanguage === "th" || savedLanguage === "en") {
      setLanguageState(savedLanguage);
      document.documentElement.lang = savedLanguage === "th" ? "th" : "en";
    }
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    function setLanguage(nextLanguage: Language) {
      setLanguageState(nextLanguage);
      window.localStorage.setItem("tikkie-ops-language", nextLanguage);
      document.documentElement.lang = nextLanguage === "th" ? "th" : "en";
    }

    return {
      language,
      setLanguage,
      t: (copy) => copy[language],
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}

export function useLocalizedText() {
  return useLanguage().t;
}

export function Trans({ en, th }: LocalizedCopy) {
  const { t } = useLanguage();

  return <>{t({ en, th })}</>;
}

export function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border bg-white/90 p-1 shadow-sm">
      {!compact ? <Languages className="ml-2 size-4 text-brand-700" aria-hidden="true" /> : null}
      <Button
        aria-pressed={language === "th"}
        className={language === "th" ? "bg-primary !text-brand-yellow hover:bg-primary/90 [&_*]:!text-brand-yellow" : ""}
        onClick={() => setLanguage("th")}
        size="sm"
        type="button"
        variant={language === "th" ? "default" : "ghost"}
      >
        ไทย
      </Button>
      <Button
        aria-pressed={language === "en"}
        className={language === "en" ? "bg-primary !text-brand-yellow hover:bg-primary/90 [&_*]:!text-brand-yellow" : ""}
        onClick={() => setLanguage("en")}
        size="sm"
        type="button"
        variant={language === "en" ? "default" : "ghost"}
      >
        EN
      </Button>
    </div>
  );
}
