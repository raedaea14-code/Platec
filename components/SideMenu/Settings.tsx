a"use client";

import { useId, useState, useEffect, useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useTheme, type Theme } from "@/components/ThemeProvider";

export type Lang = "ar" | "en";

export const languages: { code: Lang; label: string }[] = [
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
];

// مصفوفة المظهر تشمل "تلقائي" من ملف اللغة في البداية ثم "فاتح" و"داكن"
export const themes: { value: Theme; key: "auto" | "light" | "dark" }[] = [
  { value: "system", key: "auto" },
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
        className={`flex w-full cursor-pointer items-center justify-between text-start min-[49rem]:hover:bg-black/5 dark:min-[49rem]:hover:bg-white/10 ${
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
      className={`flex w-full cursor-pointer items-center justify-between py-2 text-start text-base hover:underline min-[49rem]:hover:bg-black/5 dark:min-[49rem]:hover:bg-white/10 ${
        active ? "font-bold" : ""
      }`}
    >
      {children}
      <span aria-hidden>{active ? "✓" : ""}</span>
    </button>
  );
}

/* الإعدادات للهاتف والآيباد (أكورديون) */
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
          >
            {t(m.key)}
          </Option>
        ))}
      </Accordion>
    </Accordion>
  );
}

/* نافذة الإعدادات المنبثقة للكمبيوتر */
export function DesktopSettingsPanel({
  onClose,
  onLang,
  onTheme,
}: {
  onClose: () => void;
  onLang: (l: Lang) => void;
  onTheme: (t: Theme) => void;
}) {
  const t = useTranslations();
  const lang = useLocale();
  const { theme } = useTheme();

  const [activeDropdown, setActiveDropdown] = useState<"lang" | "theme" | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={panelRef}
      id="settings-popup"
      role="dialog"
      aria-label={t("settings")}
      className="absolute bottom-0 top-[6.25rem] end-0 hidden w-1/2 overflow-y-auto border-s border-black/15 bg-white text-black shadow-xl transition-[transform,opacity] duration-300 dark:border-white/20 dark:bg-neutral-900 dark:text-white min-[49rem]:block"
    >
      <div className="flex items-center justify-between border-b border-black/15 px-5 py-3 dark:border-white/20">
        <p className="text-xl font-semibold">{t("settings")}</p>
        <button
          type="button"
          aria-label={t("close")}
          onClick={onClose}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full text-lg leading-none transition-colors hover:bg-black/10 focus-visible:bg-black/10 dark:hover:bg-white/15 dark:focus-visible:bg-white/15"
        >
          ×
        </button>
      </div>

      {/* قائمة اللغة المنبثقة */}
      <div className="relative border-b border-black/15 px-5 py-3 dark:border-white/20">
        <button
          type="button"
          onClick={() => setActiveDropdown(activeDropdown === "lang" ? null : "lang")}
          className="flex w-full items-center justify-between py-2 text-start text-base font-medium cursor-pointer"
        >
          <span>{t("language")}</span>
          <span className="text-sm rtl:rotate-180">›</span>
        </button>

        {activeDropdown === "lang" && (
          <div className="absolute start-5 end-5 top-full z-20 mt-1 rounded-lg border border-black/15 bg-white p-2 shadow-lg dark:border-white/20 dark:bg-neutral-800">
            {languages.map((l) => (
              <Option
                key={l.code}
                active={lang === l.code}
                onClick={() => {
                  setActiveDropdown(null);
                  onLang(l.code);
                }}
              >
                {l.label}
              </Option>
            ))}
          </div>
        )}
      </div>

      {/* قائمة المظهر المنبثقة */}
      <div className="relative px-5 py-3">
        <button
          type="button"
          onClick={() => setActiveDropdown(activeDropdown === "theme" ? null : "theme")}
          className="flex w-full items-center justify-between py-2 text-start text-base font-medium cursor-pointer"
        >
          <span>{t("theme")}</span>
          <span className="text-sm rtl:rotate-180">›</span>
        </button>

        {activeDropdown === "theme" && (
          <div className="absolute start-5 end-5 top-full z-20 mt-1 rounded-lg border border-black/15 bg-white p-2 shadow-lg dark:border-white/20 dark:bg-neutral-800">
            {themes.map((m) => (
              <Option
                key={m.value}
                active={theme === m.value}
                onClick={() => {
                  setActiveDropdown(null);
                  onTheme(m.value);
                }}
              >
                {t(m.key)}
              </Option>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}