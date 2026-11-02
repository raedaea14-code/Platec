"use client";

import { useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useTheme, type Theme } from "@/components/ThemeProvider";

export type Lang = "ar" | "en";

export const languages: { code: Lang; label: string }[] = [
  { code: "ar", label: "العربية" },
  { code: "en", label: "English" },
];

export const themes: { value: Theme; key: "light" | "dark" | "auto" }[] = [
  { value: "light", key: "light" },
  { value: "dark", key: "dark" },
  { value: "auto", key: "auto" },
];

export function Accordion({
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

function DesktopOption({
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
      className="flex w-full cursor-pointer items-center justify-between rounded-md px-1 py-2 text-start text-base hover:bg-black/5 dark:hover:bg-white/10"
    >
      {children}
      <span
        aria-hidden
        className={`flex size-4 items-center justify-center rounded-full border ${
          active
            ? "border-black bg-black dark:border-white dark:bg-white"
            : "border-black/40 dark:border-white/40"
        }`}
      >
        {active && (
          <span className="size-1.5 rounded-full bg-white dark:bg-black" />
        )}
      </span>
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
  open,
  onLang,
  onTheme,
}: {
  open: boolean;
  onLang: (l: Lang) => void;
  onTheme: (t: Theme) => void;
}) {
  const t = useTranslations();
  const lang = useLocale();
  const { theme } = useTheme();

  return (
    <div
      id="settings-popup"
      role="dialog"
      aria-label={t("settings")}
      aria-hidden={!open}
      inert={!open}
      className={`absolute bottom-0 top-[6.25rem] end-0 hidden w-1/2 overflow-y-auto border-s border-black/15 bg-white text-black shadow-xl transition-[transform,opacity] duration-300 dark:border-white/20 dark:bg-neutral-900 dark:text-white min-[49rem]:block ${
        open
          ? "translate-x-0 opacity-100"
          : "pointer-events-none opacity-0 ltr:translate-x-full rtl:-translate-x-full"
      }`}
    >
      <p className="border-b border-black/15 px-5 py-3 text-xl font-semibold dark:border-white/20">
        {t("settings")}
      </p>

      <div className="px-5 py-2">
        <Accordion nested title={t("language")}>
          {languages.map((l) => (
            <DesktopOption
              key={l.code}
              active={lang === l.code}
              onClick={() => onLang(l.code)}
            >
              {l.label}
            </DesktopOption>
          ))}
        </Accordion>

        <Accordion nested title={t("theme")}>
          {themes.map((m) => (
            <DesktopOption
              key={m.value}
              active={theme === m.value}
              onClick={() => onTheme(m.value)}
            >
              {t(m.key)}
            </DesktopOption>
          ))}
        </Accordion>
      </div>
    </div>
  );
}