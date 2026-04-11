import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://192.168.1.9:8000"}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;