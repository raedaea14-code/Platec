"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export default function ToolPage({ params }: { params: { locale: string } }) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">
        {t("card")} 1
      </h1>

      <div className="rounded-xl border border-black/15 bg-white p-6 text-black shadow-sm dark:border-white/20 dark:bg-neutral-800 dark:text-white">
        <p className="mb-4 text-sm text-black/60 dark:text-white/60">
          هنا تظهر الأداة لاحقاً
        </p>
        <button className="rounded-lg bg-black px-4 py-2 text-white dark:bg-white dark:text-black">
          تجربة
        </button>
      </div>

      <Link href={`/${locale}`} className="mt-6 inline-block underline">
        {t("back")}
      </Link>
    </section>
  );
}