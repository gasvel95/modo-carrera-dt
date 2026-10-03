import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARTICLES, getArticle } from "../../../src/data/articles";
import { SITE_URL } from "../../site";
import { ContentLayout, PageEnd } from "../../content-layout";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/articulos/${article.slug}` },
    openGraph: { title: article.title, description: article.description, type: "article", url: `/articulos/${article.slug}`, publishedTime: article.published },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  const related = ARTICLES.filter((other) => other.slug !== article.slug).slice(0, 3);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.published,
    inLanguage: "es-AR",
    author: { "@type": "Person", name: "Gastón Veliez" },
    publisher: { "@type": "Organization", name: "Oddloop" },
    mainEntityOfPage: `${SITE_URL}/articulos/${article.slug}`,
  };
  return <ContentLayout eyebrow={article.category.toUpperCase()} title={article.title.toUpperCase()} intro={article.description}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\u003c") }} />
    <p className="section-label">Por Oddloop · {article.published} · {article.minutes} min de lectura</p>
    {article.sections.map((section) => <section key={section.heading}>
      <h2>{section.heading}</h2>
      {section.paragraphs.map((text) => <p key={text.slice(0, 40)}>{text}</p>)}
      {section.list ? <ul>{section.list.map((item) => <li key={item}>{item}</li>)}</ul> : null}
    </section>)}
    <section><h2>Seguí leyendo</h2><ul>{related.map((other) => <li key={other.slug}><a href={`/articulos/${other.slug}`}>{other.title}</a></li>)}</ul></section>
    <PageEnd />
  </ContentLayout>;
}
