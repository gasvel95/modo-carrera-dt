import type { ReactNode } from "react";

export function ContentLayout({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <main className="editorial-page">
    <header className="editorial-hero"><p>{eyebrow}</p><h1>{title}</h1><span>{intro}</span></header>
    <article className="editorial-body">{children}</article>
  </main>;
}

export function PageEnd() {
  return <aside className="editorial-cta"><strong>¿LISTO PARA PONERLO EN PRÁCTICA?</strong><a href="/">JUGAR AHORA →</a></aside>;
}
