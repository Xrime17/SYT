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
    // Telegram WebView can aggressively cache HTML. Keep page shells no-store so updates are visible.
    const noStoreHtml = "no-store, no-cache, must-revalidate, max-age=0";
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: noStoreHtml,
          },
        ],
      },
      {
        source: "/home",
        headers: [
          {
            key: "Cache-Control",
            value: noStoreHtml,
          },
        ],
      },
      {
        source: "/tracker",
        headers: [
          {
            key: "Cache-Control",
            value: noStoreHtml,
          },
        ],
      },
      {
        source: "/tasks",
        headers: [
          {
            key: "Cache-Control",
            value: noStoreHtml,
          },
        ],
      },
      {
        source: "/tasks/new",
        headers: [
          {
            key: "Cache-Control",
            value: noStoreHtml,
          },
        ],
      },
      {
        source: "/tasks/:id",
        headers: [
          {
            key: "Cache-Control",
            value: noStoreHtml,
          },
        ],
      },
      {
        source: "/recurring",
        headers: [
          {
            key: "Cache-Control",
            value: noStoreHtml,
          },
        ],
      },
      {
        source: "/recurring/new",
        headers: [
          {
            key: "Cache-Control",
            value: noStoreHtml,
          },
        ],
      },
      {
        source: "/reminders",
        headers: [
          {
            key: "Cache-Control",
            value: noStoreHtml,
          },
        ],
      },
      {
        source: "/settings",
        headers: [
          {
            key: "Cache-Control",
            value: noStoreHtml,
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
