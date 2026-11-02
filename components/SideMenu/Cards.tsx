"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export const cards = [1, 2, 3, 4, 5, 6];

/* البطاقات للهاتف والآيباد */
export function MobileCards({ onClose }: { onClose: () => void }) {
  const t = useTranslations();

  return (
    <section className="flex h-[31.25rem] flex-col justify-evenly px-5 md:h-[37.5rem] min-[49rem]:hidden">
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

/* قائمة البطاقات للكمبيوتر (تظهر عند فتح السهم) */
export function DesktopCardsMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations();

  if (!open) return null;

  return (
    <div
      id="pages-menu"
      className="mt-2 space-y-1 hidden min-[49rem]:block"
    >
      {cards.map((n) => (
        <Link
          key={n}
          href="/"
          onClick={onClose}
          className="block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10"
        >
          {t("card")} {n}
        </Link>
      ))}
    </div>
  );
}