/** @type {import('next').NextConfig} */
const nextConfig = {
// تعطيل مؤشرات Turbopack يدويًا لضمان استخدام Webpack المستقر داخل المتصفح
transpilePackages: [], 

webpack: (config, { isServer }) => {
// حل مشكلة استهلاك الذاكرة في بيئة المتصفح الوهمية (WebContainers)
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