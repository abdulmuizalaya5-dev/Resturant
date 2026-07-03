import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

const nextConfig: NextConfig = {
  async rewrites() {
    if (!isProd) return [];
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'https://resturant-5nex.vercel.app/api/:path*',
        },
      ],
    };
  },
};

export default nextConfig;
