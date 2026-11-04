import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ n: string }>;
}) {
  const { n } = await params;
  const t = await getTranslations();

  return (
    <section className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">
        {t("card")} {n}
      </h1>
      <p className="text-black/60 dark:text-white/60">قريباً</p>
      <Link href="/" className="mt-6 inline-block underline">
        {t("back")}
      </Link>
    </section>
  );
}