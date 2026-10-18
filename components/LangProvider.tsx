"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "ar" | "en";

export const dict = {
  ar: {
    siteName: "Platec",
    menu: "القائمة",
    close: "إغلاق",
    settings: "إعدادات",
    language: "اللغة",
    theme: "المظهر",
    light: "فاتح",
    dark: "داكن",
    card: "بطاقة",
    legal: "قانوني",
    terms: "شروط الاستخدام",
    privacy: "سياسة الخصوصية",
    rights: "جميع الحقوق محفوظة",
    home: "صفحة Platec الرئيسية",
    back: "العودة للرئيسية",
  },
  en: {
    siteName: "Platec",
    menu: "Menu",
    close: "Close",
    settings: "Settings",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    card: "Card",
    legal: "Legal",
    terms: "Terms of Use",
    privacy: "Privacy Policy",
    rights: "All rights reserved",
    home: "Platec Home Page",
    back: "Back to home",
  },
} as const;

type Dict = { [K in keyof (typeof dict)["ar"]]: string };
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict };

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved === "ar" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t: dict[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside LangProvider");
  return ctx;
}