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
  const [isDesktop, setIsDesktop] = useState(false);

  // مراقبة حجم الشاشة: 64rem (= lg) فأكثر = كمبيوتر
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
    document.body.style.overflow = open && !isDesktop ? "hidden" : "";
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
  }, [open, onClose, settingsOpen, isDesktop]);

  useEffect(() => {
    if (open) return;
    const id = setTimeout(() => {
      setResetKey((k) => k + 1);
      setSettingsOpen(false);
    }, 300);
    return () => clearTimeout(id);
  }, [open]);

  const hidden = !open && !isDesktop;

  return (
    <>
      {/* الخلفية: تظهر على كل الشاشات، والنقر عليها يغلق الكل */}
      <div
        onClick={closeAll}
        className={`fixed inset-0 z-[55] bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        aria-hidden={hidden}
        inert={hidden}
        className={`fixed inset-y-0 start-0 z-[60] h-dvh w-[70%] overflow-y-auto bg-black transition-[transform,opacity] duration-300 sm:w-80 lg:pointer-events-none lg:inset-0 lg:flex lg:h-auto lg:w-auto lg:items-center lg:justify-center lg:overflow-visible lg:bg-transparent ${
          open
            ? "translate-x-0"
            : "ltr:-translate-x-full rtl:translate-x-full lg:translate-x-0"
        }`}
      >
        {/* الحاوية: العرض 50vw | الأدنى 41rem | الأقصى 896px */}
        <div className="lg:pointer-events-auto lg:relative lg:w-[50vw] lg:min-w-[41rem] lg:max-w-4xl lg:overflow-hidden lg:rounded-2xl lg:shadow-2xl">
          {/* الشريط العلوي (للهاتف والآيباد) */}
          <section className="relative flex h-[6.25rem] items-center justify-center bg-black text-white md:h-[9.375rem] lg:hidden">
            <button
              type="button"
              aria-label={t("close")}
              onClick={onClose}
              className="absolute end-1 top-1 z-20 flex size-11 cursor-pointer items-center justify-center rounded-full text-white transition-colors md:end-[0.875rem] md:top-[0.875rem]"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="size-5 md:size-6"
              >
                <path d="M1 1L23 23M23 1L1 23" />
              </svg>
            </button>
            <p className="text-3xl font-bold">{t("siteName")}</p>
          </section>

          {/* المحتوى: الارتفاع 65vh | الأدنى 28rem | الأقصى 44rem */}
          <div className="bg-white text-black dark:bg-neutral-900 dark:text-white lg:flex lg:h-[65vh] lg:min-h-[28rem] lg:max-h-[44rem]">
            {/* العمود الأول: الرئيسية والبطاقات */}
            <div className="lg:flex-1 lg:overflow-y-auto lg:border-e lg:border-black/15 dark:lg:border-white/20">
              <Link
                href="/"
                onClick={closeAll}
                className="block border-b border-black/15 px-5 py-4 text-xl font-semibold hover:underline dark:border-white/20 lg:hover:bg-black/5 xl:text-2xl dark:lg:hover:bg-white/10"
              >
                {t("home")}
              </Link>
              <div className="lg:hidden">
                <MobileCards onClose={onClose} />
              </div>
              <DesktopCards onClose={closeAll} />
            </div>

            {/* العمود الثاني: الإعدادات والشروط والخصوصية */}
            <div className="relative lg:flex-1 lg:overflow-hidden">
              <div className="lg:h-full lg:overflow-y-auto">
                <div className="lg:hidden">
                  <MobileSettings resetKey={resetKey} onClose={onClose} />
                </div>

                {/* زر الإعدادات (للكمبيوتر) */}
                <button
                  type="button"
                  aria-expanded={settingsOpen}
                  onClick={() => setSettingsOpen((v) => !v)}
                  className="hidden w-full cursor-pointer items-center justify-between px-5 py-4 text-start text-xl font-semibold lg:flex lg:hover:bg-black/5 xl:text-2xl dark:lg:hover:bg-white/10"
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

                {/* اللغة والمظهر + اللوحة الفرعية */}
                {settingsOpen && (
                  <DesktopSettingsPanel
                    onLang={setLang}
                    onTheme={chooseTheme}
                  />
                )}

                <section
                  aria-label={t("legal")}
                  className="flex flex-col gap-4 border-t border-black/15 px-5 py-4 dark:border-white/20 lg:gap-1"
                >
                  <Link
                    href="/terms"
                    onClick={closeAll}
                    className="rounded-md text-lg font-semibold hover:underline lg:-mx-3 lg:px-3 lg:py-2 lg:hover:bg-black/5 xl:text-xl dark:lg:hover:bg-white/10"
                  >
                    {t("terms")}
                  </Link>
                  <Link
                    href="/privacy"
                    onClick={closeAll}
                    className="rounded-md text-lg font-semibold hover:underline lg:-mx-3 lg:px-3 lg:py-2 lg:hover:bg-black/5 xl:text-xl dark:lg:hover:bg-white/10"
                  >
                    {t("privacy")}
                  </Link>
                </section>
              </div>
            </div>
          </div>

          <section className="flex h-[3.75rem] items-center justify-center bg-black px-4 text-white md:h-[4.5rem] lg:hidden">
            <p className="text-3xl font-bold">{t("siteName")}</p>
          </section>
        </div>
      </aside>
    </>
  );
}