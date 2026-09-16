import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-16T00:00:00-03:00");
  const pages = ["", "/guias", "/clubes", "/acerca", "/privacidad", "/terminos", "/contacto"];
  return pages.map((path, index) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: index < 3 ? "weekly" as const : "monthly" as const,
    priority: index === 0 ? 1 : index < 3 ? .9 : .6,
  }));
}

