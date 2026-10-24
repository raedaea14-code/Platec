"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="flex h-[9.375rem] w-full flex-col items-center justify-center gap-2 bg-black px-4 text-white md:h-[11.25rem] md:gap-3 lg:h-[13.75rem] lg:gap-4">
      <p className="text-xl font-bold md:text-2xl lg:text-3xl">
        {t("siteName")}
      </p>
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm md:text-base">
        <Link href="/terms" className="hover:underline">
          {t("terms")}
        </Link>
        <Link href="/privacy" className="hover:underline">
          {t("privacy")}
        </Link>
      </nav>
      <p className="text-xs text-white/70 md:text-sm">
        © {new Date().getFullYear()} {t("siteName")}. {t("rights")}.
      </p>
    </footer>
  );
}