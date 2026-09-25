import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      { source: "/dashboard", destination: "/requestment/dashboard", permanent: true },
      { source: "/request", destination: "/requestment/dashboard", permanent: true },
      { source: "/login", destination: "/requestment/login", permanent: true },
      { source: "/my-requests", destination: "/requestment/my-requests", permanent: true },
      { source: "/notifications", destination: "/requestment/notifications", permanent: true },
      { source: "/reports", destination: "/requestment/reports", permanent: true },
      { source: "/requests/:path*", destination: "/requestment/requests/:path*", permanent: true },
      { source: "/settings", destination: "/requestment/settings", permanent: true },
      { source: "/timeline", destination: "/requestment/timeline", permanent: true },
      { source: "/users", destination: "/requestment/users", permanent: true },
    ];
  },
};

export default nextConfig;
