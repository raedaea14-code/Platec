"use client";

import { useId, useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useTheme, type Theme } from "@/components/ThemeProvider";

export type Lang = "ar" | "en";

export const languages: { code: Lang; label: string }[] = [
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
];

// مصفوفة المظهر: "النظام" (auto) أولاً ثم "فاتح" و"داكن"
export const themes: { value: Theme; key: "auto" | "light" | "dark" }[] = [
  { value: "auto", key: "auto" },
  { value: "light", key: "light" },
  { value: "dark", key: "dark" },
];

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
        className={`flex w-full cursor-pointer items-center justify-between text-start lg:hover:bg-black/5 dark:lg:hover:bg-white/10 ${
          nested
            ? "py-3 text-lg font-medium"
            : "px-5 py-4 text-xl font-semibold"
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
          <div className={`flex flex-col ${nested ? "pb-2" : "px-5 pb-3"}`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Option({
  active,
  onClick,
  children,
  bleed = false,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  bleed?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center justify-between gap-3 whitespace-nowrap py-2 px-3 text-start text-base hover:bg-black/5 dark:hover:bg-white/10 ${
        bleed ? "-mx-3" : ""
      } ${active ? "font-bold" : ""}`}
    >
      <span>{children}</span>
      <span aria-hidden className="w-4 text-center">
        {active ? "✓" : ""}
      </span>
    </button>
  );
}

/* الإعدادات للهاتف والآيباد (أقل من 1024px) */
export function MobileSettings({
  resetKey,
  onClose,
}: {
  resetKey: number;
  onClose: () => void;
}) {
  const t = useTranslations();
  const lang = useLocale();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const setLang = (l: Lang) => {
    onClose();
    router.replace("/", { locale: l });
  };

  const chooseTheme = (value: Theme) => {
    setTheme(value);
    onClose();
    router.push("/");
  };

  return (
    <Accordion key={resetKey} title={t("settings")}>
      <Accordion nested title={t("language")}>
        {languages.map((l) => (
          <Option
            key={l.code}
            active={lang === l.code}
            onClick={() => setLang(l.code)}
            bleed
          >
            {l.label}
          </Option>
        ))}
      </Accordion>

      <Accordion nested title={t("theme")}>
        {themes.map((m) => (
          <Option
            key={m.value}
            active={theme === m.value}
            onClick={() => chooseTheme(m.value)}
            bleed
          >
            {t(m.key)}
          </Option>
        ))}
      </Accordion>
    </Accordion>
  );
}

/* إعدادات الكمبيوتر (1024px فأكثر): صفّان + لوحة فرعية تغطي العمود الثاني */
export function DesktopSettingsPanel({
  onLang,
  onTheme,
}: {
  onLang: (l: Lang) => void;
  onTheme: (t: Theme) => void;
}) {
  const t = useTranslations();
  const lang = useLocale();
  const { theme } = useTheme();
  const [sub, setSub] = useState<"lang" | "theme" | null>(null);

  // Escape: يغلق اللوحة الفرعية أولاً دون إغلاق القائمة
  useEffect(() => {
    if (!sub) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      setSub(null);
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [sub]);

  const currentLang = languages.find((l) => l.code === lang)?.label ?? lang;
  const currentTheme = themes.find((m) => m.value === theme);

  const row =
    "flex w-full cursor-pointer items-center justify-between gap-3 px-5 py-3 text-start hover:bg-black/5 dark:hover:bg-white/10";

  return (
    <div className="hidden lg:block">
      {/* الصفّان: اللغة والمظهر */}
      <div className="border-t border-black/15 dark:border-white/20">
        <button type="button" onClick={() => setSub("lang")} className={row}>
          <span className="text-lg font-medium xl:text-xl">
            {t("language")}
          </span>
          <span className="text-base opacity-60">{currentLang}</span>
        </button>
        <button type="button" onClick={() => setSub("theme")} className={row}>
          <span className="text-lg font-medium xl:text-xl">{t("theme")}</span>
          <span className="text-base opacity-60">
            {currentTheme ? t(currentTheme.key) : ""}
          </span>
        </button>
      </div>

      {/* اللوحة الفرعية: تغطي العمود الثاني (الأب relative) */}
      {sub && (
        <div className="absolute inset-0 z-50 flex flex-col bg-white text-black dark:bg-neutral-900 dark:text-white">
          <button
            type="button"
            onClick={() => setSub(null)}
            className="flex w-full cursor-pointer items-center gap-2 border-b border-black/15 px-5 py-4 text-start text-lg font-semibold hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10 xl:text-xl"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5 rtl:rotate-180"
            >
              <path d="M15 6l-6 6 6 6" />
            </svg>
            {t("backToMenu")}
          </button>

          <div className="flex-1 overflow-y-auto">
            {sub === "lang" &&
              languages.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  aria-pressed={lang === l.code}
                  onClick={() => onLang(l.code)}
                  className={`${row} ${lang === l.code ? "font-bold" : ""}`}
                >
                  <span className="text-lg xl:text-xl">{l.label}</span>
                  <span aria-hidden>{lang === l.code ? "✓" : ""}</span>
                </button>
              ))}

            {sub === "theme" &&
              themes.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  aria-pressed={theme === m.value}
                  onClick={() => onTheme(m.value)}
                  className={`${row} ${theme === m.value ? "font-bold" : ""}`}
                >
                  <span className="text-lg xl:text-xl">{t(m.key)}</span>
                  <span aria-hidden>{theme === m.value ? "✓" : ""}</span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}