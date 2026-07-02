import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://resturant-5nex.vercel.app/api/:path*',
      },
    ];
  },
};

export default nextConfig;
