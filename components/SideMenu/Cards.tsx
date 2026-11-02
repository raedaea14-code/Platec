"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export const cards = [1, 2, 3, 4, 5, 6];

/* البطاقات للهاتف والآيباد */
export function MobileCards({ onClose }: { onClose: () => void }) {
  const t = useTranslations();

  return (
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
  );
}

/* قائمة البطاقات المنبثقة للكمبيوتر */
export function DesktopCardsMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations();

  return (
    <nav
      id="pages-menu"
      aria-hidden={!open}
      inert={!open}
      className={`absolute start-4 top-[4.25rem] z-20 hidden max-h-[19rem] w-64 overflow-y-auto rounded-xl border border-black/15 bg-white p-2 text-black shadow-xl transition-[transform,opacity] duration-200 dark:border-white/20 dark:bg-neutral-900 dark:text-white min-[49rem]:block ${
        open
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
  );
}