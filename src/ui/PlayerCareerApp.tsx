"use client";

import { useEffect, useMemo, useState } from "react";
import { createPlayerCareer, dismissPlayerEventOutcome, finishPlayerSeason, playPlayerBlock, playerRetirementAge, resolvePlayerEvent, retirePlayer, setTrainingFocus, startPlayerSeason } from "../game-engine/playerCareerEngine";
import { playerClubsForDivision } from "../data/playerClubs";
import { crestUrl } from "../data/divisions";
import type { PlayerCareerState, PlayerClub, PlayerPosition, PreferredFoot, TrainingFocus } from "../domain/playerCareer";
import styles from "./PlayerCareer.module.css";

const STORAGE_KEY = "convertite-en-dt:jugador:v1";
const positions: Array<{ id: PlayerPosition; label: string }> = [{ id: "ARQ", label: "Arquero" }, { id: "DEF", label: "Defensor" }, { id: "MED", label: "Mediocampista" }, { id: "DEL", label: "Delantero" }];
const focuses: TrainingFocus[] = ["Definición", "Físico", "Técnica"];
type PlayerScreen = "setup" | "offers" | "season" | "event" | "eventOutcome" | "summary" | "history" | "arrival" | "retire" | "retired";

type BadgeClub = Pick<PlayerClub, "id" | "name" | "shortName" | "division" | "crestId">;
function ClubBadge({ club, small = false }: { club: BadgeClub; small?: boolean }) {
  const [failed, setFailed] = useState(false);
  const catalogCrest = playerClubsForDivision(club.division).find((item) => item.id === club.id)?.crestId;
  const crestId = club.crestId ?? catalogCrest;
  return <span className={`${styles.clubBadge} ${small ? styles.clubBadgeSmall : ""}`}>
    {crestId && !failed ? <img src={crestUrl(crestId)} alt={`Escudo de ${club.name}`} onError={() => setFailed(true)} /> : <b aria-label={`Iniciales de ${club.name}`}>{club.shortName.slice(0, 3)}</b>}
  </span>;
}

function PlayerHeader({ state, onExit }: { state: PlayerCareerState | null; onExit: () => void }) {
  return <header className={styles.playerHeader}>
    <button type="button" className={styles.backButton} onClick={onExit}>← MODOS</button>
    <div className={styles.playerBrand}><i>10</i><span><small>DE PRIMERA D A PRIMERA</small><strong>MODO JUGADOR</strong></span></div>
    {state && <div className={styles.headerPlayer}><span>{state.player.position}</span><strong>{state.player.name}</strong><b>MED {state.player.overall}</b></div>}
  </header>;
}

export function PlayerCareerApp({ onExit }: { onExit: () => void }) {
  const [state, setState] = useState<PlayerCareerState | null>(null);
  const [screen, setScreen] = useState<PlayerScreen>("setup");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState<{ name: string; age: string; position: PlayerPosition; preferredFoot: PreferredFoot }>({ name: "", age: "18", position: "DEL", preferredFoot: "Derecha" });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as PlayerCareerState;
      if (parsed.version !== 1) throw new Error("unsupported save");
      // Restores a browser-only save after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(parsed);
      setScreen(parsed.retirement ? "retired" : parsed.pendingEvent ? "event" : parsed.lastEventOutcome ? "eventOutcome" : parsed.season ? "season" : "offers");
    } catch { localStorage.removeItem(STORAGE_KEY); }
  }, []);

  useEffect(() => { if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);
  const last = state?.history.at(-1);
  const retirementAt = state ? playerRetirementAge(state.player.position) : 0;
  const average = state?.season?.appearances ? state.season.ratingTotal / state.season.appearances : 0;
  const reachedNow = state?.season?.club.division === "Liga Profesional" && state.reachedFirstDivision && !state.history.some((item) => item.division === "Liga Profesional");
  const careerAverage = useMemo(() => state?.history.length ? state.history.reduce((sum, item) => sum + item.averageRating, 0) / state.history.length : 0, [state]);

  const begin = () => {
    if (!form.name.trim()) return;
    const next = createPlayerCareer({ name: form.name.trim(), age: Number(form.age), position: form.position, preferredFoot: form.preferredFoot });
    setState(next); setScreen("offers");
  };
  const sign = (clubId: string) => {
    if (!state) return;
    const isFirstArrival = state.offers.find((offer) => offer.club.id === clubId)?.club.division === "Liga Profesional" && !state.reachedFirstDivision;
    setState(startPlayerSeason(state, clubId)); setScreen(isFirstArrival ? "arrival" : "season");
  };
  const play = () => {
    if (!state?.season || state.pendingEvent || busy) return;
    setBusy(true);
    window.setTimeout(() => {
      const next = playPlayerBlock(state);
      setState(next); setScreen(next.pendingEvent ? "event" : "season"); setBusy(false);
    }, 500);
  };
  const decide = (optionId: string) => { if (!state?.pendingEvent) return; setState(resolvePlayerEvent(state, optionId)); setScreen("eventOutcome"); };
  const continueAfterEvent = () => { if (!state) return; setState(dismissPlayerEventOutcome(state)); setScreen("season"); };
  const closeSeason = () => { if (!state?.season?.completed) return; const next = finishPlayerSeason(state); setState(next); setScreen(next.retirement ? "retired" : "summary"); };
  const confirmRetirement = () => { if (!state) return; setState(retirePlayer(state)); setScreen("retired"); };
  const restart = () => { localStorage.removeItem(STORAGE_KEY); setState(null); setScreen("setup"); };

  return <main className={`game-shell ${styles.shell}`}>
    <div className="paper-noise" aria-hidden="true" />
    <PlayerHeader state={state} onExit={onExit} />
    {state && !state.retirement && <nav className={styles.playerNav} aria-label="Carrera de jugador">
      <button onClick={() => setScreen(state.pendingEvent ? "event" : state.lastEventOutcome ? "eventOutcome" : state.season ? "season" : "offers")}>CARRERA</button>
      <button onClick={() => setScreen("history")}>HISTORIAL <span>{state.history.length}</span></button>
      <button onClick={() => setScreen("retire")}>RETIRO</button>
    </nav>}

    {screen === "setup" && <section className={styles.setup}>
      <div className={styles.setupHero}><p>FÚTBOL ARGENTINO · CARRERA DE JUGADOR</p><h1>ARRANCÁS<br />EN LA D.<br /><em>EL TECHO LO PONÉS VOS.</em></h1><span>Ganate la titularidad, mejorá tu media y conseguí contratos cada vez más grandes. Llegar a Primera es apenas una parte de la historia.</span></div>
      <div className={styles.setupForm}><small>01 / CREÁ TU JUGADOR</small><label>Nombre y apellido<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Tomás Fernández" /></label><div className={styles.formRow}><label>Edad<input type="number" min="16" max="24" value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} /></label><label>Pie hábil<select value={form.preferredFoot} onChange={(event) => setForm({ ...form, preferredFoot: event.target.value as PreferredFoot })}><option>Derecha</option><option>Izquierda</option></select></label></div><fieldset><legend>Posición</legend><div className={styles.positionGrid}>{positions.map((position) => <button type="button" key={position.id} className={form.position === position.id ? styles.selected : ""} onClick={() => setForm({ ...form, position: position.id })}><b>{position.id}</b>{position.label}</button>)}</div></fieldset><button className={styles.primary} disabled={!form.name.trim()} onClick={begin}>BUSCAR CLUB EN PRIMERA D →</button><p>La carrera se guarda automáticamente y no reemplaza tu partida de DT.</p></div>
    </section>}

    {screen === "offers" && state && <section className={styles.content}>
      <div className={styles.pageTitle}><div><p>{state.history.length ? "MERCADO DE PASES" : "TU PRIMER CONTRATO"}</p><h2>{state.history.length ? <>EL PRÓXIMO<br />PASO.</> : <>PRIMERA D.<br />TRES PUERTAS.</>}</h2></div><div><span>MED</span><strong>{state.player.overall}</strong><small>REP. {state.player.reputation}</small></div></div>
      <p className={styles.lead}>{state.history.length ? "Tu rendimiento define qué categorías se animan a llamarte. También podés renovar y pelear otra temporada por tu lugar." : "Todos empiezan abajo. Elegí el club que te dará tu primera camiseta profesional."}</p>
      <div className={styles.offerGrid}>{state.offers.map((offer) => <article key={offer.club.id}><div className={styles.offerTop}><span>{offer.kind === "renewal" ? "RENOVACIÓN" : "OFERTA"}</span><b>{offer.club.division}</b></div><ClubBadge club={offer.club} /><h3>{offer.club.name}</h3><small>{offer.club.region}</small><p>{offer.reason}</p><dl><div><dt>PLANTEL</dt><dd>{offer.club.strength}</dd></div><div><dt>TU MEDIA</dt><dd>{state.player.overall}</dd></div></dl><button onClick={() => sign(offer.club.id)}>{offer.kind === "renewal" ? "RENOVAR" : "FIRMAR CONTRATO"} →</button></article>)}</div>
    </section>}

    {screen === "arrival" && state?.season && <section className={styles.arrival}>
      <p>HITO DE CARRERA · {state.season.year}</p><h1>LLEGASTE<br />A PRIMERA.</h1><ClubBadge club={state.season.club} /><h2>{state.season.club.name}</h2><span>El objetivo se cumplió, pero tu carrera no terminó. Ahora podés jugar en Primera, cambiar de club, sumar temporadas y decidir cuándo colgar los botines.</span><button className={styles.primary} onClick={() => setScreen("season")}>JUGAR EN PRIMERA →</button>
    </section>}

    {screen === "season" && state?.season && <section className={styles.content}>
      {reachedNow && <div className={styles.firstBanner}><span>✓ OBJETIVO CUMPLIDO</span><strong>YA SOS JUGADOR DE PRIMERA</strong><small>La carrera continúa hasta tu retiro.</small></div>}
      <div className={styles.seasonHead}><div><ClubBadge club={state.season.club} /><span><small>TEMPORADA {state.season.year} · {state.season.club.division}</small><strong>{state.season.club.name}</strong><b>{state.player.name} · {state.player.position} · {state.player.age} AÑOS</b></span></div><div><small>MEDIA</small><strong>{state.player.overall}</strong><b>POT. {state.player.potential}</b></div></div>
      <div className={styles.seasonGrid}><article className={styles.timeline}><div className={styles.progressHead}><span>FECHA {state.season.round}</span><b>{state.season.totalRounds}</b></div><div className={styles.progress}><i style={{ width: `${state.season.round / state.season.totalRounds * 100}%` }} /></div><div className={styles.bigStats}><div><span>PJ</span><strong>{state.season.appearances}</strong></div><div><span>TIT</span><strong>{state.season.starts}</strong></div><div><span>GOL</span><strong>{state.season.goals}</strong></div><div><span>ASI</span><strong>{state.season.assists}</strong></div><div><span>PROM</span><strong>{average ? average.toFixed(1) : "—"}</strong></div></div><div className={styles.focus}><span>ENFOQUE DE ENTRENAMIENTO</span><div>{focuses.map((focus) => <button key={focus} className={state.season!.focus === focus ? styles.selected : ""} onClick={() => setState(setTrainingFocus(state, focus))}>{focus}</button>)}</div></div>{state.season.completed ? <button className={styles.primary} onClick={closeSeason}>CERRAR TEMPORADA →</button> : <button className={styles.primary} onClick={play} disabled={busy}>{busy ? "JUGANDO FECHAS…" : "JUGAR PRÓXIMAS 4 FECHAS →"}</button>}</article><aside className={styles.pulse}><h3>ESTADO DEL JUGADOR</h3><div><span>CONFIANZA DEL DT</span><strong>{Math.round(state.season.coachTrust)}%</strong><i><b style={{ width: `${state.season.coachTrust}%` }} /></i></div><div><span>ESTADO FÍSICO</span><strong>{Math.round(state.season.fitness)}%</strong><i><b style={{ width: `${state.season.fitness}%` }} /></i></div><dl><div><dt>MINUTOS</dt><dd>{state.season.minutes}</dd></div><div><dt>PIE</dt><dd>{state.player.preferredFoot}</dd></div><div><dt>RETIRO EST.</dt><dd>{retirementAt} años</dd></div></dl></aside></div>
      {state.season.recentMatches.length > 0 && <section className={styles.matchList}><h3>ÚLTIMO BLOQUE</h3>{state.season.recentMatches.map((match) => <div key={match.round}><span className={`${styles.result} ${styles[`result${match.result}`]}`}>{match.result}</span>{match.opponentCrestId && <ClubBadge small club={{ id: `opponent-${match.opponent}`, name: match.opponent, shortName: match.opponent.slice(0, 3), division: state.season!.club.division, crestId: match.opponentCrestId }} />}<b>F{match.round} · vs. {match.opponent}</b><span>{match.minutes ? `${match.minutes}'` : "NO INGRESÓ"}</span><strong>{match.rating?.toFixed(1) ?? "—"}</strong><small>{match.goals ? `${match.goals} GOL${match.goals > 1 ? "ES" : ""}` : match.assists ? `${match.assists} ASIST.` : ""}</small></div>)}</section>}
    </section>}

    {screen === "event" && state?.pendingEvent && <section className={styles.eventView}>
      <div className={styles.eventStripe}><span>FOLCLORE ARGENTINO</span><b>DECISIÓN DE CARRERA</b></div><article><p>{state.pendingEvent.kicker}</p><h1>{state.pendingEvent.title}</h1><div className={styles.eventDescription}>{state.pendingEvent.description}</div><h2>¿QUÉ HACÉS?</h2><div className={styles.eventOptions}>{state.pendingEvent.options.map((option, index) => <button key={option.id} onClick={() => decide(option.id)}><span>0{index + 1}</span><strong>{option.text}</strong><small>RIESGO {option.successChance >= .7 ? "BAJO" : option.successChance >= .55 ? "MEDIO" : "ALTO"}</small><i>→</i></button>)}</div><small>Tu decisión modifica las chances. El resultado nunca está garantizado.</small></article>
    </section>}

    {screen === "eventOutcome" && state?.lastEventOutcome && <section className={`${styles.eventOutcome} ${styles[state.lastEventOutcome.tone]}`}><div>{state.lastEventOutcome.tone === "positive" ? "↑" : state.lastEventOutcome.tone === "negative" ? "↓" : "→"}</div><p>REPERCUSIÓN</p><h1>{state.lastEventOutcome.title}</h1><span>{state.lastEventOutcome.description}</span><section>{Object.entries(state.lastEventOutcome.effects).filter(([, value]) => value).map(([key, value]) => <div key={key}><small>{({ coachTrust: "CONFIANZA DT", fitness: "FÍSICO", reputation: "REPUTACIÓN", overall: "MEDIA", formBoost: "RENDIMIENTO" } as Record<string, string>)[key] ?? key.toUpperCase()}</small><strong>{Number(value) > 0 ? "+" : ""}{key === "formBoost" ? `${Math.round(Number(value) * 100)}%` : value}</strong></div>)}</section><button className={styles.primary} onClick={continueAfterEvent}>VOLVER A LA TEMPORADA →</button></section>}

    {screen === "summary" && state && last && <section className={`${styles.content} ${styles.summary}`}><p>INFORME FINAL · {last.year}</p><h1>{last.outcome}</h1><h2>{last.club} · {last.division}</h2><div className={styles.summaryStats}><div><span>PJ</span><strong>{last.appearances}</strong></div><div><span>GOL</span><strong>{last.goals}</strong></div><div><span>ASI</span><strong>{last.assists}</strong></div><div><span>PROM</span><strong>{last.averageRating.toFixed(1)}</strong></div></div><div className={styles.growth}><span>EVOLUCIÓN DE MEDIA</span><strong>{last.overallBefore} → {last.overallAfter}</strong></div><button className={styles.primary} onClick={() => setScreen("offers")}>ESCUCHAR OFERTAS →</button></section>}

    {screen === "history" && state && <section className={styles.content}><div className={styles.pageTitle}><div><p>ARCHIVO DEL JUGADOR</p><h2>TODA TU<br />CARRERA.</h2></div><div><span>TEMP.</span><strong>{state.history.length}</strong><small>PROM. {careerAverage ? careerAverage.toFixed(1) : "—"}</small></div></div>{state.history.length ? <div className={styles.history}>{[...state.history].reverse().map((item) => <article key={`${item.year}-${item.club}`}><time>{item.year}</time><ClubBadge small club={{ id: `history-${item.club}`, name: item.club, shortName: item.clubShortName ?? item.club.slice(0, 3), division: item.division, crestId: item.crestId }} /><div><strong>{item.club}</strong><span>{item.division} · {item.age} años</span></div><div><b>{item.appearances} PJ · {item.goals} G · {item.assists} A</b><span>PROM. {item.averageRating.toFixed(1)} · MED {item.overallAfter}</span></div></article>)}</div> : <p className={styles.empty}>Tu historia empieza con el primer contrato.</p>}<div className={styles.careerTotals}><div><span>PARTIDOS</span><strong>{state.totals.appearances}</strong></div><div><span>GOLES</span><strong>{state.totals.goals}</strong></div><div><span>ASISTENCIAS</span><strong>{state.totals.assists}</strong></div><div><span>PRIMERA</span><strong>{state.reachedFirstDivision ? "SÍ" : "NO"}</strong></div></div></section>}

    {screen === "retire" && state && <section className={styles.retire}><p>DECISIÓN VOLUNTARIA</p><h1>¿COLGAR LOS<br />BOTINES?</h1><span>Podés retirarte ahora o seguir jugando. Si continuás, el retiro automático llegará a los {retirementAt} años para tu posición.</span><div><b>{state.player.age}<small>EDAD</small></b><b>{state.history.length}<small>TEMPORADAS</small></b><b>{state.totals.appearances}<small>PARTIDOS</small></b></div><button className={styles.danger} onClick={confirmRetirement}>CONFIRMAR RETIRO</button><button className={styles.link} onClick={() => setScreen(state.season ? "season" : "offers")}>Todavía no. Seguir jugando.</button></section>}

    {screen === "retired" && state?.retirement && <section className={styles.retired}><p>FINAL DE CARRERA · {state.retirement.year}</p><h1>{state.retirement.title}</h1><span>{state.retirement.reason === "age" ? `A los ${state.retirement.age} años llegó el retiro automático. El tiempo cerró una carrera que empezó en Primera D.` : `A los ${state.retirement.age} años decidiste cerrar tu carrera en tus propios términos.`}</span><div className={styles.careerTotals}><div><small>PARTIDOS</small><strong>{state.totals.appearances}</strong></div><div><small>GOLES</small><strong>{state.totals.goals}</strong></div><div><small>ASISTENCIAS</small><strong>{state.totals.assists}</strong></div><div><small>LLEGÓ A PRIMERA</small><strong>{state.reachedFirstDivision ? "SÍ" : "NO"}</strong></div></div><blockquote>“{state.player.name}: de una cancha de Primera D al último aplauso.”</blockquote><button className={styles.primary} onClick={restart}>EMPEZAR OTRA CARRERA →</button></section>}
  </main>;
}

