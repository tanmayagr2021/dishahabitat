/*
 * Launch settings, read at build time.
 *
 * SITE_URL       the public address, e.g. https://www.dishahabitat.com (defaults to the Vercel
 *                production address, then to localhost).
 * SITE_INDEXING  set to "true" on launch day to let search engines index the site. Until then
 *                every page carries noindex and robots.txt disallows crawling, so the preview
 *                never competes with the live dishahabitat.com.
 */
export const siteUrl =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const indexing = process.env.SITE_INDEXING === "true";
