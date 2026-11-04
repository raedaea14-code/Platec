import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export const metadata: Metadata = {
  title: "Platec",
};

export default async function Page() {
  const t = await getTranslations();

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">{t("card")} 9</h1>
      <Link href="/" className="mt-6 inline-block underline">
        {t("back")}
      </Link>
    </section>
  );
}