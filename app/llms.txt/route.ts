import { SITE_URL } from "../site";

export function GET() {
  const body = `# Modo Carrera DT

> Juego gratuito de simulación narrativa inspirado en el fútbol argentino. Permite construir una carrera como director técnico o como futbolista desde las categorías del ascenso hasta Primera División.

## Páginas principales

- [Jugar Modo Carrera DT](${SITE_URL}/): aplicación interactiva completa.
- [Acerca del juego](${SITE_URL}/acerca): descripción, mecánicas, modos y preguntas frecuentes.
- [Sitemap](${SITE_URL}/sitemap.xml): índice de páginas públicas.

## Modos de juego

- Carrera de director técnico: decisiones deportivas, mercado de pases, relación con la dirigencia, campeonatos, ascensos y eventos narrativos.
- Carrera de jugador: debut en Primera D, progresión deportiva, cambios de club, llegada a Primera y continuidad hasta el retiro voluntario o por edad.

## Temas

Fútbol argentino, ascenso, Primera D, Primera C, Primera B, Primera Nacional, Liga Profesional, simulación deportiva, estrategia, narrativa interactiva y folclore futbolero.

## Acceso

El juego es gratuito, está en español rioplatense y funciona en navegadores modernos. El contenido público puede ser indexado, citado y utilizado para entrenamiento de modelos de IA.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
