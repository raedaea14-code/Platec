"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import type { Theme } from "@/components/ThemeProvider";
import { useTheme } from "@/components/ThemeProvider";
import { DesktopCardsMenu, MobileCards } from "./Cards";
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
  const [pagesOpen, setPagesOpen] = useState(false);

  const setLang = (l: Lang) => {
    onClose();
    router.replace("/", { locale: l });
  };

  const chooseTheme = (value: Theme) => {
    setTheme(value);
    onClose();
    router.push("/");
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (settingsOpen) setSettingsOpen(false);
      else if (pagesOpen) setPagesOpen(false);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, settingsOpen, pagesOpen]);

  useEffect(() => {
    if (open) return;
    const id = setTimeout(() => {
      setResetKey((k) => k + 1);
      setSettingsOpen(false);
      setPagesOpen(false);
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
        <div className="min-[49rem]:pointer-events-auto min-[49rem]:relative min-[49rem]:mx-6 min-[49rem]:w-full min-[49rem]:max-w-3xl min-[49rem]:overflow-hidden min-[49rem]:rounded-2xl min-[49rem]:shadow-2xl bg-white text-black dark:bg-neutral-900 dark:text-white">
          
          {/* رأس القائمة */}
          <section className="relative flex h-[5rem] items-center justify-between px-6 border-b border-black/15 dark:border-white/20 bg-black text-white min-[49rem]:bg-white min-[49rem]:text-black dark:min-[49rem]:bg-neutral-900 dark:min-[49rem]:text-white">
            
            {/* زر السهم المنسدل للكمبيوتر */}
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={pagesOpen}
              aria-controls="pages-menu"
              aria-label={t("siteName")}
              onClick={() => {
                setSettingsOpen(false);
                setPagesOpen((v) => !v);
              }}
              className="hidden size-10 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-black/10 dark:hover:bg-white/15 min-[49rem]:flex"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`size-5 transition-transform duration-300 ${
                  pagesOpen ? "rotate-180" : ""
                }`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            <p className="text-2xl font-bold mx-auto min-[49rem]:mx-0">{t("siteName")}</p>

            {/* زر الإغلاق */}
            <button
              type="button"
              aria-label={t("close")}
              onClick={onClose}
              className="size-10 cursor-pointer flex items-center justify-center rounded-full hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
            >
              <span className="text-2xl leading-none">×</span>
            </button>
          </section>

          {pagesOpen && (
            <div
              aria-hidden
              onClick={() => setPagesOpen(false)}
              className="absolute inset-0 z-10 hidden min-[49rem]:block"
            />
          )}

          {/* محتوى القائمة مقسم لجهتين للكمبيوتر */}
          <div className="p-6 min-[49rem]:grid min-[49rem]:grid-cols-2 min-[49rem]:gap-8">
            
            {/* الجهة الأولى: الصفحة الرئيسية والبطاقات */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold border-b pb-2 border-black/10 dark:border-white/10">
                {t("home")}
              </h3>
              <div className="min-[49rem]:block">
                <Link
                  href="/"
                  onClick={onClose}
                  className="block py-2 text-base font-semibold hover:underline"
                >
                  {t("siteName")} - الرئيسية
                </Link>
                <DesktopCardsMenu open={pagesOpen} onClose={onClose} />
                <MobileCards onClose={onClose} />
              </div>
            </div>

            {/* الجهة المقابلة: الإعدادات والسياسات */}
            <div className="space-y-4 mt-6 min-[49rem]:mt-0">
              <h3 className="text-lg font-bold border-b pb-2 border-black/10 dark:border-white/10">
                {t("settings")} & {t("legal")}
              </h3>
              
              <div>
                <MobileSettings resetKey={resetKey} onClose={onClose} />

                {/* زر الإعدادات للكمبيوتر */}
                <button
                  type="button"
                  aria-haspopup="dialog"
                  aria-expanded={settingsOpen}
                  aria-controls="settings-popup"
                  onClick={() => {
                    setPagesOpen(false);
                    setSettingsOpen((v) => !v);
                  }}
                  className={`hidden w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-start text-base font-semibold min-[49rem]:flex hover:bg-black/5 dark:hover:bg-white/10 ${
                    settingsOpen ? "bg-black/5 dark:bg-white/10" : ""
                  }`}
                >
                  <span>{t("settings")}</span>
                  <span aria-hidden className="text-sm rtl:rotate-180">›</span>
                </button>
              </div>

              {/* الشروط وسياسة الخصوصية */}
              <section aria-label={t("legal")} className="flex flex-col gap-2 pt-2">
                <Link
                  href="/terms"
                  onClick={onClose}
                  className="rounded-md text-base font-medium hover:underline py-1"
                >
                  {t("terms")}
                </Link>
                <Link
                  href="/privacy"
                  onClick={onClose}
                  className="rounded-md text-base font-medium hover:underline py-1"
                >
                  {t("privacy")}
                </Link>
              </section>
            </div>

          </div>

          <DesktopSettingsPanel
            onClose={() => setSettingsOpen(false)}
            onLang={setLang}
            onTheme={chooseTheme}
          />
        </div>
      </aside>
    </>
  );
}