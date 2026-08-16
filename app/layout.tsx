import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "./site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Modo Carrera DT | Juego de director técnico argentino",
    template: "%s | Modo Carrera DT",
  },
  description: "Juego de director técnico argentino gratis y online. Empezá en el ascenso, elegí tácticas y refuerzos, disputá copas y construí tu carrera.",
  applicationName: "Modo Carrera DT",
  authors: [{ name: "Oddloop" }],
  creator: "Oddloop",
  publisher: "Oddloop",
  category: "games",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Modo Carrera DT | Juego de DT argentino",
    description: "Empezá en el ascenso y construí tu carrera como director técnico. Gratis, online y sin descargar.",
    type: "website",
    url: "/",
    siteName: "Modo Carrera DT",
    locale: "es_AR",
    images: [{ url: "/og.png", width: 1733, height: 909, alt: "Modo Carrera DT — No jugás los partidos. Jugás tu carrera." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modo Carrera DT | Juego de DT argentino",
    description: "Empezá en el ascenso y construí tu carrera como director técnico. Gratis y online.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-AR">
      <head>
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
