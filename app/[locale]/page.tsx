a"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

const cards = Array.from({ length: 10 }, (_, i) => i + 1);

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="mx-auto w-full max-w-7xl p-(--space) py-6 md:py-10 lg:py-14 [--space:clamp(1rem,2.5vw,2.5rem)]">
      <div className="grid grid-cols-2 gap-(--space) md:grid-cols-3 lg:grid-cols-4">
        {cards.map((n) => (
          <Link
            key={n}
            href={`/${locale}/tools/${n}`}
            className="flex aspect-[10.5/9.375] w-full items-center justify-center rounded-xl border border-black/15 bg-white text-lg font-semibold text-black shadow-sm transition hover:shadow-md md:aspect-[3/2] md:text-2xl lg:aspect-[6/5] lg:text-3xl dark:border-white/20 dark:bg-neutral-800 dark:text-white"
          >
            {t("card")} {n}
          </Link>
        ))}
      </div>
    </section>
  );
}