import type { Metadata } from "next";
import { ContentLayout } from "../content-layout";
export const metadata: Metadata = { title: "Contacto", description: "Canales de contacto para comentarios, errores, privacidad y propuestas sobre Modo Carrera DT.", alternates: { canonical: "/contacto" } };
export default function ContactPage() { return <ContentLayout eyebrow="HABLEMOS DEL JUEGO" title="CONTACTO" intro="Errores, sugerencias y relatos de carrera ayudan a mejorar el simulador.">
  <section><h2>¿Qué podés enviar?</h2><p>Podés avisar sobre un error, proponer un evento del fútbol argentino, señalar información histórica que deba corregirse o contar qué parte de la carrera te gustaría ampliar. Incluí el dispositivo, navegador y pantalla en la que ocurrió el problema cuando sea relevante.</p></section>
  <section><h2>Canales</h2><p>El proyecto es desarrollado por Oddloop. Podés enviar un mensaje desde el perfil de <a href="https://cafecito.app/oddloop" rel="external">Oddloop en Cafecito</a>, donde también es posible apoyar el desarrollo.</p><p>También podés escribir a <a href="mailto:oddloop2542@gmail.com">oddloop2542@gmail.com</a>.</p><p>Las consultas se revisan de manera periódica. No envíes contraseñas, documentos ni información sensible.</p></section>
  <section><h2>Sobre el proyecto</h2><p>Modo Carrera DT es un proyecto independiente de Oddloop, con edición y contenidos a cargo de Gastón Veliez.</p></section>
  <section><h2>Correcciones de clubes</h2><p>Las fichas históricas son reseñas breves pensadas para orientar al jugador. Si representás a una institución o detectás un dato que merece precisión, indicá el club, la corrección propuesta y una fuente pública verificable.</p></section>
 </ContentLayout>; }
