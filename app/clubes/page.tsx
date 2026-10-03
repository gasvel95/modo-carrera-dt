import type { Metadata } from "next";
import { CLUBS } from "../../src/data/clubs";
import { PRIMERA_D_CLUBS } from "../../src/data/playerClubs";
import { clubHistory, hasClubStory } from "../../src/data/clubHistories";
import { ContentLayout, PageEnd } from "../content-layout";

export const metadata: Metadata = { title: "Clubes del juego", description: "Conocé los clubes de Modo Carrera DT, su categoría, región y una breve reseña de su historia.", alternates: { canonical: "/clubes" } };
const divisions = ["Liga Profesional", "Primera Nacional", "Primera B", "Federal A", "Primera C", "Primera D"];

export default function ClubsPage() {
  const all = [...CLUBS, ...PRIMERA_D_CLUBS];
  return <ContentLayout eyebrow="ATLAS DE CLUBES" title="INSTITUCIONES CON HISTORIA" intro="Los clubes disponibles en las carreras, desde la Primera D hasta la Liga Profesional. Cada escudo representa una comunidad y un camino distinto.">
    <nav className="division-index" aria-label="Categorías">{divisions.map((division) => <a key={division} href={`#${division.replaceAll(" ", "-").toLowerCase()}`}>{division}</a>)}</nav>
    {divisions.map((division) => <section className="club-section" id={division.replaceAll(" ", "-").toLowerCase()} key={division}>
      <p className="section-label">{division}</p><h2>{all.filter((club) => club.division === division).length} CLUBES</h2>
      <div className="club-directory">{all.filter((club) => club.division === division).map((club) => <article key={club.id}>
        {club.crestId ? <img src={`/crests/${club.crestId}.png`} alt={`Escudo de ${club.name}`} width="72" height="72" /> : null}
        <div><h3>{hasClubStory(club.id) ? <a href={`/clubes/${club.id}`}>{club.name}</a> : club.name}</h3><small>{club.region === "Argentina" ? club.division : `${club.region} · ${club.division}`}</small><p>{clubHistory(club)}</p></div>
      </article>)}</div>
    </section>)}
    <PageEnd />
  </ContentLayout>;
}
