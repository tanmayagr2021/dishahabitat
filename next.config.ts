import type { NextConfig } from "next";

/*
 * Every address on the current dishahabitat.com, sent permanently to its new home so existing
 * links, bookmarks and search results keep working after the switch. Leftover template pages from
 * the old site go to the home page.
 */
const moved: [string, string][] = [
  ["/our-journey", "/story"],
  ["/the-core", "/story#this-is-us"],
  ["/homemakers", "/story#homemakers"],
  ["/our-homes", "/homes"],
  ["/contact-us", "/contact"],
  ["/contact-us-copy-:n", "/contact"],
  ["/career", "/contact"],
  ["/thank-you", "/contact"],
  ["/solution/khata", "/checklist/khata-certificate"],
  ["/solution/occupancy-certificate", "/checklist/occupancy-certificate"],
  ["/solution/carpet-area", "/checklist/carpet-area"],
  ["/solution/deviation-assessment", "/checklist/deviation-assessment"],
  ["/solution/stp", "/checklist/sewage-treatment-plants"],
  ["/solution/:any*", "/checklist"],
  ["/project/disha-central-park", "/homes/disha-central-park"],
  ["/project/disha-courtyard", "/homes/disha-courtyard"],
  ["/project/disha-parkwest", "/homes/disha-park-west"],
  ["/project/disha-windsor-garden", "/homes/disha-windsor-gardens"],
  ["/project/disha-pursuit-of-sunshine", "/homes/disha-pursuit-of-sunshine"],
  ["/project/:any*", "/homes"],
  ["/old-home", "/"],
  ["/happy-new-year", "/"],
  ["/delete", "/"],
  ["/service/:any*", "/"],
  ["/brand/:any*", "/"],
  ["/template-items/:any*", "/"],
  ["/utility-pages/:any*", "/"],
  ["/term/:any*", "/privacy"],
  ["/socials/instagram", "https://instagram.com/dishahabitat"],
  ["/socials/facebook", "https://www.facebook.com/DishaHabitat/"],
  ["/socials/youtube", "https://www.youtube.com/channel/UCjP2EbQ0EQnB7tCUB-GGAEQ"],
];

const nextConfig: NextConfig = {
  /* The image qualities the pages ask for (the default list allows only 75). */
  images: { qualities: [75, 78, 82] },
  /* Tailwind runs on the one global stylesheet only, so every *.module.css stays a CSS Module. */
  turbopack: {
    rules: {
      "globals.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      ...moved.map(([source, destination]) => ({ source, destination, permanent: true })),
      /* The old tile-selection page embedded an outside tool. Temporary until Disha confirms it is still in use. */
      { source: "/tile-selection", destination: "https://www.sepoy.ai", permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
