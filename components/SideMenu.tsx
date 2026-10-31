"use client";

import { useEffect, useId, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
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
      className={`flex w-full cursor-pointer items-center justify-between py-2 text-start text-base hover:underline min-[49rem]:hover:bg-black/5 dark:min-[49rem]:hover:bg-white/10 ${
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

  /* الكمبيوتر: قائمة الصفحات المنبثقة من السهم في الهيدر */
  const [pagesOpen, setPagesOpen] = useState(false);

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
      else if (pagesOpen) setPagesOpen(false);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, settingsOpen, pagesOpen]);

  /* بعد إغلاق القائمة (وانتهاء حركة الانزلاق 300ms) نعيد الأقسام مطوية */
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
        className={`fixed inset-y-0 start-0 z-[60] h-dvh w-[70%] overflow-y-auto bg-black transition-[transform,opacity] duration-300 sm:w-80 min-[49rem]:pointer-events-none min-[49rem]:inset-0 min-[49rem]:flex min-[49rem]:h-auto min-[49rem]:w-auto min-[49rem]:items-center min-[49rem]:justify-center min-[49rem]:overflow-visible min-[49rem]:bg-transparent ${
          open
            ? "translate-x-0 min-[49rem]:opacity-100"
            : "ltr:-translate-x-full rtl:translate-x-full min-[49rem]:opacity-0 min-[49rem]:ltr:translate-x-0 min-[49rem]:rtl:translate-x-0"
        }`}
      >
        <div className="min-[49rem]:pointer-events-auto min-[49rem]:relative min-[49rem]:mx-6 min-[49rem]:w-full min-[49rem]:max-w-2xl min-[49rem]:overflow-hidden min-[49rem]:rounded-2xl min-[49rem]:shadow-2xl">
          {/* 1) شريحة البداية
              الهاتف والآيباد: سوداء مع زر إغلاق
              الكمبيوتر: بنفس لون باقي القائمة، سهم (يفتح قائمة الصفحات)
              في جهة البداية، واسم الموقع في الوسط، وزر الإغلاق في جهة النهاية */}
          <section className="relative flex h-[6.25rem] items-center justify-center bg-black text-white md:h-[9.375rem] min-[49rem]:h-[6.25rem] min-[49rem]:border-b min-[49rem]:border-black/15 min-[49rem]:bg-white min-[49rem]:text-black dark:min-[49rem]:border-white/20 dark:min-[49rem]:bg-neutral-900 dark:min-[49rem]:text-white">
            {/* الكمبيوتر فقط: سهم يفتح قائمة الصفحات */}
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
              className="absolute start-4 top-4 z-20 hidden size-11 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-black/10 focus-visible:bg-black/10 dark:hover:bg-white/15 dark:focus-visible:bg-white/15 min-[49rem]:flex"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`size-6 transition-transform duration-300 ${
                  pagesOpen ? "rotate-180" : ""
                }`}
              >
                <path d="M5 9l7 7 7-7" />
              </svg>
            </button>

            {/* زر الإغلاق:
                الهاتف: أيقونة 1.25rem، مساحة النقر 2.75rem، البعد 1rem
                الآيباد (md): أيقونة 1.5rem، مساحة النقر 2.75rem، البعد 1.5rem
                الكمبيوتر: زر 2.75rem، أيقونة text-2xl، top-4 end-4 */}
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

          {/* الكمبيوتر: إغلاق قائمة الصفحات عند الضغط خارجها */}
          {pagesOpen && (
            <div
              aria-hidden
              onClick={() => setPagesOpen(false)}
              className="absolute inset-0 z-10 hidden min-[49rem]:block"
            />
          )}

          {/* الكمبيوتر: قائمة الصفحات المنبثقة من السهم */}
          <nav
            id="pages-menu"
            aria-hidden={!pagesOpen}
            inert={!pagesOpen}
            className={`absolute start-4 top-[4.25rem] z-20 hidden max-h-[19rem] w-64 overflow-y-auto rounded-xl border border-black/15 bg-white p-2 text-black shadow-xl transition-[transform,opacity] duration-200 dark:border-white/20 dark:bg-neutral-900 dark:text-white min-[49rem]:block ${
              pagesOpen
                ? "translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            <Link
              href="/"
              onClick={onClose}
              className="block rounded-md px-3 py-2 text-lg font-semibold hover:bg-black/5 dark:hover:bg-white/10"
            >
              {t("home")}
            </Link>
            {cards.map((n) => (
              <Link
                key={n}
                href="/"
                onClick={onClose}
                className="block rounded-md px-3 py-2 text-lg font-semibold hover:bg-black/5 dark:hover:bg-white/10"
              >
                {t("card")} {n}
              </Link>
            ))}
          </nav>

          {/* 2) المحتوى الرئيسي:
              الكمبيوتر: عمودان (نصف ونصف) بارتفاع أقصى 25rem مع تمرير */}
          <div className="bg-white text-black dark:bg-neutral-900 dark:text-white min-[49rem]:max-h-[25rem] min-[49rem]:min-h-[20rem] min-[49rem]:overflow-y-auto">
            {/* الهاتف والآيباد: الرئيسية + البطاقات
                (على الكمبيوتر أصبحت داخل قائمة السهم في الهيدر) */}
            <div className="min-[49rem]:hidden">
              <Link
                href="/"
                onClick={onClose}
                className="block border-b border-black/15 px-5 py-4 text-xl font-semibold hover:underline dark:border-white/20 min-[49rem]:hover:bg-black/5 dark:min-[49rem]:hover:bg-white/10"
              >
                {t("home")}
              </Link>

              <section className="flex h-[31.25rem] flex-col justify-evenly px-5 md:h-[37.5rem] min-[49rem]:h-auto min-[49rem]:justify-start min-[49rem]:gap-1 min-[49rem]:py-3">
                {cards.map((n) => (
                  <Link
                    key={n}
                    href="/"
                    onClick={onClose}
                    className="rounded-md text-xl font-semibold hover:underline min-[49rem]:-mx-3 min-[49rem]:px-3 min-[49rem]:py-2 min-[49rem]:hover:bg-black/5 dark:min-[49rem]:hover:bg-white/10"
                  >
                    {t("card")} {n}
                  </Link>
                ))}
              </section>
            </div>

            {/* الإعدادات + القانوني */}
            <div>
              {/* الإعدادات: كلمة ظاهرة، وما تحتها يظهر عند الضغط
                  key={resetKey} يعيدها (مع اللغة والمظهر) مطوية بعد إغلاق القائمة */}
              {/* الهاتف والآيباد: قسم قابل للطي */}
              <div className="min-[49rem]:hidden">
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
                onClick={() => {
                  setPagesOpen(false);
                  setSettingsOpen((v) => !v);
                }}
                className={`hidden w-full cursor-pointer items-center justify-between px-5 py-4 text-start text-xl font-semibold min-[49rem]:flex min-[49rem]:hover:bg-black/5 dark:min-[49rem]:hover:bg-white/10 ${
                  settingsOpen ? "min-[49rem]:bg-black/5 dark:min-[49rem]:bg-white/10" : ""
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
                className="flex flex-col gap-4 border-t border-black/15 px-5 py-4 dark:border-white/20 min-[49rem]:gap-1"
              >
                <Link
                  href="/terms"
                  onClick={onClose}
                  className="rounded-md text-xl font-semibold hover:underline min-[49rem]:-mx-3 min-[49rem]:px-3 min-[49rem]:py-2 min-[49rem]:hover:bg-black/5 dark:min-[49rem]:hover:bg-white/10"
                >
                  {t("terms")}
                </Link>
                <Link
                  href="/privacy"
                  onClick={onClose}
                  className="rounded-md text-xl font-semibold hover:underline min-[49rem]:-mx-3 min-[49rem]:px-3 min-[49rem]:py-2 min-[49rem]:hover:bg-black/5 dark:min-[49rem]:hover:bg-white/10"
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
            className={`absolute bottom-0 top-[6.25rem] end-0 hidden w-1/2 overflow-y-auto border-s border-black/15 bg-white text-black shadow-xl transition-[transform,opacity] duration-300 dark:border-white/20 dark:bg-neutral-900 dark:text-white min-[49rem]:block ${
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

          {/* 3) شريحة النهاية (سوداء): الهاتف والآيباد فقط، محذوفة على الكمبيوتر */}
          <section className="flex h-[3.75rem] items-center justify-center bg-black px-4 text-white md:h-[4.5rem] min-[49rem]:hidden">
            <p className="text-3xl font-bold">{t("siteName")}</p>
          </section>
        </div>
      </aside>
    </>
  );
}