"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export const cards = [1, 2, 3, 4, 5, 6];

/* البطاقات للهاتف والآيباد (أقل من 1024px) */
export function MobileCards({ onClose }: { onClose: () => void }) {
  const t = useTranslations();

  return (
    <section className="flex h-[31.25rem] flex-col justify-evenly px-5 md:h-[37.5rem] lg:hidden">
      {cards.map((n) => (
        <Link
          key={n}
          href="/"
          onClick={onClose}
          className="rounded-md text-xl font-semibold hover:underline"
        >
          {t("card")} {n}
        </Link>
      ))}
    </section>
  );
}

/* البطاقات للكمبيوتر (1024px فأكثر) */
export function DesktopCards({ onClose }: { onClose: () => void }) {
  const t = useTranslations();

  return (
    <section className="hidden flex-col gap-1 p-3 lg:flex">
      {cards.map((n) => (
        <Link
          key={n}
          href="/"
          onClick={onClose}
          className="rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10"
        >
          {t("card")} {n}
        </Link>
      ))}
    </section>
  );
}