import type { MetadataRoute } from "next";
import { SITE_URL } from "./site";
import { ARTICLES } from "../src/data/articles";
import { CLUBS } from "../src/data/clubs";
import { hasClubStory } from "../src/data/clubHistories";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-10-03T00:00:00-03:00");
  const pages = ["", "/guias", "/articulos", "/clubes", "/acerca", "/privacidad", "/terminos", "/contacto"];
  const main = pages.map((path, index) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: index < 4 ? "weekly" as const : "monthly" as const,
    priority: index === 0 ? 1 : index < 4 ? .9 : .6,
  }));
  const articles = ARTICLES.map((article) => ({
    url: `${SITE_URL}/articulos/${article.slug}`,
    lastModified: new Date(article.published),
    changeFrequency: "monthly" as const,
    priority: .7,
  }));
  const clubs = CLUBS.filter((club) => hasClubStory(club.id)).map((club) => ({
    url: `${SITE_URL}/clubes/${club.id}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: .6,
  }));
  return [...main, ...articles, ...clubs];
}
