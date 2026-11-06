import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["**.replit.dev", "127.0.0.1"],
};

export default withNextIntl(nextConfig);