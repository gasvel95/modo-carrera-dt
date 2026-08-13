"use client";

import { useEffect, useMemo, useState } from "react";
import { generateOffers, advanceUntilNextMeaningfulMoment, canMoveToEurope, confirmSeasonTactics, createCareer, endCareer, finishSeason, resolveEvent, startSeason } from "../game-engine/careerEngine";
import { getClub } from "../data/clubs";
import { crestUrl } from "../data/divisions";
import type { CareerState, EventOutcome, Formation, GameEvent, Philosophy, TacticalApproach } from "../domain/game";

const STORAGE_KEY = "convertite-en-dt:carrera:v7";
const philosophies: Philosophy[] = ["Ofensivo", "Defensivo", "Equilibrado", "Motivador", "Formador", "Pragmático"];
const approaches: TacticalApproach[] = ["Ofensivo", "Equilibrado", "Defensivo"];
const formations: Formation[] = ["4-3-3", "4-2-3-1", "4-4-2", "3-5-2", "5-3-2"];
type Screen = "intro" | "offers" | "report" | "season" | "event" | "outcome" | "summary" | "history" | "retire" | "ending";

function Meter({ label, value }: { label: string; value: number }) {
  return <div className="meter"><div className="meter-head"><span>{label}</span><strong>{Math.round(value)}%</strong></div><div className="meter-track"><span style={{ width: `${value}%` }} /></div></div>;
}

function careerStats(state: CareerState | null) {
  const completed = state?.history.reduce((totals, record) => ({ played: totals.played + record.played + record.cups.reduce((n, cup) => n + cup.played, 0), won: totals.won + record.won + record.cups.reduce((n, cup) => n + cup.won, 0), drawn: totals.drawn + record.drawn + record.cups.reduce((n, cup) => n + cup.drawn, 0), lost: totals.lost + record.lost + record.cups.reduce((n, cup) => n + cup.lost, 0) }), { played: 0, won: 0, drawn: 0, lost: 0 }) ?? { played: 0, won: 0, drawn: 0, lost: 0 };
  const current = state?.season; const cups = current?.cups ?? [];
  const played = completed.played + (current?.played ?? 0) + cups.reduce((n, cup) => n + cup.played, 0); const won = completed.won + (current?.won ?? 0) + cups.reduce((n, cup) => n + cup.won, 0); const drawn = completed.drawn + (current?.drawn ?? 0) + cups.reduce((n, cup) => n + cup.drawn, 0); const lost = completed.lost + (current?.lost ?? 0) + cups.reduce((n, cup) => n + cup.lost, 0);
  return { played, won, drawn, lost, effectiveness: played ? Math.round(((won * 3 + drawn) / (played * 3)) * 100) : 0 };
}

const trophyImage = (name: string) => name.includes("Libertadores") ? "/trophies/libertadores.png" : name.includes("Argentina") ? "/trophies/copa-argentina.png" : "/trophies/liga-profesional.png";

function Brand({ state }: { state: CareerState | null }) {
  const stats = careerStats(state);
  return <header className="brand"><div className="brand-mark">DT</div><div className="brand-copy"><span>UNA CARRERA. MIL HISTORIAS.</span><strong>MODO CARRERA DT</strong></div>{state && <div className="career-summary" aria-label="Estadísticas totales de carrera"><div><span>PJ</span><strong>{stats.played}</strong></div><div><span>G</span><strong>{stats.won}</strong></div><div><span>E</span><strong>{stats.drawn}</strong></div><div><span>P</span><strong>{stats.lost}</strong></div><div><span>EFECT.</span><strong>{stats.effectiveness}%</strong></div><div className="header-trophies"><img src="/trophies/liga-profesional.png" alt="Trofeos ganados" /><span>TROFEOS</span><strong>{state.trophies}</strong></div></div>}</header>;
}

function FormDot({ result }: { result: "W" | "D" | "L" }) {
  return <span className={`form-dot ${result}`} title={result === "W" ? "Victoria" : result === "D" ? "Empate" : "Derrota"}>{result === "W" ? "G" : result === "D" ? "E" : "P"}</span>;
}

function Crest({ crestId, name, small = false }: { crestId: number; name: string; small?: boolean }) {
  return <img className={small ? "club-crest small" : "club-crest"} src={crestUrl(crestId)} alt={`Escudo de ${name}`} loading="lazy" />;
}

export function GameApp() {
  const [state, setState] = useState<CareerState | null>(null);
  const [screen, setScreen] = useState<Screen>("intro");
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [outcome, setOutcome] = useState<EventOutcome | null>(null);
  const [busy, setBusy] = useState(false);
  const [approach, setApproach] = useState<TacticalApproach | null>(null);
  const [formation, setFormation] = useState<Formation | null>(null);
  const [form, setForm] = useState({ name: "", age: "38", nationality: "Argentina", supportedClub: "", philosophy: "Equilibrado" as Philosophy });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as CareerState;
      if (parsed.version !== 7) { localStorage.removeItem(STORAGE_KEY); return; }
      // Restores an external browser snapshot after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(parsed);
      setScreen(parsed.ending ? "ending" : parsed.season ? parsed.season.tacticsConfirmed ? "season" : "report" : "offers");
    } catch { localStorage.removeItem(STORAGE_KEY); }
  }, []);

  useEffect(() => { if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);
  const club = state?.season ? { ...getClub(state.season.clubId), division: state.season.division } : state?.clubId ? getClub(state.clubId) : null;
  const offers = useMemo(() => state ? generateOffers(state) : [], [state]);

  const begin = () => {
    if (!form.name.trim()) return;
    const career = createCareer({ name: form.name.trim(), age: Number(form.age), nationality: form.nationality, supportedClub: form.supportedClub || "No declarado", philosophy: form.philosophy });
    setState(career); setScreen("offers");
  };

  const chooseClub = (clubId: string) => { if (!state) return; setState(startSeason(state, clubId)); setApproach(null); setFormation(null); setScreen("report"); };
  const confirmTactics = () => { if (!state?.season || !approach || !formation) return; setState(confirmSeasonTactics(state, approach, formation)); setScreen("season"); };
  const advance = () => {
    if (!state?.season || busy) return;
    setBusy(true);
    window.setTimeout(() => {
      const moment = advanceUntilNextMeaningfulMoment(state);
      setState(moment.state);
      if (moment.type === "event") { setActiveEvent(moment.event); setScreen("event"); }
      else if (moment.type === "delayed_outcome") { setOutcome(moment.outcome); setScreen("outcome"); }
      else { const ended = finishSeason(moment.state); setState(ended); setScreen("summary"); }
      setBusy(false);
    }, 650);
  };

  const decide = (optionId: string) => {
    if (!state || !activeEvent) return;
    const option = activeEvent.options.find((item) => item.id === optionId)!;
    const result = resolveEvent(state, activeEvent, option);
    setState(result.state); setOutcome(result.outcome); setScreen("outcome");
  };

  const completeCareer = (reason: "retirement" | "europe") => { if (!state) return; setState(endCareer(state, reason)); setScreen("ending"); };

  const restart = () => { localStorage.removeItem(STORAGE_KEY); setState(null); setActiveEvent(null); setOutcome(null); setScreen("intro"); };
  const last = state?.history.at(-1);

  return (
    <main className="game-shell">
      <div className="paper-noise" aria-hidden="true" />
      <Brand state={state} />
      {state && !state.ending && <nav className="career-nav" aria-label="Carrera"><button onClick={() => setScreen(state.season ? state.season.tacticsConfirmed ? "season" : "report" : "offers")}>PARTIDA</button><button onClick={() => setScreen("history")}>HISTORIAL <span>{state.history.length}</span></button><button onClick={() => setScreen("retire")}>RETIRO</button></nav>}

      {screen === "intro" && <section className="intro-grid">
        <div className="hero-copy">
          <p className="eyebrow">FÚTBOL ARGENTINO · SIMULADOR NARRATIVO</p>
          <h1>NO JUGÁS<br />LOS PARTIDOS.<br /><em>JUGÁS TU CARRERA.</em></h1>
          <p className="dek">Empezá sin nombre. Tomá decisiones cuando todo quema. Ascendé, sobreviví y escribí una historia que nadie más pueda repetir.</p>
          <div className="hero-stat"><strong>20</strong><span>temporadas<br />en minutos</span></div>
        </div>
        <div className="setup-card">
          <div className="section-number">01 / CREÁ TU DT</div>
          <label>Nombre y apellido<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Martín Gómez" /></label>
          <div className="form-row"><label>Edad<input type="number" min="25" max="75" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} /></label><label>Nacionalidad<input value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} /></label></div>
          <label>Club del que sos hincha<input value={form.supportedClub} onChange={(e) => setForm({ ...form, supportedClub: e.target.value })} placeholder="Opcional" /></label>
          <fieldset><legend>Tu filosofía</legend><div className="philosophy-grid">{philosophies.map((item) => <button type="button" key={item} className={form.philosophy === item ? "selected" : ""} onClick={() => setForm({ ...form, philosophy: item })}>{item}</button>)}</div></fieldset>
          <button className="primary" onClick={begin} disabled={!form.name.trim()}>BUSCAR TRABAJO <span>→</span></button>
          <p className="microcopy">Tu carrera se guarda automáticamente en este dispositivo.</p>
        </div>
      </section>}

      {screen === "intro" && <section className="seo-overview" aria-labelledby="seo-title">
        <p className="eyebrow">JUGÁ GRATIS · SIN DESCARGAS</p>
        <h2 id="seo-title">UN JUEGO DE DIRECTOR TÉCNICO ARGENTINO.</h2>
        <p className="seo-lead">Modo Carrera DT es un simulador narrativo de fútbol para jugar online desde el celular o la computadora. Creá tu entrenador, empezá en el ascenso argentino y tomá las decisiones que pueden llevarte hasta Primera y la Copa Libertadores.</p>
        <div className="seo-features">
          <article><span>01</span><h3>Empezá desde abajo</h3><p>Elegí un club, analizá el plantel y buscá ascensos temporada tras temporada.</p></article>
          <article><span>02</span><h3>Decidí como un DT</h3><p>Definí formación, enfoque de juego, refuerzos y respuestas ante un vestuario impredecible.</p></article>
          <article><span>03</span><h3>Construí una historia</h3><p>Jugá clásicos y copas, ganá idolatría y descubrí hasta dónde llega tu carrera.</p></article>
        </div>
        <div className="seo-faq">
          <h3>Preguntas frecuentes</h3>
          <details><summary>¿Modo Carrera DT es gratis?</summary><p>Sí. Podés jugar una carrera completa gratis y sin crear una cuenta.</p></details>
          <details><summary>¿Tengo que descargar el juego?</summary><p>No. Funciona directamente en un navegador moderno, tanto en dispositivos móviles como en computadora.</p></details>
          <details><summary>¿Qué competiciones incluye?</summary><p>La carrera recorre categorías del ascenso y puede llegar a Primera División, Copa Argentina y Copa Libertadores.</p></details>
        </div>
      </section>}

      {screen === "offers" && state && <section className="content-view">
        <div className="page-heading"><div><p className="eyebrow">EL TELÉFONO SONÓ</p><h2>{state.history.length ? <>TU PRÓXIMA<br />DECISIÓN.</> : <>TRES CLUBES.<br />UNA OPORTUNIDAD.</>}</h2></div><div className="manager-stamp"><span>DT</span><strong>{state.manager.name}</strong><small>REP. {state.manager.reputation}</small></div></div>
        <p className="lead">{state.history.length ? "El mercado leyó tu última campaña. El rendimiento abre puertas, pero el azar también mueve dirigentes." : "Nadie te conoce todavía. Estas instituciones están dispuestas a darte las llaves del vestuario."}</p>
        {state.manager.age >= 60 && <button className="retirement-suggestion" onClick={() => setScreen("retire")}><span>EL CUERPO TÉCNICO TE LO PLANTEA</span><strong>Tenés {state.manager.age} años. Podés considerar el retiro.</strong><i>REVISAR DECISIÓN →</i></button>}
        <div className="offer-grid">{offers.map(({ club: item, kind, reason }, index) => <article className={`offer-card ${kind}`} key={item.id}>
          <div className="offer-top"><span>{kind === "renewal" ? "RENOVACIÓN" : `OFERTA 0${index + 1}`}</span><strong>{item.division}</strong></div>
          <div className="crest-wrap"><Crest crestId={item.crestId} name={item.name} /></div><h3>{item.name}</h3><p>{item.region}</p>
          <p className="offer-reason">{reason}</p>
          <dl><div><dt>OBJETIVO</dt><dd>{item.objective}</dd></div><div><dt>PLANTEL</dt><dd>{"●".repeat(Math.round(item.squadStrength / 20))}{"○".repeat(5 - Math.round(item.squadStrength / 20))}</dd></div><div><dt>PRESIÓN</dt><dd>{item.fanPressure > 65 ? "ALTA" : item.fanPressure > 45 ? "MEDIA" : "BAJA"}</dd></div></dl>
          <button className="choice" onClick={() => chooseClub(item.id)}>{kind === "renewal" ? "RENOVAR CONTRATO" : "FIRMAR CONTRATO"} <span>→</span></button>
        </article>)}</div>
      </section>}

      {screen === "report" && state?.season && club && <section className="report-view">
        <div className="report-heading"><div><p className="eyebrow">PRETEMPORADA · {state.season.year}</p><h2>INFORME DEL<br />PLANTEL.</h2></div><div className="report-club"><Crest crestId={club.crestId} name={club.name} /><strong>{club.name}</strong><span>{state.season.division}</span></div></div>
        <div className="report-grid">
          <article className="squad-analysis"><div className="section-number">DIAGNÓSTICO DEL CUERPO TÉCNICO</div>
            <div className="line-rating"><span>ATAQUE</span><div><i style={{ width: `${state.season.squadReport.attack}%` }} /></div><strong>{state.season.squadReport.attack}</strong></div>
            <div className="line-rating"><span>MEDIOCAMPO</span><div><i style={{ width: `${state.season.squadReport.midfield}%` }} /></div><strong>{state.season.squadReport.midfield}</strong></div>
            <div className="line-rating"><span>DEFENSA</span><div><i style={{ width: `${state.season.squadReport.defense}%` }} /></div><strong>{state.season.squadReport.defense}</strong></div>
            <div className="report-notes"><div><span>PUNTOS FUERTES</span>{state.season.squadReport.strengths.map((item) => <p key={item}>+ {item}</p>)}</div><div><span>PUNTOS BAJOS</span>{state.season.squadReport.weaknesses.map((item) => <p key={item}>− {item}</p>)}</div></div>
          </article>
          <article className="tactics-card"><div className="section-number">TU PLAN PARA LA TEMPORADA</div><label>ENFOQUE DE JUEGO</label><div className="tactic-options">{approaches.map((item) => <button key={item} className={approach === item ? "selected" : ""} onClick={() => setApproach(item)}>{item}</button>)}</div><label>FORMACIÓN BASE</label><div className="formation-options">{formations.map((item) => <button key={item} className={formation === item ? "selected" : ""} onClick={() => setFormation(item)}>{item}</button>)}</div><p className="tactics-note">La identidad elegida se mantendrá durante esta campaña y afectará el rendimiento del equipo.</p><button className="primary" disabled={!approach || !formation} onClick={confirmTactics}>CONFIRMAR PLAN <span>→</span></button></article>
        </div>
      </section>}

      {screen === "season" && state?.season && club && <section className="season-view">
        {state.manager.age >= 60 && <button className="retirement-suggestion" onClick={() => setScreen("retire")}><span>DECISIÓN PERSONAL DISPONIBLE</span><strong>A los {state.manager.age}, el retiro ya es una posibilidad natural.</strong><i>PENSAR EL RETIRO →</i></button>}
        <div className="scoreboard">
          <div className="scoreboard-club"><Crest crestId={club.crestId} name={club.name} /><div><p className="eyebrow">TEMPORADA {state.season.year}</p><h2>{club.name}</h2><p>{club.division} · Objetivo: {club.objective}</p></div></div>
          <div className="position"><span>POSICIÓN</span><strong>{state.season.position}°</strong><small>de {state.season.teams}</small></div>
        </div>
        <div className="season-body">
          <div className="timeline-card">
            <div className="week-line"><span>INICIO</span><strong>FECHA {state.season.week}</strong><span>FINAL</span></div>
            <div className="progress"><span style={{ width: `${(state.season.week / state.season.totalWeeks) * 100}%` }} /></div>
            <div className="form-strip"><span>ÚLTIMOS 5</span><div>{state.season.form.length ? state.season.form.map((r, i) => <FormDot result={r} key={i} />) : <small>La pelota todavía no rodó.</small>}</div></div>
            <div className="numbers"><div><span>PJ</span><strong>{state.season.played}</strong></div><div><span>PTS</span><strong>{state.season.points}</strong></div><div><span>GF</span><strong>{state.season.goalsFor}</strong></div><div><span>GC</span><strong>{state.season.goalsAgainst}</strong></div></div>
            <button className="primary simulate" onClick={advance} disabled={busy}>{busy ? <><i className="pulse" /> SIMULANDO TEMPORADA…</> : <>AVANZAR HASTA QUE IMPORTE <span>→</span></>}</button>
            <p className="microcopy center">El motor salta automáticamente los partidos sin decisiones clave.</p>
          </div>
          <aside className="pulse-card"><div className="section-number">PULSO DEL CLUB</div><Meter label="HINCHAS" value={state.season.fanApproval} /><Meter label="VESTUARIO" value={state.season.morale} /><Meter label="DIRIGENCIA" value={state.season.boardTrust} /><Meter label="IDOLATRÍA" value={state.season.idolatry} /><Meter label="PRESIÓN" value={state.season.pressure} /><div className="scorers-mini"><div className="section-number">GOLEADORES</div>{[...state.season.scorers].sort((a,b) => b.goals-a.goals).slice(0,4).map((player, index) => <div key={player.name}><span>{index + 1}. {player.name}<small>{player.position}</small></span><strong>{player.goals}</strong></div>)}</div></aside>
        </div>
        <section className="cups-card"><div className="standings-title"><div><span>CAMPAÑA EN COPAS</span><strong>OTROS FRENTES</strong></div><small>{state.season.cups.length} {state.season.cups.length === 1 ? "COMPETENCIA" : "COMPETENCIAS"}</small></div><div className="cup-grid">{state.season.cups.map((cup) => <article key={cup.name} className={cup.status}><div><span>{cup.name}</span><strong>{cup.stage}</strong></div><em>{cup.status === "active" ? "EN COMPETENCIA" : cup.status === "champion" ? "TÍTULO" : "ELIMINADO"}</em><dl><div><dt>PJ</dt><dd>{cup.played}</dd></div><div><dt>G-E-P</dt><dd>{cup.won}-{cup.drawn}-{cup.lost}</dd></div><div><dt>GF-GC</dt><dd>{cup.goalsFor}-{cup.goalsAgainst}</dd></div></dl></article>)}</div></section>
        <section className="standings-card"><div className="standings-title"><div><span>TABLA COMPLETA</span><strong>{club.division}</strong></div><small>ACTUALIZADA EN FECHA {state.season.week}</small></div><div className="standings-scroll"><table><thead><tr><th>POS</th><th>EQUIPO</th><th>PJ</th><th>G</th><th>E</th><th>P</th><th>DG</th><th>PTS</th></tr></thead><tbody>{state.season.standings.map((row, index) => <tr key={row.id} className={row.id === club.id ? "is-user" : ""}><td>{index + 1}</td><td><Crest crestId={row.crestId} name={row.name} small /><strong>{row.name}</strong></td><td>{row.played}</td><td>{row.won}</td><td>{row.drawn}</td><td>{row.lost}</td><td>{row.goalsFor - row.goalsAgainst > 0 ? "+" : ""}{row.goalsFor - row.goalsAgainst}</td><td><strong>{row.points}</strong></td></tr>)}</tbody></table></div></section>
      </section>}

      {screen === "event" && activeEvent && state?.season && <section className="event-view">
        <div className="event-stripe"><span>{activeEvent.level.replace("_", " ")}</span><span>FECHA {state.season.week}</span></div>
        <div className="event-card"><p className="eyebrow">{activeEvent.kicker}</p><h2>{activeEvent.title}</h2><p className="event-description">{activeEvent.description}</p><div className="question">¿QUÉ HACÉS?</div><div className="option-list">{activeEvent.options.map((option, index) => <button onClick={() => decide(option.id)} key={option.id}><span>0{index + 1}</span><strong>{option.text}</strong><i>→</i></button>)}</div><p className="probability-note">Tu decisión modifica probabilidades. Nunca garantiza el resultado.</p></div>
      </section>}

      {screen === "outcome" && outcome && state?.season && <section className={`outcome-view ${outcome.tone}`}>
        <div className="outcome-symbol">{outcome.tone === "positive" ? "↑" : outcome.tone === "negative" ? "↓" : "→"}</div><p className="eyebrow">CONSECUENCIA</p><h2>{outcome.title}</h2><p>{outcome.description}</p>
        <div className="impact-grid">{Object.entries(outcome.effects).filter(([, value]) => value).slice(0, 3).map(([key, value]) => <div key={key}><span>{({ morale: "MORAL", harmony: "ARMONÍA", pressure: "PRESIÓN", respect: "RESPETO", boardTrust: "DIRIGENCIA", performance: "RENDIMIENTO", strength: "PLANTEL" } as Record<string, string>)[key] ?? key.toUpperCase()}</span><strong>{Number(value) > 0 ? "+" : ""}{key === "performance" ? `${Math.round(Number(value) * 100)}%` : value}</strong></div>)}</div>
        <button className="primary light" onClick={() => { setOutcome(null); setScreen("season"); }}>CONTINUAR TEMPORADA <span>→</span></button>
      </section>}

      {screen === "summary" && state && last && <section className="summary-view">
        {(last.position === 1 || last.cups.some((cup) => cup.status === "champion")) && <section className="champion-celebration"><div className="confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ left: `${(index * 37) % 100}%`, animationDelay: `${(index % 6) * .12}s` }} />)}</div><p>VUELTA OLÍMPICA</p><h2>¡CAMPEÓN!</h2><div className="won-trophies">{last.position === 1 && <div><img src={trophyImage(last.division)} alt={`Trofeo de ${last.division}`} /><strong>{last.division}</strong></div>}{last.cups.filter((cup) => cup.status === "champion").map((cup) => <div key={cup.name}><img src={trophyImage(cup.name)} alt={`Trofeo de ${cup.name}`} /><strong>{cup.name}</strong></div>)}</div></section>}
        <div className="summary-kicker">TEMPORADA {last.year} · INFORME FINAL</div><div className="summary-result"><div><p>{last.club}</p><h2>{last.outcome}</h2><span>{last.division}{last.promotedTo ? ` → ${last.promotedTo}` : ""}</span></div><strong>{last.position}°</strong></div>
        <div className="record-line"><div><span>PJ</span><strong>{last.played}</strong></div><div><span>PG</span><strong>{last.won}</strong></div><div><span>PE</span><strong>{last.drawn}</strong></div><div><span>PP</span><strong>{last.lost}</strong></div></div>
        <div className={`objective-badge ${last.objectiveMet ? "met" : "missed"}`}><span>OBJETIVO DE LA DIRIGENCIA</span><strong>{last.objectiveMet ? "CUMPLIDO" : "INCUMPLIDO"}</strong></div>
        <div className={`board-verdict ${last.contractTerminated ? "terminated" : "retained"}`}><span>DECISIÓN DE LA JUNTA · RIESGO DE RESCISIÓN {Math.round(last.terminationRisk * 100)}%</span><strong>{last.contractTerminated ? "CONTRATO RESCINDIDO" : "CONTINUIDAD RATIFICADA"}</strong><p>{last.boardDecision}</p></div>
        <section className="summary-cups"><div className="section-number">CAMPAÑA EN COPAS</div>{last.cups.map((cup) => <div key={cup.name}><span><strong>{cup.name}</strong><small>{cup.played} PJ · {cup.won} G · {cup.drawn} E · {cup.lost} P</small></span><b className={cup.status}>{cup.stage}</b></div>)}</section>
        <section className="season-scorers"><div className="section-number">GOLEADORES DEL EQUIPO</div>{last.topScorers.map((player, index) => <div key={player.name}><span><b>{index + 1}</b>{player.name}<small>{player.position}</small></span><strong>{player.goals} <small>GOLES</small></strong></div>)}</section>
        <blockquote>“{last.story}”</blockquote><div className="career-gain"><span>REPUTACIÓN</span><strong>{state.manager.reputation}</strong><small>{state.manager.reputation < 100 ? "DT DESCONOCIDO" : state.manager.reputation < 250 ? "DT DEL ASCENSO" : state.manager.reputation < 550 ? "DT RESPETADO" : "DT DE PRIMER NIVEL"}</small></div>
        {canMoveToEurope(state) ? <div className="europe-call"><span>LO GANASTE TODO EN ARGENTINA</span><h3>EUROPA LLAMA.</h3><p>Ya fuiste campeón local y levantaste la Libertadores. Una propuesta europea puede cerrar tu historia en lo más alto.</p><button className="primary" onClick={() => completeCareer("europe")}>DAR EL SALTO A EUROPA <span>→</span></button><button className="text-button" onClick={() => setScreen("offers")}>Continuar en Argentina</button></div> : <button className="primary" onClick={() => setScreen("offers")}>ESCUCHAR OFERTAS <span>→</span></button>}
      </section>}

      {screen === "history" && state && <section className="history-view">
        <div className="page-heading"><div><p className="eyebrow">ARCHIVO PERSONAL</p><h2>ESTA HISTORIA<br />ES TUYA.</h2></div><div className="career-total"><strong>{state.history.length}</strong><span>TEMPORADAS</span></div></div>
        {state.history.length ? <div className="history-list">{[...state.history].reverse().map((item) => <article key={`${item.year}-${item.club}`}><time>{item.year}</time><div><strong>{item.club}</strong><span>{item.division}</span></div><div className="history-outcome"><strong>{item.outcome}</strong><span>{item.position}°</span></div></article>)}</div> : <p className="empty">Todavía no hay temporadas para contar.</p>}
        <div className="history-footer four"><div><span>TÍTULOS</span><strong>{state.trophies}</strong></div><div><span>ASCENSOS</span><strong>{state.promotions}</strong></div><div><span>REPUTACIÓN</span><strong>{state.manager.reputation}</strong></div><div><span>MÁX. IDOLATRÍA</span><strong>{Math.round(Math.max(0, ...Object.values(state.clubIdolatry)))}</strong></div></div>
        <button className="text-button" onClick={restart}>Empezar una carrera nueva</button>
      </section>}

      {screen === "retire" && state && <section className="retire-view"><p className="eyebrow">DECISIÓN IRREVERSIBLE</p><h2>¿ES EL MOMENTO<br />DE PARAR?</h2><p>Podés retirarte voluntariamente en cualquier temporada. Tu historial, títulos, ascensos e idolatría quedarán como balance definitivo.</p><div className="retire-facts"><div><span>EDAD</span><strong>{state.manager.age}</strong></div><div><span>TEMPORADAS</span><strong>{state.history.length}</strong></div><div><span>TÍTULOS</span><strong>{state.trophies}</strong></div></div><button className="primary" onClick={() => completeCareer("retirement")}>CONFIRMAR RETIRO <span>→</span></button><button className="text-button" onClick={() => setScreen(state.season ? state.season.tacticsConfirmed ? "season" : "report" : "offers")}>Todavía no. Seguir dirigiendo.</button></section>}

      {screen === "ending" && state?.ending && <section className={`ending-view ${state.ending.reason}`}><p className="eyebrow">FINAL DE CARRERA · {state.ending.year}</p><h1>{state.ending.title}</h1><p>{state.ending.description}</p><div className="ending-record"><div><span>EDAD FINAL</span><strong>{state.ending.age}</strong></div><div><span>TEMPORADAS</span><strong>{state.history.length}</strong></div><div><span>TÍTULOS</span><strong>{state.trophies}</strong></div><div><span>ASCENSOS</span><strong>{state.promotions}</strong></div></div><blockquote>“{state.manager.name}: una carrera que empezó sin nombre y terminó dejando una historia propia.”</blockquote><button className="primary light" onClick={restart}>EMPEZAR OTRA HISTORIA <span>→</span></button></section>}
      <a className="cafecito-button" href="https://cafecito.app/oddloop" rel="noopener" target="_blank" aria-label="Invitame un café en Cafecito, abre en una pestaña nueva"><img srcSet="https://cdn.cafecito.app/imgs/buttons/button_4.png 1x, https://cdn.cafecito.app/imgs/buttons/button_4_2x.png 2x, https://cdn.cafecito.app/imgs/buttons/button_4_3.75x.png 3.75x" src="https://cdn.cafecito.app/imgs/buttons/button_4.png" alt="Invitame un café en cafecito.app" /></a>
      <footer><span>MODO CARRERA DT · LOS PARTIDOS OCURREN. VOS APARECÉS CUANDO IMPORTA.<small>Desarrollado por Oddloop</small></span><span className="image-credits">Trofeos: <a href="https://commons.wikimedia.org/wiki/File:LigaProfesionalArg.png">Liga (CC0)</a> · <a href="https://commons.wikimedia.org/wiki/File:Trof%C3%A9u_da_Copa_da_Argentina.png">Copa Argentina (Taf0723, CC BY-SA 4.0)</a> · <a href="https://commons.wikimedia.org/wiki/File:328-3287452_copa-libertadores-primer-trofeo-hd-png-download.png">Libertadores (Mathiaseditorxd, CC BY-SA 4.0)</a></span></footer>
    </main>
  );
}
