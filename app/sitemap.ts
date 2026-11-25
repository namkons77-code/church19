import type { MetadataRoute } from "next";
import { SUBMENU_PAGES } from "./data/submenuData";

const BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
).replace(/\/$/, "");

const LAST_MODIFIED = new Date("2026-11-25T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const topRoutes: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "", changeFrequency: "daily", priority: 1.0 },
    { path: "/ministry", changeFrequency: "monthly", priority: 0.8 },
    { path: "/worship", changeFrequency: "weekly", priority: 0.9 },
    { path: "/education", changeFrequency: "monthly", priority: 0.8 },
    { path: "/mission", changeFrequency: "monthly", priority: 0.8 },
    { path: "/online", changeFrequency: "monthly", priority: 0.8 },
    { path: "/parish", changeFrequency: "monthly", priority: 0.7 },
    { path: "/service", changeFrequency: "monthly", priority: 0.7 },
    { path: "/community", changeFrequency: "daily", priority: 0.9 },
    { path: "/login", changeFrequency: "yearly", priority: 0.5 },
    { path: "/signup", changeFrequency: "yearly", priority: 0.5 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.4 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.4 },
    { path: "/sitemap", changeFrequency: "monthly", priority: 0.5 },
  ];

  const submenuRoutes: MetadataRoute.Sitemap = SUBMENU_PAGES.map((p) => ({
    url: `${BASE_URL}/${p.categoryId}/${p.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    ...topRoutes.map((r) => ({
      url: `${BASE_URL}${r.path}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...submenuRoutes,
  ];
}
