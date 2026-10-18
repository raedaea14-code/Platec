"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { useLang, type Lang } from "./LangProvider";
import { useTheme, type Theme } from "./ThemeProvider";

const cards = [1, 2, 3, 4, 5, 6];

const languages: { code: Lang; label: string }[] = [
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
];

const themes: { value: Theme; key: "light" | "dark" }[] = [
  { value: "light", key: "light" },
  { value: "dark", key: "dark" },
];

/* قسم قابل للطي: المحتوى مخفي حتى يضغط المستخدم على العنوان.
   يمكن وضعه داخل قسم آخر (nested) لعمل مستويات فرعية. */
function Accordion({
  title,
  nested = false,
  children,
}: {
  title: string;
  nested?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <div
      className={nested ? "" : "border-t border-black/15 dark:border-white/20"}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between text-start ${
          nested
            ? "py-3 text-lg font-medium"
            : "px-6 py-4 text-xl font-semibold"
        }`}
      >
        {title}
        <span
          aria-hidden
          className={`text-base transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      <div
        id={id}
        inert={!open}
        className={`grid transition-[grid-template-rows] duration-300 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`flex flex-col ${nested ? "ps-4 pb-2" : "px-6 pb-3"}`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/* خيار فرعي (مثل العربية أو الداكن) */
function Option({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-start text-base transition-colors hover:bg-black/5 dark:hover:bg-white/10 ${
        active ? "font-bold" : ""
      }`}
    >
      {children}
      <span aria-hidden>{active ? "✓" : ""}</span>
    </button>
  );
}

export default function SideMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { lang, setLang, t } = useLang();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[55] bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Slider panel */}
      <aside
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 start-0 z-[60] h-dvh w-[70%] overflow-y-auto bg-black transition-transform duration-300 sm:w-80 ${
          open ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"
        }`}
      >
        {/* 1) شريحة البداية (سوداء) */}
        <section className="relative flex h-[6.25rem] items-center justify-center bg-black text-white md:h-[9.375rem]">
          <button
            type="button"
            aria-label={t.close}
            onClick={onClose}
            className="absolute end-3 top-3 flex size-10 items-center justify-center text-3xl leading-none text-white"
          >
            ×
          </button>
          <p className="text-3xl font-bold">{t.siteName}</p>
        </section>

        {/* رابط الصفحة الرئيسية للموقع */}
        <div className="bg-white text-black dark:bg-neutral-900 dark:text-white">
          <Link
            href="/"
            onClick={onClose}
            className="block border-b border-black/15 px-6 py-4 text-xl font-semibold hover:underline dark:border-white/20"
          >
            {t.home}
          </Link>
        </div>

        {/* 2) الشريحة الرئيسية: البطاقات */}
        <section className="flex h-[31.25rem] flex-col justify-evenly bg-white px-6 text-black md:h-[37.5rem] dark:bg-neutral-900 dark:text-white">
          {cards.map((n) => (
            <Link
              key={n}
              href="/"
              onClick={onClose}
              className="text-xl font-semibold hover:underline"
            >
              {t.card} {n}
            </Link>
          ))}
        </section>

        <div className="bg-white text-black dark:bg-neutral-900 dark:text-white">
          {/* الإعدادات: كلمة ظاهرة، وما تحتها يظهر عند الضغط */}
          <Accordion title={t.settings}>
            <Accordion nested title={t.language}>
              {languages.map((l) => (
                <Option
                  key={l.code}
                  active={lang === l.code}
                  onClick={() => setLang(l.code)}
                >
                  {l.label}
                </Option>
              ))}
            </Accordion>

            <Accordion nested title={t.theme}>
              {themes.map((m) => (
                <Option
                  key={m.value}
                  active={theme === m.value}
                  onClick={() => setTheme(m.value)}
                >
                  {t[m.key]}
                </Option>
              ))}
            </Accordion>
          </Accordion>

          {/* القانوني: غير مرئي كعنوان، والرابطان ظاهران مباشرة */}
          <section
            aria-label={t.legal}
            className="flex flex-col gap-4 border-t border-black/15 px-6 py-4 dark:border-white/20"
          >
            <Link
              href="/terms"
              onClick={onClose}
              className="text-xl font-semibold hover:underline"
            >
              {t.terms}
            </Link>
            <Link
              href="/privacy"
              onClick={onClose}
              className="text-xl font-semibold hover:underline"
            >
              {t.privacy}
            </Link>
          </section>
        </div>

        {/* 3) شريحة النهاية (سوداء) */}
        <section className="flex h-[9.375rem] items-center justify-center bg-black px-4 text-white md:h-[12.5rem]">
          <p className="text-3xl font-bold">{t.siteName}</p>
        </section>
      </aside>
    </>
  );
}