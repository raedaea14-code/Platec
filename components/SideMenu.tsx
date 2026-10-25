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
        className={`flex w-full items-center justify-between text-start ${
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
      className={`flex w-full items-center justify-between py-2 text-start text-base hover:underline ${
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
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  /* بعد إغلاق القائمة (وانتهاء حركة الانزلاق 300ms) نعيد الأقسام مطوية */
  useEffect(() => {
    if (open) return;
    const id = setTimeout(() => setResetKey((k) => k + 1), 300);
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
          {/* زر الإغلاق:
              الهاتف: أيقونة 1.25rem، مساحة النقر 2.75rem، البعد 1rem
              الآيباد (md): أيقونة 1.5rem، مساحة النقر 2.75rem، البعد 1.5rem
              الكمبيوتر (lg): كما كان سابقاً */}
          <button
            type="button"
            aria-label={t("close")}
            onClick={onClose}
            className="absolute end-1 top-1 flex size-11 items-center justify-center text-white md:end-[0.875rem] md:top-[0.875rem] lg:end-3 lg:top-3 lg:size-10"
          >
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="size-5 md:size-6 lg:hidden"
            >
              <path d="M1 1L23 23M23 1L1 23" />
            </svg>
            <span aria-hidden className="hidden text-3xl leading-none lg:inline">
              ×
            </span>
          </button>
          <p className="text-3xl font-bold">{t("siteName")}</p>
        </section>

        {/* رابط الصفحة الرئيسية للموقع */}
        <div className="bg-white text-black dark:bg-neutral-900 dark:text-white">
          <Link
            href="/"
            onClick={onClose}
            className="block border-b border-black/15 px-5 py-4 text-xl font-semibold hover:underline dark:border-white/20"
          >
            {t("home")}
          </Link>
        </div>

        {/* 2) الشريحة الرئيسية: البطاقات */}
        <section className="flex h-[31.25rem] flex-col justify-evenly bg-white px-5 text-black md:h-[37.5rem] dark:bg-neutral-900 dark:text-white">
          {cards.map((n) => (
            <Link
              key={n}
              href="/"
              onClick={onClose}
              className="text-xl font-semibold hover:underline"
            >
              {t("card")} {n}
            </Link>
          ))}
        </section>

        <div className="bg-white text-black dark:bg-neutral-900 dark:text-white">
          {/* الإعدادات: كلمة ظاهرة، وما تحتها يظهر عند الضغط
              key={resetKey} يعيدها (مع اللغة والمظهر) مطوية بعد إغلاق القائمة */}
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

          {/* القانوني: غير مرئي كعنوان، والرابطان ظاهران مباشرة */}
          <section
            aria-label={t("legal")}
            className="flex flex-col gap-4 border-t border-black/15 px-5 py-4 dark:border-white/20"
          >
            <Link
              href="/terms"
              onClick={onClose}
              className="text-xl font-semibold hover:underline"
            >
              {t("terms")}
            </Link>
            <Link
              href="/privacy"
              onClick={onClose}
              className="text-xl font-semibold hover:underline"
            >
              {t("privacy")}
            </Link>
          </section>
        </div>

        {/* 3) شريحة النهاية (سوداء) */}
        <section className="flex h-[9.375rem] items-center justify-center bg-black px-4 text-white md:h-[12.5rem]">
          <p className="text-3xl font-bold">{t("siteName")}</p>
        </section>
      </aside>
    </>
  );
}a