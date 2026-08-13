import { GameApp } from "../src/ui/GameApp";
import { SITE_URL } from "./site";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Modo Carrera DT",
    url: SITE_URL,
    description: "Juego narrativo de director técnico argentino: empezá en el ascenso, tomá decisiones y construí una carrera hasta ganar en Argentina y la Copa Libertadores.",
    applicationCategory: "GameApplication",
    applicationSubCategory: "Juego de estrategia y simulación de fútbol",
    operatingSystem: "Cualquier dispositivo con navegador web",
    browserRequirements: "Navegador web moderno con JavaScript",
    inLanguage: "es-AR",
    isAccessibleForFree: true,
    author: { "@type": "Organization", name: "Oddloop" },
    offers: { "@type": "Offer", price: "0", priceCurrency: "ARS" },
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    <GameApp />
  </>;
}
