import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Modo Carrera DT — Tu historia empieza abajo",
  description: "Un simulador narrativo rápido de la carrera de un director técnico argentino.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Modo Carrera DT",
    description: "No jugás los partidos. Jugás tu carrera.",
    type: "website",
    images: [{ url: "/og.png", width: 1733, height: 909, alt: "Modo Carrera DT — No jugás los partidos. Jugás tu carrera." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modo Carrera DT",
    description: "No jugás los partidos. Jugás tu carrera.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
