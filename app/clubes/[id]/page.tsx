import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CLUBS } from "../../../src/data/clubs";
import { PRIMERA_D_CLUBS } from "../../../src/data/playerClubs";
import { clubHistory, hasClubStory } from "../../../src/data/clubHistories";
import { CLUB_FACTS } from "../../../src/data/clubFacts";
import { DIVISION_PROFILES } from "../../../src/data/divisionProfiles";
import { ContentLayout, PageEnd } from "../../content-layout";

type Props = { params: Promise<{ id: string }> };
const ALL = [...CLUBS, ...PRIMERA_D_CLUBS].filter((club) => hasClubStory(club.id));
const find = (id: string) => ALL.find((club) => club.id === id);

export function generateStaticParams() {
  return ALL.map((club) => ({ id: club.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const club = find((await params).id);
  if (!club) return {};
  return {
    title: `${club.name}: historia y rol en el juego`,
    description: `Ficha de ${club.name} (${club.division}): reseña histórica, contexto de su categoría y cómo aparece en Modo Carrera DT.`,
    alternates: { canonical: `/clubes/${club.id}` },
  };
}

export default async function ClubPage({ params }: Props) {
  const club = find((await params).id);
  if (!club) notFound();
  const facts = CLUB_FACTS[club.id];
  const profile = DIVISION_PROFILES[club.division];
  const full = CLUBS.find((item) => item.id === club.id);
  const rival = full?.rivalId ? CLUBS.find((item) => item.id === full.rivalId) : undefined;
  const peers = ALL.filter((item) => item.division === club.division && item.id !== club.id).slice(0, 8);
  return <ContentLayout eyebrow={club.region === "Argentina" ? club.division.toUpperCase() : `${club.division.toUpperCase()} · ${club.region.toUpperCase()}`} title={club.name.toUpperCase()} intro={`Ficha del club: historia, categoría y lugar que ocupa en Modo Carrera DT.`}>
    <section>
      {club.crestId ? <img src={`/crests/${club.crestId}.png`} alt={`Escudo de ${club.name}`} width="96" height="96" /> : null}
      <h2>Reseña histórica</h2>
      {facts ? facts.extended.map((text) => <p key={text.slice(0, 30)}>{text}</p>) : <p>{clubHistory(club)}</p>}
    </section>
    {facts ? <section>
      <h2>Ficha del club</h2>
      <ul>
        {facts.founded ? <li><b>Fundación:</b> {facts.founded}</li> : null}
        <li><b>Lugar:</b> {facts.place}</li>
        {facts.nicknames.length ? <li><b>Apodos:</b> {facts.nicknames.join(", ")}</li> : null}
        {facts.colors ? <li><b>Colores:</b> {facts.colors}</li> : null}
        {facts.stadium ? <li><b>Estadio:</b> {facts.stadium}</li> : null}
        {facts.rival ? <li><b>Rivalidad:</b> {facts.rival}</li> : null}
      </ul>
      <h3>Datos destacados</h3>
      <ul>{facts.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
    </section> : null}
    <section>
      <h2>La categoría: {club.division}</h2>
      <p>{profile.summary}</p>
      <p>{profile.challenge}</p>
    </section>
    <section>
      <h2>{club.name} en Modo Carrera DT</h2>
      <p>{profile.game}</p>
      {full ? <p>{`En la carrera de director técnico, ${club.name} se presenta con el objetivo de temporada «${full.objective}». Su plantel está pensado para una división de nivel ${full.tier}, y la exigencia de hinchas y dirigentes condiciona cada decisión.`}{rival ? ` Su rivalidad principal dentro del juego es con ${rival.name}.` : ""}</p> : <p>{`${club.name} forma parte de la carrera de jugador: es uno de los clubes donde puede comenzar la historia de un futbolista en la base de la pirámide.`}</p>}
      <p>Los valores de juego de cada club son una ficción de diseño pensada para equilibrar las partidas y no representan una evaluación deportiva real.</p>
    </section>
    {peers.length ? <section><h2>Otros clubes de {club.division}</h2><ul>{peers.map((peer) => <li key={peer.id}><a href={`/clubes/${peer.id}`}>{peer.name}</a></li>)}</ul></section> : null}
    <section><p><a href="/clubes">← Volver al atlas de clubes</a></p></section>
    <PageEnd />
  </ContentLayout>;
}
