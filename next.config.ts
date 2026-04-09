import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'http://192.168.1.7:8000/:path*',
      },
    ];
  },
};

export default nextConfig;
