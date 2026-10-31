"use client";

import Link from "next/link";
import { useLocale } from "next-intl";

const cards = Array.from({ length: 10 }, (_, i) => i + 1);

export default function Home() {
  const lang = useLocale();

  return (
    <section className="mx-auto w-full max-w-[76rem] px-4 py-6 md:px-6 md:py-10 lg:py-14">
      {/* شبكة تتكون من عمودين للهاتف، و4 أعمدة للكمبيوتر في صف واحد */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 justify-items-center">
        {cards.map((n) => (
          <Link
            key={n}
            href={`/${lang}/tools/${n}`}
            className="flex h-[9.375rem] w-full items-center justify-center rounded-xl border border-black/15 bg-white text-lg font-semibold text-black shadow-sm transition hover:shadow-md md:h-[11.875rem] md:text-2xl lg:h-[14.375rem] dark:border-white/20 dark:bg-neutral-800 dark:text-white"
          >
            {n}
          </Link>
        ))}
      </div>
    </section>
  );
}