import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
  /* config options here */
    images: {
        remotePatterns: [new URL('https://*.vercel-storage.com/**')],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true
    },
};

export default nextConfig;
