import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "./site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Modo Carrera DT | Juego de director técnico argentino",
    template: "%s | Modo Carrera DT",
  },
  description: "Juego de director técnico y carrera de jugador argentino gratis y online. Empezá en el ascenso y construí tu historia hasta Primera.",
  applicationName: "Modo Carrera DT",
  authors: [{ name: "Oddloop" }],
  creator: "Oddloop",
  publisher: "Oddloop",
  category: "games",
  keywords: [
    "juego de fútbol argentino",
    "modo carrera DT",
    "simulador de director técnico",
    "carrera de jugador",
    "fútbol de ascenso",
    "Primera D",
    "Primera Nacional",
    "juego de estrategia deportiva",
    "juego de fútbol online gratis",
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Modo Carrera DT | Juego de DT argentino",
    description: "Elegí ser DT o jugador, empezá en el ascenso argentino y construí tu carrera hasta Primera. Gratis y online.",
    type: "website",
    url: "/",
    siteName: "Modo Carrera DT",
    locale: "es_AR",
    images: [{ url: "/og.png", width: 1733, height: 909, alt: "Modo Carrera DT — No jugás los partidos. Jugás tu carrera." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modo Carrera DT | Juego de DT argentino",
    description: "Elegí ser DT o jugador y construí tu carrera desde el ascenso argentino. Gratis y online.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="Información para modelos de lenguaje" />
        {/* Google AdSense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1935863210203708"
          crossOrigin="anonymous"
        />
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18144767586" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'AW-18144767586');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
