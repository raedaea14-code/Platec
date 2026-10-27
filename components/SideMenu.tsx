"use client";

import { useEffect, useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useTheme, type Theme } from "./ThemeProvider";

type Lang = "ar" | "en";

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
   يمكن وضعه داخل قسم آخر (nested) لعمل مستويات فرعية.
   الهامش الجانبي px-5 = 1.25rem */
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
        className={`flex w-full cursor-pointer items-center justify-between text-start min-[60rem]:hover:bg-black/5 dark:min-[60rem]:hover:bg-white/10 ${
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
      className={`flex w-full cursor-pointer items-center justify-between py-2 text-start text-base hover:underline min-[60rem]:hover:bg-black/5 dark:min-[60rem]:hover:bg-white/10 ${
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
  const t = useTranslations();
  const lang = useLocale();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  /* مفتاح لإعادة ضبط الأقسام المفتوحة (الإعدادات واللغة والمظهر) */
  const [resetKey, setResetKey] = useState(0);

  /* الكمبيوتر: نافذة جانبية منبثقة للإعدادات (اللغة والمظهر) */
  const [settingsOpen, setSettingsOpen] = useState(false);

  /* اختيار لغة: إغلاق القائمة ثم الذهاب للصفحة الرئيسية باللغة المختارة */
  const setLang = (l: Lang) => {
    onClose();
    router.replace("/", { locale: l });
  };

  /* اختيار مظهر: تطبيقه ثم إغلاق القائمة والذهاب للصفحة الرئيسية */
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
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, settingsOpen]);

  /* بعد إغلاق القائمة (وانتهاء حركة الانزلاق 300ms) نعيد الأقسام مطوية */
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
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[55] bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Slider panel
          الهاتف والآيباد: سلايدر جانبي
          الكمبيوتر (lg): نافذة في وسط الشاشة بعرض أقصى max-w-2xl */}
      <aside
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 start-0 z-[60] h-dvh w-[70%] overflow-y-auto bg-black transition-[transform,opacity] duration-300 sm:w-80 min-[60rem]:pointer-events-none min-[60rem]:inset-0 min-[60rem]:flex min-[60rem]:h-auto min-[60rem]:w-auto min-[60rem]:items-center min-[60rem]:justify-center min-[60rem]:overflow-visible min-[60rem]:bg-transparent ${
          open
            ? "translate-x-0 min-[60rem]:opacity-100"
            : "ltr:-translate-x-full rtl:translate-x-full min-[60rem]:opacity-0 min-[60rem]:ltr:translate-x-0 min-[60rem]:rtl:translate-x-0"
        }`}
      >
        <div className="min-[60rem]:pointer-events-auto min-[60rem]:relative min-[60rem]:mx-6 min-[60rem]:w-full min-[60rem]:max-w-2xl min-[60rem]:overflow-hidden min-[60rem]:rounded-2xl min-[60rem]:shadow-2xl">
          {/* 1) شريحة البداية (سوداء) */}
          <section className="relative flex h-[6.25rem] items-center justify-center bg-black text-white md:h-[9.375rem] min-[60rem]:h-[6.25rem]">
            {/* زر الإغلاق:
                الهاتف: أيقونة 1.25rem، مساحة النقر 2.75rem، البعد 1rem
                الآيباد (md): أيقونة 1.5rem، مساحة النقر 2.75rem، البعد 1.5rem
                الكمبيوتر (lg): زر 2.5rem، أيقونة text-lg، top-4 end-4 */}
            <button
              type="button"
              aria-label={t("close")}
              onClick={onClose}
              className="absolute end-1 top-1 flex size-11 cursor-pointer items-center justify-center rounded-full text-white transition-colors md:end-[0.875rem] md:top-[0.875rem] min-[60rem]:end-4 min-[60rem]:top-4 min-[60rem]:size-10 min-[60rem]:hover:bg-white/20 min-[60rem]:focus-visible:bg-white/20"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="size-5 md:size-6 min-[60rem]:hidden"
              >
                <path d="M1 1L23 23M23 1L1 23" />
              </svg>
              <span aria-hidden className="hidden text-lg leading-none min-[60rem]:inline">
                ×
              </span>
            </button>
            <p className="text-3xl font-bold">{t("siteName")}</p>
          </section>

          {/* 2) المحتوى الرئيسي:
              الكمبيوتر: عمودان (نصف ونصف) بارتفاع أقصى 25rem مع تمرير */}
          <div className="bg-white text-black dark:bg-neutral-900 dark:text-white min-[60rem]:grid min-[60rem]:max-h-[25rem] min-[60rem]:grid-cols-2 min-[60rem]:items-start min-[60rem]:overflow-y-auto">
            {/* العمود الأول: الرئيسية + البطاقات */}
            <div>
              <Link
                href="/"
                onClick={onClose}
                className="block border-b border-black/15 px-5 py-4 text-xl font-semibold hover:underline dark:border-white/20 min-[60rem]:hover:bg-black/5 dark:min-[60rem]:hover:bg-white/10"
              >
                {t("home")}
              </Link>

              <section className="flex h-[31.25rem] flex-col justify-evenly px-5 md:h-[37.5rem] min-[60rem]:h-auto min-[60rem]:justify-start min-[60rem]:gap-1 min-[60rem]:py-3">
                {cards.map((n) => (
                  <Link
                    key={n}
                    href="/"
                    onClick={onClose}
                    className="rounded-md text-xl font-semibold hover:underline min-[60rem]:-mx-3 min-[60rem]:px-3 min-[60rem]:py-2 min-[60rem]:hover:bg-black/5 dark:min-[60rem]:hover:bg-white/10"
                  >
                    {t("card")} {n}
                  </Link>
                ))}
              </section>
            </div>

            {/* العمود الثاني: الإعدادات + القانوني */}
            <div className="min-[60rem]:border-s min-[60rem]:border-black/15 dark:min-[60rem]:border-white/20">
              {/* الإعدادات: كلمة ظاهرة، وما تحتها يظهر عند الضغط
                  key={resetKey} يعيدها (مع اللغة والمظهر) مطوية بعد إغلاق القائمة */}
              {/* الهاتف والآيباد: قسم قابل للطي */}
              <div className="min-[60rem]:hidden">
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
              </div>

              {/* الكمبيوتر: زر يفتح النافذة الجانبية المنبثقة */}
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={settingsOpen}
                aria-controls="settings-popup"
                onClick={() => setSettingsOpen((v) => !v)}
                className={`hidden w-full cursor-pointer items-center justify-between border-t border-black/15 px-5 py-4 text-start text-xl font-semibold dark:border-white/20 min-[60rem]:flex min-[60rem]:hover:bg-black/5 dark:min-[60rem]:hover:bg-white/10 ${
                  settingsOpen ? "min-[60rem]:bg-black/5 dark:min-[60rem]:bg-white/10" : ""
                }`}
              >
                {t("settings")}
                <span aria-hidden className="text-base rtl:rotate-180">
                  ›
                </span>
              </button>

              {/* القانوني: غير مرئي كعنوان، والرابطان ظاهران مباشرة */}
              <section
                aria-label={t("legal")}
                className="flex flex-col gap-4 border-t border-black/15 px-5 py-4 dark:border-white/20 min-[60rem]:gap-1"
              >
                <Link
                  href="/terms"
                  onClick={onClose}
                  className="rounded-md text-xl font-semibold hover:underline min-[60rem]:-mx-3 min-[60rem]:px-3 min-[60rem]:py-2 min-[60rem]:hover:bg-black/5 dark:min-[60rem]:hover:bg-white/10"
                >
                  {t("terms")}
                </Link>
                <Link
                  href="/privacy"
                  onClick={onClose}
                  className="rounded-md text-xl font-semibold hover:underline min-[60rem]:-mx-3 min-[60rem]:px-3 min-[60rem]:py-2 min-[60rem]:hover:bg-black/5 dark:min-[60rem]:hover:bg-white/10"
                >
                  {t("privacy")}
                </Link>
              </section>
            </div>
          </div>

          {/* نافذة الإعدادات الجانبية المنبثقة (الكمبيوتر فقط):
              تنزلق من جهة النهاية فوق العمود الثاني */}
          <div
            id="settings-popup"
            role="dialog"
            aria-label={t("settings")}
            aria-hidden={!settingsOpen}
            inert={!settingsOpen}
            className={`absolute bottom-[6.25rem] top-[6.25rem] end-0 hidden w-1/2 overflow-y-auto border-s border-black/15 bg-white text-black shadow-xl transition-[transform,opacity] duration-300 dark:border-white/20 dark:bg-neutral-900 dark:text-white min-[60rem]:block ${
              settingsOpen
                ? "translate-x-0 opacity-100"
                : "pointer-events-none opacity-0 ltr:translate-x-full rtl:-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between border-b border-black/15 px-5 py-3 dark:border-white/20">
              <p className="text-xl font-semibold">{t("settings")}</p>
              <button
                type="button"
                aria-label={t("close")}
                onClick={() => setSettingsOpen(false)}
                className="flex size-10 cursor-pointer items-center justify-center rounded-full text-lg leading-none transition-colors hover:bg-black/10 focus-visible:bg-black/10 dark:hover:bg-white/15 dark:focus-visible:bg-white/15"
              >
                ×
              </button>
            </div>

            <div className="px-5 py-3">
              <p className="pb-1 text-sm font-medium opacity-60">
                {t("language")}
              </p>
              {languages.map((l) => (
                <Option
                  key={l.code}
                  active={lang === l.code}
                  onClick={() => setLang(l.code)}
                >
                  {l.label}
                </Option>
              ))}
            </div>

            <div className="border-t border-black/15 px-5 py-3 dark:border-white/20">
              <p className="pb-1 text-sm font-medium opacity-60">
                {t("theme")}
              </p>
              {themes.map((m) => (
                <Option
                  key={m.value}
                  active={theme === m.value}
                  onClick={() => chooseTheme(m.value)}
                >
                  {t(m.key)}
                </Option>
              ))}
            </div>
          </div>

          {/* 3) شريحة النهاية (سوداء) */}
          <section className="flex h-[3.75rem] items-center justify-center bg-black px-4 text-white md:h-[4.5rem] min-[60rem]:h-[6.25rem]">
            <p className="text-3xl font-bold">{t("siteName")}</p>
          </section>
        </div>
      </aside>
    </>
  );
    }
