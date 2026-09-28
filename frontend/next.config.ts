import type { NextConfig } from "next";

const apiUrl = process.env.API_URL ?? "http://localhost:8080/api";

const nextConfig: NextConfig = {
  // The browser only ever talks to /api on this domain; Vercel proxies it to the Spring API.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiUrl}/:path*` }];
  },
  async redirects() {
    return [
      { source: "/stories/create", destination: "/write", permanent: true },
      { source: "/stories/my", destination: "/desk", permanent: true },
    ];
  },
};

export default nextConfig;
