/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/api/stickers/**": ["./lib/fonts/**"],
  },
};

export default nextConfig;
