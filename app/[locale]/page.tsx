"use client";

import { useTranslations } from "next-intl";

const cards = Array.from({ length: 10 }, (_, i) => i + 1);

export default function Home() {
  const t = useTranslations();

  return (
    <section className="mx-auto flex w-full max-w-[76rem] flex-wrap justify-center gap-4 px-4 py-6 md:gap-6 md:py-10 lg:gap-8 lg:py-14">
      {cards.map((n) => (
        <div
          key={n}
          className="flex h-[9.375rem] w-[10.5rem] items-center justify-center rounded-xl border border-black/15 bg-white text-lg font-semibold text-black shadow-sm md:h-[11.875rem] md:w-[22rem] md:text-2xl lg:h-[14.375rem] lg:w-[calc(50%-1rem)] lg:max-w-[36rem] dark:border-white/20 dark:bg-neutral-800 dark:text-white"
        >
          {t("card")} {n}
        </div>
      ))}
    </section>
  );
}