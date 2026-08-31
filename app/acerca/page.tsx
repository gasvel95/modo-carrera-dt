/* eslint-disable @next/next/no-html-link-for-pages -- plain anchors avoid a vinext hydration issue in this route. */
import type { Metadata } from "next";
import { SITE_URL } from "../site";

export const metadata: Metadata = {
  title: "Acerca del juego",
  description: "Conocé Modo Carrera DT, el simulador gratuito de fútbol argentino con carrera de director técnico y carrera de jugador desde el ascenso.",
  alternates: { canonical: "/acerca" },
  openGraph: {
    title: "Acerca de Modo Carrera DT",
    description: "Dos carreras narrativas inspiradas en el ascenso y el folclore del fútbol argentino.",
    url: "/acerca",
    type: "article",
    images: [{ url: "/og.png", width: 1733, height: 909, alt: "Modo Carrera DT" }],
  },
};

const faq = [
  ["¿Qué es Modo Carrera DT?", "Es un juego gratuito de estrategia y simulación narrativa ambientado en el fútbol argentino. Cada decisión modifica el desarrollo de la carrera."],
  ["¿Qué modos de juego incluye?", "Incluye una carrera como director técnico y una carrera como futbolista del ascenso."],
  ["¿Hasta dónde llega la carrera de jugador?", "Comienza en Primera D, permite ascender y cambiar de club hasta llegar a Primera División, y continúa hasta el retiro voluntario o por edad."],
  ["¿Los partidos y eventos son siempre iguales?", "No. Los resultados, ofertas y eventos utilizan probabilidades, por lo que cada carrera construye una historia diferente."],
  ["¿Es necesario instalar el juego?", "No. Se juega gratis desde un navegador moderno y la partida queda guardada localmente en el dispositivo."],
];

export default function AboutPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "VideoGame",
        "@id": `${SITE_URL}/#game`,
        name: "Modo Carrera DT",
        url: SITE_URL,
        description: "Juego narrativo gratuito de fútbol argentino con carrera de director técnico y carrera de jugador.",
        genre: ["Simulación deportiva", "Estrategia", "Narrativa interactiva"],
        gamePlatform: "Navegador web",
        playMode: "SinglePlayer",
        inLanguage: "es-AR",
        isAccessibleForFree: true,
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map(([name, text]) => ({
          "@type": "Question",
          name,
          acceptedAnswer: { "@type": "Answer", text },
        })),
      },
    ],
  };

  return <main className="info-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <nav aria-label="Navegación principal"><a href="/">← JUGAR AHORA</a></nav>
    <article>
      <header><p>FÚTBOL ARGENTINO · SIMULACIÓN NARRATIVA</p><h1>UNA CARRERA.<br /><em>MIL HISTORIAS.</em></h1><span>Modo Carrera DT convierte el ascenso argentino, sus decisiones y su folclore en una partida distinta cada vez.</span></header>
      <section><h2>¿QUÉ ES MODO CARRERA DT?</h2><p>Es un juego online gratuito para quienes disfrutan la estrategia, las historias deportivas y el fútbol argentino. No controlás a once jugadores en tiempo real: elegís cómo construir una carrera, asumís riesgos y convivís con las consecuencias.</p></section>
      <div className="info-grid">
        <section><small>01 · DESDE EL BANCO</small><h2>CARRERA DE DIRECTOR TÉCNICO</h2><p>Armá el plantel, definí la táctica, negociá incorporaciones y respondé ante la dirigencia. Los objetivos, los resultados, los ascensos, las copas y el vínculo con cada club forman tu reputación.</p></section>
        <section><small>02 · DENTRO DE LA CANCHA</small><h2>CARRERA DE JUGADOR</h2><p>Debutá en Primera D, ganate la titularidad y mejorá tu nivel. Las ofertas pueden llevarte por Primera C, Primera B y Primera Nacional hasta llegar a Primera. La historia sigue hasta que decidas retirarte o llegue el final por edad.</p></section>
      </div>
      <section><h2>FOLCLORE, AZAR Y CONSECUENCIAS</h2><p>Micrófonos calientes, viajes de ascenso, canchas embarradas, cábalas de vestuario, penales en el clásico y promesas de dirigentes aparecen como decisiones narrativas. Cada opción tiene una probabilidad de salir bien o mal y puede cambiar la confianza, el estado físico, la reputación o el rendimiento.</p></section>
      <section className="faq"><p>PREGUNTAS FRECUENTES</p><h2>ANTES DE EMPEZAR</h2>{faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><span>{answer}</span></details>)}</section>
      <footer><a href="/">EMPEZAR UNA CARRERA →</a><small>Gratis · En español · Sin instalación</small></footer>
    </article>
  </main>;
}
