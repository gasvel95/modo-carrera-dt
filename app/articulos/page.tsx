import type { Metadata } from "next";
import { ARTICLES } from "../../src/data/articles";
import { ContentLayout, PageEnd } from "../content-layout";

export const metadata: Metadata = { title: "Artículos", description: "Artículos originales sobre fútbol argentino, ascensos, táctica, historia y estrategia para jugar Modo Carrera DT.", alternates: { canonical: "/articulos" } };

export default function ArticlesPage() {
  return <ContentLayout eyebrow="REVISTA" title="HISTORIAS, TÁCTICA Y FOLCLORE" intro="Artículos originales sobre el fútbol argentino y las decisiones que dan forma a una carrera.">
    <div className="club-directory">{ARTICLES.map((article) => <article key={article.slug}>
      <div><small>{article.category} · {article.minutes} min de lectura</small><h3><a href={`/articulos/${article.slug}`}>{article.title}</a></h3><p>{article.description}</p></div>
    </article>)}</div>
    <PageEnd />
  </ContentLayout>;
}
