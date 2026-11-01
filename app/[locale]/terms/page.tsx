"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function TermsPage() {
  const t = useTranslations();
  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-4 text-2xl font-bold">{t("terms")}</h1>
      <Link href="/" className="underline">
        {t("back")}
      </Link>
    </section>
  );
}