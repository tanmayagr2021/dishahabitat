import type { MetadataRoute } from "next";
import { checklist } from "@/lib/checklist";
import { elements } from "@/lib/elements";
import { projects } from "@/lib/projects";
import { siteUrl } from "@/lib/launch";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "/", priority: 1 },
    { path: elements.href, priority: 0.9 },
    { path: "/homes", priority: 0.8 },
    { path: "/contact", priority: 0.8 },
    { path: "/compare", priority: 0.7 },
    { path: "/story", priority: 0.7 },
    { path: "/checklist", priority: 0.6 },
    { path: "/plan", priority: 0.5 },
    ...projects.map((p) => ({ path: `/homes/${p.slug}`, priority: 0.6 })),
    ...checklist.map((c) => ({ path: `/checklist/${c.slug}`, priority: 0.4 })),
    { path: "/privacy", priority: 0.2 },
  ];
  return pages.map(({ path, priority }) => ({ url: `${siteUrl}${path}`, lastModified: new Date("2026-10-15"), priority }));
}
