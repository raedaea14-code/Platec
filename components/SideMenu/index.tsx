"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import type { Theme } from "@/components/ThemeProvider";
import { useTheme } from "@/components/ThemeProvider";
import { DesktopCards, MobileCards } from "./Cards";
import { DesktopSettingsPanel, MobileSettings, type Lang } from "./Settings";

export default function SideMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { setTheme } = useTheme();

  const [resetKey, setResetKey] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const closeAll = () => {
    setSettingsOpen(false);
    onClose();
  };

  const setLang = (l: Lang) => {
    closeAll();
    router.replace("/", { locale: l });
  };

  const chooseTheme = (value: Theme) => {
    setTheme(value);
    closeAll();
    router.push("/");
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (settingsOpen) setSettingsOpen(false);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, settingsOpen]);

  useEffect(() => {
    if (open) return;
    const id = setTimeout(() => {
      setResetKey((k) => k + 1);
      setSettingsOpen(false);
    }, 300);
    return () => clearTimeout(id);
  }, [open]);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[55] bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 start-0 z-[60] h-dvh w-[70%] overflow-y-auto bg-black transition-[transform,opacity] duration-300 sm:w-80 min-[49rem]:pointer-events-none min-[49rem]:inset-0 min-[49rem]:flex min-[49rem]:h-auto min-[49rem]:w-auto min-[49rem]:items-center min-[49rem]:justify-center min-[49rem]:overflow-visible min-[49rem]:bg-transparent ${
          open
            ? "translate-x-0 min-[49rem]:opacity-100"
            : "ltr:-translate-x-full rtl:translate-x-full min-[49rem]:opacity-0 min-[49rem]:ltr:translate-x-0 min-[49rem]:rtl:translate-x-0"
        }`}
      >
        <div className="min-[49rem]:pointer-events-auto min-[49rem]:relative min-[49rem]:mx-6 min-[49rem]:w-full min-[49rem]:max-w-2xl min-[49rem]:overflow-hidden min-[49rem]:rounded-2xl min-[49rem]:shadow-2xl">
          {/* الشريط العلوي */}
          <section className="relative flex h-[6.25rem] items-center justify-center bg-black text-white md:h-[9.375rem] min-[49rem]:h-[6.25rem] min-[49rem]:border-b min-[49rem]:border-black/15 min-[49rem]:bg-white min-[49rem]:text-black dark:min-[49rem]:border-white/20 dark:min-[49rem]:bg-neutral-900 dark:min-[49rem]:text-white">
            {/* زر الإغلاق */}
            <button
              type="button"
              aria-label={t("close")}
              onClick={onClose}
              className="absolute end-1 top-1 z-20 flex size-11 cursor-pointer items-center justify-center rounded-full text-white transition-colors md:end-[0.875rem] md:top-[0.875rem] min-[49rem]:end-4 min-[49rem]:top-4 min-[49rem]:text-black min-[49rem]:hover:bg-black/10 min-[49rem]:focus-visible:bg-black/10 dark:min-[49rem]:text-white dark:min-[49rem]:hover:bg-white/15 dark:min-[49rem]:focus-visible:bg-white/15"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="size-5 md:size-6 min-[49rem]:hidden"
              >
                <path d="M1 1L23 23M23 1L1 23" />
              </svg>
              <span
                aria-hidden
                className="hidden text-2xl leading-none min-[49rem]:inline"
              >
                ×
              </span>
            </button>
            <p className="text-3xl font-bold">{t("siteName")}</p>
          </section>

          {/* المحتوى الرئيسي للكمبيوتر: البطاقات (جهة) والإعدادات والقانون (الجهة المقابلة) */}
          <div className="bg-white text-black dark:bg-neutral-900 dark:text-white min-[49rem]:flex min-[49rem]:max-h-[25rem] min-[49rem]:min-h-[20rem] min-[49rem]:overflow-y-auto">
            {/* الجهة الأولى: الصفحة الرئيسية والبطاقات */}
            <div className="min-[49rem]:flex-1 min-[49rem]:border-e min-[49rem]:border-black/15 dark:min-[49rem]:border-white/20">
              <Link
                href="/"
                onClick={closeAll}
                className="block border-b border-black/15 px-5 py-4 text-xl font-semibold hover:underline dark:border-white/20 min-[49rem]:hover:bg-black/5 dark:min-[49rem]:hover:bg-white/10"
              >
                {t("home")}
              </Link>
              <div className="min-[49rem]:hidden">
                <MobileCards onClose={onClose} />
              </div>
              <DesktopCards onClose={closeAll} />
            </div>

            {/* الجهة الثانية: الإعدادات والشروط والخصوصية */}
            <div className="min-[49rem]:flex-1">
              <div className="min-[49rem]:hidden">
                <MobileSettings resetKey={resetKey} onClose={onClose} />
              </div>

              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={settingsOpen}
                aria-controls="settings-popup"
                onClick={() => setSettingsOpen((v) => !v)}
                className="hidden w-full cursor-pointer items-center justify-between px-5 py-4 text-start text-xl font-semibold min-[49rem]:flex min-[49rem]:hover:bg-black/5 dark:min-[49rem]:hover:bg-white/10"
              >
                {t("settings")}
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`size-5 transition-transform duration-300 ${
                    settingsOpen ? "rotate-180" : ""
                  }`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <section
                aria-label={t("legal")}
                className="flex flex-col gap-4 border-t border-black/15 px-5 py-4 dark:border-white/20 min-[49rem]:gap-1"
              >
                <Link
                  href="/terms"
                  onClick={closeAll}
                  className="rounded-md text-xl font-semibold hover:underline min-[49rem]:-mx-3 min-[49rem]:px-3 min-[49rem]:py-2 min-[49rem]:hover:bg-black/5 dark:min-[49rem]:hover:bg-white/10"
                >
                  {t("terms")}
                </Link>
                <Link
                  href="/privacy"
                  onClick={closeAll}
                  className="rounded-md text-xl font-semibold hover:underline min-[49rem]:-mx-3 min-[49rem]:px-3 min-[49rem]:py-2 min-[49rem]:hover:bg-black/5 dark:min-[49rem]:hover:bg-white/10"
                >
                  {t("privacy")}
                </Link>
              </section>
            </div>
          </div>

          {/* لوحة الإعدادات للكمبيوتر (منبثقة) */}
          {settingsOpen && (
            <DesktopSettingsPanel onLang={setLang} onTheme={chooseTheme} />
          )}

          <section className="flex h-[3.75rem] items-center justify-center bg-black px-4 text-white md:h-[4.5rem] min-[49rem]:hidden">
            <p className="text-3xl font-bold">{t("siteName")}</p>
          </section>
        </div>
      </aside>
    </>
  );
}