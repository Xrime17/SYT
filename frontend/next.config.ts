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
    // HTML documents: no long-lived cache so deploys are visible immediately (Telegram WebView included).
    // Hashed JS/CSS under /_next/static/ stays immutable — fresh HTML points at new filenames.
    const htmlCacheControl =
      "no-store, no-cache, must-revalidate, max-age=0";
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheControl,
          },
        ],
      },
      {
        source: "/home",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheControl,
          },
        ],
      },
      {
        source: "/tracker",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheControl,
          },
        ],
      },
      {
        source: "/tasks",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheControl,
          },
        ],
      },
      {
        source: "/tasks/new",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheControl,
          },
        ],
      },
      {
        source: "/tasks/:id",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheControl,
          },
        ],
      },
      {
        source: "/recurring",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheControl,
          },
        ],
      },
      {
        source: "/recurring/new",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheControl,
          },
        ],
      },
      {
        source: "/reminders",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheControl,
          },
        ],
      },
      {
        source: "/settings",
        headers: [
          {
            key: "Cache-Control",
            value: htmlCacheControl,
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
