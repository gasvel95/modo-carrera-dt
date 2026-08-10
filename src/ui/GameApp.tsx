"use client";

import { useEffect, useMemo, useState } from "react";
import { generateOffers, advanceUntilNextMeaningfulMoment, createCareer, finishSeason, resolveEvent, startSeason } from "../game-engine/careerEngine";
import { getClub } from "../data/clubs";
import type { CareerState, EventOutcome, GameEvent, Philosophy } from "../domain/game";

const STORAGE_KEY = "convertite-en-dt:carrera:v1";
const philosophies: Philosophy[] = ["Ofensivo", "Defensivo", "Equilibrado", "Motivador", "Formador", "Pragmático"];
type Screen = "intro" | "offers" | "season" | "event" | "outcome" | "summary" | "history";

function Meter({ label, value }: { label: string; value: number }) {
  return <div className="meter"><div className="meter-head"><span>{label}</span><strong>{Math.round(value)}%</strong></div><div className="meter-track"><span style={{ width: `${value}%` }} /></div></div>;
}

function Brand() {
  return <header className="brand"><div className="brand-mark">DT</div><div><span>UNA CARRERA. MIL HISTORIAS.</span><strong>CONVERTITE EN DT</strong></div></header>;
}

function FormDot({ result }: { result: "W" | "D" | "L" }) {
  return <span className={`form-dot ${result}`} title={result === "W" ? "Victoria" : result === "D" ? "Empate" : "Derrota"}>{result === "W" ? "G" : result === "D" ? "E" : "P"}</span>;
}

export function GameApp() {
  const [state, setState] = useState<CareerState | null>(null);
  const [screen, setScreen] = useState<Screen>("intro");
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [outcome, setOutcome] = useState<EventOutcome | null>(null);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", age: "38", nationality: "Argentina", supportedClub: "", philosophy: "Equilibrado" as Philosophy });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as CareerState;
      // Restores an external browser snapshot after hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(parsed);
      setScreen(parsed.season ? "season" : parsed.history.length ? "offers" : "offers");
    } catch { localStorage.removeItem(STORAGE_KEY); }
  }, []);

  useEffect(() => { if (state) localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state]);
  const club = state?.season ? getClub(state.season.clubId) : state?.clubId ? getClub(state.clubId) : null;
  const offers = useMemo(() => state ? generateOffers(state) : [], [state]);

  const begin = () => {
    if (!form.name.trim()) return;
    const career = createCareer({ name: form.name.trim(), age: Number(form.age), nationality: form.nationality, supportedClub: form.supportedClub || "No declarado", philosophy: form.philosophy });
    setState(career); setScreen("offers");
  };

  const chooseClub = (clubId: string) => { if (!state) return; setState(startSeason(state, clubId)); setScreen("season"); };
  const advance = () => {
    if (!state?.season || busy) return;
    setBusy(true);
    window.setTimeout(() => {
      const moment = advanceUntilNextMeaningfulMoment(state);
      setState(moment.state);
      if (moment.type === "event") { setActiveEvent(moment.event); setScreen("event"); }
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

  const restart = () => { localStorage.removeItem(STORAGE_KEY); setState(null); setActiveEvent(null); setOutcome(null); setScreen("intro"); };
  const last = state?.history.at(-1);

  return (
    <main className="game-shell">
      <div className="paper-noise" aria-hidden="true" />
      <Brand />
      {state && <nav className="career-nav" aria-label="Carrera"><button onClick={() => setScreen(state.season ? "season" : "offers")}>PARTIDA</button><button onClick={() => setScreen("history")}>HISTORIAL <span>{state.history.length}</span></button></nav>}

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

      {screen === "offers" && state && <section className="content-view">
        <div className="page-heading"><div><p className="eyebrow">EL TELÉFONO SONÓ</p><h2>TRES CLUBES.<br />UNA PRIMERA OPORTUNIDAD.</h2></div><div className="manager-stamp"><span>DT</span><strong>{state.manager.name}</strong><small>REP. {state.manager.reputation}</small></div></div>
        <p className="lead">Nadie te conoce todavía. Estas instituciones están dispuestas a darte las llaves del vestuario.</p>
        <div className="offer-grid">{offers.map((item, index) => <article className="offer-card" key={item.id}>
          <div className="offer-top"><span>OFERTA 0{index + 1}</span><strong>{item.division}</strong></div>
          <div className="club-monogram">{item.shortName}</div><h3>{item.name}</h3><p>{item.region}</p>
          <dl><div><dt>OBJETIVO</dt><dd>{item.objective}</dd></div><div><dt>PLANTEL</dt><dd>{"●".repeat(Math.round(item.squadStrength / 20))}{"○".repeat(5 - Math.round(item.squadStrength / 20))}</dd></div><div><dt>PRESIÓN</dt><dd>{item.fanPressure > 65 ? "ALTA" : item.fanPressure > 45 ? "MEDIA" : "BAJA"}</dd></div></dl>
          <button className="choice" onClick={() => chooseClub(item.id)}>FIRMAR CONTRATO <span>→</span></button>
        </article>)}</div>
      </section>}

      {screen === "season" && state?.season && club && <section className="season-view">
        <div className="scoreboard">
          <div><p className="eyebrow">TEMPORADA {state.season.year}</p><h2>{club.name}</h2><p>{club.division} · Objetivo: {club.objective}</p></div>
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
          <aside className="pulse-card"><div className="section-number">PULSO DEL CLUB</div><Meter label="HINCHAS" value={state.season.fanApproval} /><Meter label="VESTUARIO" value={state.season.morale} /><Meter label="DIRIGENCIA" value={state.season.boardTrust} /><Meter label="PRESIÓN" value={state.season.pressure} /></aside>
        </div>
      </section>}

      {screen === "event" && activeEvent && state?.season && <section className="event-view">
        <div className="event-stripe"><span>{activeEvent.level.replace("_", " ")}</span><span>FECHA {state.season.week}</span></div>
        <div className="event-card"><p className="eyebrow">{activeEvent.kicker}</p><h2>{activeEvent.title}</h2><p className="event-description">{activeEvent.description}</p><div className="question">¿QUÉ HACÉS?</div><div className="option-list">{activeEvent.options.map((option, index) => <button onClick={() => decide(option.id)} key={option.id}><span>0{index + 1}</span><strong>{option.text}</strong><i>→</i></button>)}</div><p className="probability-note">Tu decisión modifica probabilidades. Nunca garantiza el resultado.</p></div>
      </section>}

      {screen === "outcome" && outcome && state?.season && <section className={`outcome-view ${outcome.tone}`}>
        <div className="outcome-symbol">{outcome.tone === "positive" ? "↑" : outcome.tone === "negative" ? "↓" : "→"}</div><p className="eyebrow">CONSECUENCIA</p><h2>{outcome.title}</h2><p>{outcome.description}</p>
        <div className="impact-grid">{Object.entries(outcome.effects).filter(([, value]) => value).slice(0, 3).map(([key, value]) => <div key={key}><span>{({ morale: "MORAL", harmony: "ARMONÍA", pressure: "PRESIÓN", respect: "RESPETO", boardTrust: "DIRIGENCIA", performance: "RENDIMIENTO" } as Record<string, string>)[key] ?? key.toUpperCase()}</span><strong>{Number(value) > 0 ? "+" : ""}{key === "performance" ? `${Math.round(Number(value) * 100)}%` : value}</strong></div>)}</div>
        <button className="primary light" onClick={() => { setOutcome(null); setScreen("season"); }}>CONTINUAR TEMPORADA <span>→</span></button>
      </section>}

      {screen === "summary" && state && last && <section className="summary-view">
        <div className="summary-kicker">TEMPORADA {last.year} · INFORME FINAL</div><div className="summary-result"><div><p>{last.club}</p><h2>{last.outcome}</h2><span>{last.division}</span></div><strong>{last.position}°</strong></div>
        <div className="record-line"><div><span>PJ</span><strong>{last.played}</strong></div><div><span>PG</span><strong>{last.won}</strong></div><div><span>PE</span><strong>{last.drawn}</strong></div><div><span>PP</span><strong>{last.lost}</strong></div></div>
        <blockquote>“{last.story}”</blockquote><div className="career-gain"><span>REPUTACIÓN</span><strong>{state.manager.reputation}</strong><small>{state.manager.reputation < 100 ? "DT DESCONOCIDO" : state.manager.reputation < 250 ? "DT DEL ASCENSO" : state.manager.reputation < 550 ? "DT RESPETADO" : "DT DE PRIMER NIVEL"}</small></div>
        <button className="primary" onClick={() => setScreen("offers")}>ESCUCHAR OFERTAS <span>→</span></button>
      </section>}

      {screen === "history" && state && <section className="history-view">
        <div className="page-heading"><div><p className="eyebrow">ARCHIVO PERSONAL</p><h2>ESTA HISTORIA<br />ES TUYA.</h2></div><div className="career-total"><strong>{state.history.length}</strong><span>TEMPORADAS</span></div></div>
        {state.history.length ? <div className="history-list">{[...state.history].reverse().map((item) => <article key={`${item.year}-${item.club}`}><time>{item.year}</time><div><strong>{item.club}</strong><span>{item.division}</span></div><div className="history-outcome"><strong>{item.outcome}</strong><span>{item.position}°</span></div></article>)}</div> : <p className="empty">Todavía no hay temporadas para contar.</p>}
        <div className="history-footer"><div><span>TÍTULOS</span><strong>{state.trophies}</strong></div><div><span>ASCENSOS</span><strong>{state.promotions}</strong></div><div><span>REPUTACIÓN</span><strong>{state.manager.reputation}</strong></div></div>
        <button className="text-button" onClick={restart}>Empezar una carrera nueva</button>
      </section>}
      <footer><span>CONVERTITE EN DT · VERTICAL SLICE</span><span>LOS PARTIDOS OCURREN. VOS APARECÉS CUANDO IMPORTA.</span></footer>
    </main>
  );
}
