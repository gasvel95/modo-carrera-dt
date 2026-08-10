import { CLUBS, getClub } from "../data/clubs.ts";
import { DIVISION_TEAMS } from "../data/divisions.ts";
import { EVENTS } from "../data/events.ts";
import { SQUAD_NAMES, TRANSFER_POOL } from "../data/players.ts";
import type { CareerState, ClubOffer, Effects, EventOption, GameEvent, Manager, MatchResult, MeaningfulMoment, PlayerScorer, Season, SeasonRecord, StandingRow } from "../domain/game.ts";
import { nextRandom, randomInt } from "./rng.ts";

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const money = (value: number) => `US$${Math.round(value / 1000)}K`;

export function createCareer(manager: Omit<Manager, "reputation" | "leadership" | "respect">, seed = Date.now() >>> 0): CareerState {
  const philosophyLeadership = manager.philosophy === "Motivador" ? 68 : manager.philosophy === "Pragmático" ? 62 : 56;
  return { version: 2, seed, rngState: seed || 1978, manager: { ...manager, reputation: 28, leadership: philosophyLeadership, respect: 42 }, history: [], trophies: 0, promotions: 0 };
}

const seededScore = (text: string, seed: number) => [...text].reduce((sum, char) => sum + char.charCodeAt(0) * 17, seed) % 997;

export function generateOffers(state: CareerState): ClubOffer[] {
  const current = state.clubId ? getClub(state.clubId) : undefined;
  const last = state.history.at(-1);
  if (!last) {
    return [...CLUBS]
      .filter((club) => club.reputation <= 125)
      .sort((a, b) => seededScore(a.id, state.rngState) - seededScore(b.id, state.rngState))
      .slice(0, 3)
      .map((club) => ({ club, kind: "new", reason: "Primera oportunidad profesional" }));
  }

  const noise = (seededScore(last.club, state.rngState) % 121) - 60;
  const performanceDelta = last.objectiveMet ? 125 + Math.max(0, 8 - last.position) * 9 : -70 - Math.max(0, last.position - 12) * 5;
  const target = Math.max(55, (current?.reputation ?? state.manager.reputation) + performanceDelta + noise);
  const outsiders = [...CLUBS]
    .filter((club) => club.id !== current?.id)
    .sort((a, b) => Math.abs(a.reputation - target) - Math.abs(b.reputation - target) || seededScore(a.id, state.rngState) - seededScore(b.id, state.rngState));
  const offers: ClubOffer[] = [];
  if (current && last.objectiveMet) offers.push({ club: current, kind: "renewal", reason: `La dirigencia valora el ${last.position}° puesto y quiere continuidad` });
  const needed = 3 - offers.length;
  offers.push(...outsiders.slice(0, needed).map((club) => ({
    club,
    kind: "new" as const,
    reason: last.objectiveMet
      ? club.reputation > (current?.reputation ?? 0) ? "Tu campaña abrió una puerta más grande" : "Buscan aprovechar tu buen momento"
      : club.reputation < (current?.reputation ?? Infinity) ? "Una oportunidad para reconstruir tu carrera" : "Una apuesta inesperada de la dirigencia",
  })));
  return offers;
}

function emptyRow(team: { id: string; name: string; shortName: string; crestId: number; strength: number }): StandingRow {
  return { ...team, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0 };
}

function initialScorers(clubId: string): PlayerScorer[] {
  const offset = seededScore(clubId, 0) % (SQUAD_NAMES.length - 5);
  return [
    { name: SQUAD_NAMES[offset], position: "DEL", goals: 0, weight: 5 },
    { name: SQUAD_NAMES[offset + 1], position: "EXT", goals: 0, weight: 3 },
    { name: SQUAD_NAMES[offset + 2], position: "MCO", goals: 0, weight: 2 },
    { name: SQUAD_NAMES[offset + 3], position: "DFC", goals: 0, weight: 1 },
  ];
}

function transferCandidates(clubId: string, budget: number) {
  const offset = seededScore(clubId, budget) % TRANSFER_POOL.length;
  return Array.from({ length: 4 }, (_, index) => {
    const player = TRANSFER_POOL[(offset + index * 2) % TRANSFER_POOL.length];
    const factor = clamp(budget / 900000, .28, 1.5);
    return { ...player, cost: Math.round(player.cost * factor / 10000) * 10000 };
  });
}

export function startSeason(state: CareerState, clubId: string): CareerState {
  const club = getClub(clubId);
  const year = (state.history.at(-1)?.year ?? 2025) + 1;
  const teams = DIVISION_TEAMS[club.division] ?? DIVISION_TEAMS["Primera C"];
  const standings = teams.map((team) => emptyRow(team.id === club.id ? { ...team, strength: club.squadStrength } : team));
  const season: Season = {
    year, clubId, week: 0, totalWeeks: 34, position: 1, teams: standings.length,
    points: 0, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, form: [],
    morale: 58, harmony: 60, fanApproval: 52, boardTrust: 61, pressure: club.fanPressure / 3,
    performanceModifier: 0, eventCount: 0, seenEvents: [], moments: [], standings,
    scorers: initialScorers(clubId), transferCandidates: transferCandidates(clubId, club.budget), preseasonDone: false, squadStrengthModifier: 0,
  };
  return { ...state, clubId, season };
}

function transferEvent(state: CareerState): GameEvent {
  const club = getClub(state.season!.clubId);
  return {
    id: `preseason_market_${state.season!.year}`, category: "transfer", level: "MAJOR", kicker: "MERCADO DE PASES", title: "Una sola bala para reforzar el plantel",
    description: `La dirigencia de ${club.name} aprobó una incorporación. Hay cuatro perfiles sobre la mesa; cada uno puede cambiar la temporada.`, minWeek: 0, condition: "any", weight: 100,
    options: state.season!.transferCandidates.map((player) => ({
      id: player.id, playerName: player.name, text: `${player.name} · ${player.position} · ${player.age} años · ${money(player.cost)} — ${player.profile}`, approach: player.risk > .35 ? "bold" : player.risk < .18 ? "safe" : "calm",
      outcomes: [
        { id: `${player.id}_impact`, title: `${player.name} se adaptó de inmediato`, description: "El refuerzo elevó la competencia y encontró rápido su lugar.", baseProbability: .52 - player.risk / 3, tone: "positive", effects: { strength: player.strength, morale: 5, performance: .025 } },
        { id: `${player.id}_slow`, title: "Necesita tiempo", description: "Mostró condiciones, pero todavía no logra sostener el ritmo del equipo.", baseProbability: .30, tone: "neutral", effects: { strength: Math.max(1, player.strength - 2) } },
        { id: `${player.id}_miss`, title: "El refuerzo no encaja", description: "La inversión genera dudas y la tribuna empieza a impacientarse.", baseProbability: .18 + player.risk / 3, tone: "negative", effects: { pressure: 7, boardTrust: -5 } },
      ],
    })),
  };
}

function matchProbability(state: CareerState) {
  const season = state.season!;
  const club = getClub(season.clubId);
  const philosophy = state.manager.philosophy;
  const philosophyBoost = philosophy === "Ofensivo" || philosophy === "Motivador" ? .025 : philosophy === "Pragmático" ? .018 : .01;
  const effectiveStrength = club.squadStrength + season.squadStrengthModifier;
  const score = .34 + (effectiveStrength - 50) / 180 + (season.morale - 50) / 520 + season.performanceModifier + state.manager.reputation / 9000 + philosophyBoost - season.pressure / 1200;
  return clamp(score, .18, .66);
}

function addResult(row: StandingRow, result: MatchResult, gf: number, ga: number) {
  row.played++; row.goalsFor += gf; row.goalsAgainst += ga;
  if (result === "W") { row.won++; row.points += 3; }
  else if (result === "D") { row.drawn++; row.points++; }
  else row.lost++;
}

function scoreGoals(season: Season, goals: number, rng: number): number {
  for (let goal = 0; goal < goals; goal++) {
    const total = season.scorers.reduce((sum, scorer) => sum + scorer.weight, 0);
    let roll; [roll, rng] = nextRandom(rng); let cursor = 0;
    const scorer = season.scorers.find((player) => (cursor += player.weight / total) >= roll) ?? season.scorers[0];
    scorer.goals++;
  }
  return rng;
}

function simulateMatch(state: CareerState): CareerState {
  const season = structuredClone(state.season!);
  let rng = state.rngState;
  const [roll, afterRoll] = nextRandom(rng); rng = afterRoll;
  const win = matchProbability(state); const draw = .25;
  const result: MatchResult = roll < win ? "W" : roll < win + draw ? "D" : "L";
  const [gf, afterGoalsFor] = randomInt(rng, result === "W" ? 1 : 0, result === "W" ? 4 : result === "D" ? 2 : 1); rng = afterGoalsFor;
  let ga; [ga, rng] = randomInt(rng, result === "L" ? Math.max(1, gf + 1) : 0, result === "L" ? 4 : result === "D" ? gf : Math.max(0, gf - 1));
  if (result === "D") ga = gf;
  season.week++; season.played++; season.goalsFor += gf; season.goalsAgainst += ga; season.form = [...season.form, result].slice(-5);
  if (result === "W") { season.won++; season.points += 3; season.morale = clamp(season.morale + 3); season.fanApproval = clamp(season.fanApproval + 2); season.pressure = clamp(season.pressure - 2); }
  if (result === "D") { season.drawn++; season.points++; }
  if (result === "L") { season.lost++; season.morale = clamp(season.morale - 4); season.fanApproval = clamp(season.fanApproval - 3); season.pressure = clamp(season.pressure + 4); }
  rng = scoreGoals(season, gf, rng);
  const userRow = season.standings.find((row) => row.id === season.clubId)!;
  addResult(userRow, result, gf, ga);
  for (const row of season.standings) {
    if (row.id === season.clubId) continue;
    let otherRoll; [otherRoll, rng] = nextRandom(rng);
    const otherWin = clamp(.25 + (row.strength - 45) / 130, .2, .62);
    const otherResult: MatchResult = otherRoll < otherWin ? "W" : otherRoll < otherWin + .27 ? "D" : "L";
    let otherGf; [otherGf, rng] = randomInt(rng, otherResult === "W" ? 1 : 0, otherResult === "W" ? 4 : otherResult === "D" ? 2 : 1);
    let otherGa; [otherGa, rng] = randomInt(rng, otherResult === "L" ? Math.max(1, otherGf + 1) : 0, otherResult === "L" ? 4 : otherResult === "D" ? otherGf : Math.max(0, otherGf - 1));
    if (otherResult === "D") otherGa = otherGf;
    addResult(row, otherResult, otherGf, otherGa);
  }
  season.standings.sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst) || b.goalsFor - a.goalsFor);
  season.position = season.standings.findIndex((row) => row.id === season.clubId) + 1;
  season.boardTrust = clamp(season.boardTrust + (result === "W" ? 2 : result === "L" ? -2 : 0));
  season.performanceModifier *= .96;
  return { ...state, rngState: rng, season };
}

function materializeEvent(event: GameEvent, season: Season, rng: number): [GameEvent, number] {
  const sorted = [...season.scorers].sort((a, b) => b.goals - a.goals);
  let pick; [pick, rng] = randomInt(rng, 1, Math.min(3, sorted.length - 1));
  const player = sorted[pick]?.name ?? sorted[0].name; const topScorer = sorted[0].name;
  const replace = (text: string) => text.replaceAll("{player}", player).replaceAll("{topScorer}", topScorer);
  return [{ ...event, title: replace(event.title), description: replace(event.description) }, rng];
}

function eligibleEvent(state: CareerState): GameEvent | undefined {
  const season = state.season!;
  if (season.eventCount >= 6 || season.week < 3) return undefined;
  const losses = season.form.filter((result) => result === "L").length;
  const pool = EVENTS.filter((event) => !season.seenEvents.includes(event.id) && season.week >= event.minWeek && (
    event.condition === "any" || (event.condition === "crisis" && (losses >= 3 || season.pressure > 62)) ||
    (event.condition === "low_morale" && season.morale < 50) || (event.condition === "good_form" && season.form.filter((r) => r === "W").length >= 3)
  ));
  if (!pool.length) return undefined;
  const [roll, afterRoll] = nextRandom(state.rngState); state.rngState = afterRoll;
  const baseChance = .08 + Math.max(0, season.pressure - 50) / 450 + (season.week > season.totalWeeks - 5 ? .05 : 0);
  if (roll > baseChance) return undefined;
  const [pick, afterPick] = nextRandom(state.rngState); state.rngState = afterPick;
  const [result, finalRng] = materializeEvent(pool[Math.floor(pick * pool.length)], season, state.rngState); state.rngState = finalRng;
  return result;
}

export function advanceUntilNextMeaningfulMoment(input: CareerState): MeaningfulMoment {
  let state = structuredClone(input);
  if (state.season && !state.season.preseasonDone) {
    state.season.preseasonDone = true;
    return { type: "event", event: transferEvent(state), state };
  }
  while (state.season && state.season.week < state.season.totalWeeks) {
    state = simulateMatch(state);
    const event = eligibleEvent(state);
    if (event) {
      state.season = { ...state.season!, eventCount: state.season!.eventCount + 1, seenEvents: [...state.season!.seenEvents, event.id] };
      return { type: "event", event, state };
    }
  }
  return { type: "season_finished", state };
}

function applyEffects(state: CareerState, effects: Effects) {
  const season = { ...state.season! };
  season.morale = clamp(season.morale + (effects.morale ?? 0)); season.harmony = clamp(season.harmony + (effects.harmony ?? 0));
  season.fanApproval = clamp(season.fanApproval + (effects.fanApproval ?? 0)); season.boardTrust = clamp(season.boardTrust + (effects.boardTrust ?? 0));
  season.pressure = clamp(season.pressure + (effects.pressure ?? 0)); season.performanceModifier = clamp(season.performanceModifier + (effects.performance ?? 0), -.14, .14);
  season.squadStrengthModifier = clamp(season.squadStrengthModifier + (effects.strength ?? 0), -8, 12);
  const manager = { ...state.manager, respect: clamp(state.manager.respect + (effects.respect ?? 0)) };
  return { ...state, manager, season };
}

export function resolveEvent(input: CareerState, event: GameEvent, chosenOption: EventOption) {
  let state = structuredClone(input);
  let roll; [roll, state.rngState] = nextRandom(state.rngState);
  const leadership = (state.manager.leadership - 50) / 500; const pressure = (state.season!.pressure - 50) / 600;
  const adjusted = chosenOption.outcomes.map((outcome) => ({ ...outcome, p: Math.max(.04, outcome.baseProbability + (outcome.tone === "positive" ? leadership - pressure : outcome.tone === "negative" ? pressure - leadership : 0)) }));
  const total = adjusted.reduce((sum, item) => sum + item.p, 0); let cursor = 0;
  const chosen = adjusted.find((item) => (cursor += item.p / total) >= roll) ?? adjusted.at(-1)!;
  state = applyEffects(state, chosen.effects);
  if (chosenOption.playerName && !state.season!.scorers.some((player) => player.name === chosenOption.playerName)) {
    state.season!.scorers.push({ name: chosenOption.playerName, position: state.season!.transferCandidates.find((player) => player.name === chosenOption.playerName)?.position ?? "REF", goals: 0, weight: 3 });
  }
  state.season!.moments.push(`${event.title}: ${chosen.title}.`);
  return { state, outcome: chosen };
}

function objectiveTarget(objective: string) {
  if (/campeón|ascenso/i.test(objective)) return 2;
  if (/pelear|reducido/i.test(objective)) return 6;
  if (/copa/i.test(objective)) return 8;
  if (/mitad/i.test(objective)) return 10;
  return 15;
}

export function finishSeason(input: CareerState): CareerState {
  const state = structuredClone(input); const season = state.season!; const club = getClub(season.clubId);
  const promoted = season.position <= 2 && club.tier > 1; const champion = season.position === 1; const objectiveMet = season.position <= objectiveTarget(club.objective);
  const outcome = champion ? "CAMPEÓN" : promoted ? "ASCENSO" : season.position <= 6 ? "Gran campaña" : season.position >= 16 ? "Permanencia sufrida" : objectiveMet ? "Objetivo cumplido" : "Objetivo incumplido";
  const reputationDelta = Math.round((objectiveTarget(club.objective) - season.position) * 5 + (promoted ? 55 : 0) + (champion ? 45 : 0));
  const topScorers = [...season.scorers].sort((a, b) => b.goals - a.goals).slice(0, 4);
  const record: SeasonRecord = {
    year: season.year, club: club.name, division: club.division, position: season.position, outcome, objectiveMet, topScorers,
    played: season.played, won: season.won, drawn: season.drawn, lost: season.lost,
    story: season.moments.length ? `Una temporada marcada por ${season.moments.slice(0, 2).join(" ")} El equipo terminó ${season.position}°.` : `Una campaña sin grandes crisis: ${club.name} terminó ${season.position}° y el trabajo habló en la cancha.`,
  };
  state.manager.reputation = clamp(state.manager.reputation + reputationDelta, 0, 1000); state.history.push(record);
  state.promotions += promoted ? 1 : 0; state.trophies += champion ? 1 : 0; delete state.season;
  return state;
}
