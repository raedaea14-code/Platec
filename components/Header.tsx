"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import SideMenu from "./SideMenu";

export default function Header() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="relative z-50 flex h-[3.75rem] w-full items-center bg-white shadow-sm md:h-[4.6875rem] lg:h-[5.625rem] dark:border-b dark:border-white/15 dark:bg-neutral-900">
        <button
          type="button"
          aria-label={t("menu")}
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="absolute start-4 flex size-10 items-center justify-center md:start-6 md:size-12 lg:start-10"
        >
          {/* ثلاث خطوط: الهاتف والآيباد (اللمس) */}
          <span className="flex flex-col items-center justify-center gap-1.5 pointer-fine:hidden">
            <span className="h-0.5 w-6 bg-black md:w-7 dark:bg-white" />
            <span className="h-0.5 w-6 bg-black md:w-7 dark:bg-white" />
            <span className="h-0.5 w-6 bg-black md:w-7 dark:bg-white" />
          </span>

          {/* سهم: الكمبيوتر (الفأرة ولوحة التتبع) */}
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`hidden size-7 text-black transition-transform duration-300 pointer-fine:block dark:text-white ${
              open ? "rotate-180" : ""
            }`}
          >
            <path d="M5 9l7 7 7-7" />
          </svg>
        </button>

        <Link
          href="/"
          className="mx-auto text-2xl font-bold text-black md:text-3xl lg:text-4xl dark:text-white"
        >
          {t("siteName")}
        </Link>
      </header>

      <SideMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}