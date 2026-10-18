"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "./LangProvider";
import SideMenu from "./SideMenu";

export default function Header() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="relative z-50 flex h-[3.75rem] w-full items-center bg-white shadow-sm md:h-[4.6875rem] lg:h-[5.625rem] dark:border-b dark:border-white/15 dark:bg-neutral-900">
        {/* Hamburger: right in Arabic, left in English (start side) */}
        <button
          type="button"
          aria-label={t.menu}
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="absolute start-4 flex size-10 flex-col items-center justify-center gap-1.5 md:start-6 md:size-12 lg:start-10"
        >
          <span className="h-0.5 w-6 bg-black md:w-7 dark:bg-white" />
          <span className="h-0.5 w-6 bg-black md:w-7 dark:bg-white" />
          <span className="h-0.5 w-6 bg-black md:w-7 dark:bg-white" />
        </button>

        <Link
          href="/"
          className="mx-auto text-2xl font-bold text-black md:text-3xl lg:text-4xl dark:text-white"
        >
          {t.siteName}
        </Link>
      </header>

      <SideMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}