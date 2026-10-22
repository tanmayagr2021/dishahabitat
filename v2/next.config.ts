import type { NextConfig } from "next";

/*
 * V2 is a standalone prototype. It shares no code with the V1 site in the parent folder;
 * locally it borrows the parent's installed packages through the node_modules symlink.
 */
const nextConfig: NextConfig = {
  images: {
    qualities: [72, 80],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560],
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
    ];
  },
};

export default nextConfig;
