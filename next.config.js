/** @type {import('next').NextConfig} */
const nextConfig = {
  // تعطيل الميزات التجريبية ومحركات التوربو لتقليل استهلاك رام الهاتف
  transpilePackages: [],
  experimental: {
    wasmPackages: false,
    turbo: {
      rules: {}
    }
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
