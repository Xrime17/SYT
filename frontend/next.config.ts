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
    const isDev = process.env.NODE_ENV !== 'production';
    // Telegram WebView can aggressively cache HTML. In dev keep page shells no-store so updates are visible.
    const noStoreHtml = "no-store, no-cache, must-revalidate, max-age=0";
    const htmlRootCache = 'public, s-maxage=86400, stale-while-revalidate=300';
    const htmlPageCache = 'public, s-maxage=300, stale-while-revalidate=60';
    const htmlCacheFor = isDev ? noStoreHtml : htmlPageCache;
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: isDev ? noStoreHtml : htmlRootCache,
          },
        ],
      },
      {
        source: "/home",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheFor,
          },
        ],
      },
      {
        source: "/tracker",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheFor,
          },
        ],
      },
      {
        source: "/tasks",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheFor,
          },
        ],
      },
      {
        source: "/tasks/new",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheFor,
          },
        ],
      },
      {
        source: "/tasks/:id",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheFor,
          },
        ],
      },
      {
        source: "/recurring",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheFor,
          },
        ],
      },
      {
        source: "/recurring/new",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheFor,
          },
        ],
      },
      {
        source: "/reminders",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheFor,
          },
        ],
      },
      {
        source: "/settings",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheFor,
          },
        ],
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
