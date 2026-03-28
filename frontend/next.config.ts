import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    optimizePackageImports: ["@/components", "@/api", "@/hooks", "@/context"],
  },
  async headers() {
    // HTML страниц не кэшируем агрессивно: Telegram WebView + edge иначе долго держат старый бандл после деплоя.
    const docNoStore = [
      { key: "Cache-Control", value: "private, no-cache, no-store, must-revalidate" },
    ] as const;
    return [
      { source: "/", headers: [...docNoStore] },
      { source: "/home", headers: [...docNoStore] },
      { source: "/settings", headers: [...docNoStore] },
      {
        source: "/tasks",
        headers: [...docNoStore],
      },
      {
        source: "/tasks/new",
        headers: [...docNoStore],
      },
      {
        source: "/tasks/:path*",
        headers: [...docNoStore],
      },
      {
        source: "/recurring",
        headers: [...docNoStore],
      },
      {
        source: "/recurring/new",
        headers: [...docNoStore],
      },
      {
        source: "/reminders",
        headers: [...docNoStore],
      },
      {
        source: "/tracker",
        headers: [...docNoStore],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
