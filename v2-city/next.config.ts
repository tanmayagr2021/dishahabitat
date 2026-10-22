import type { NextConfig } from "next";

/*
 * V2 ("A city, made of homes") is a standalone prototype. It shares no code with the V1 site in the
 * parent folder; locally it borrows the parent's installed packages through the node_modules link.
 */
const nextConfig: NextConfig = {
  /* One page and about 7 KB of CSS: inlined, so the first paint needs no extra round trip. */
  experimental: {
    inlineCss: true,
  },
  images: {
    qualities: [78],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          /* A design prototype: keep it out of search results wherever it is hosted. */
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/atlas/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
      {
        source: "/images/:file*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },
};

export default nextConfig;
