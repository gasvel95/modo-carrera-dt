import { CLUBS, getClub } from "../data/clubs.ts";
import { EVENTS } from "../data/events.ts";
import type { CareerState, Effects, EventOption, GameEvent, Manager, MatchResult, MeaningfulMoment, Season, SeasonRecord } from "../domain/game.ts";
import { nextRandom, randomInt } from "./rng.ts";

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

export function createCareer(manager: Omit<Manager, "reputation" | "leadership" | "respect">, seed = Date.now() >>> 0): CareerState {
  const philosophyLeadership = manager.philosophy === "Motivador" ? 68 : manager.philosophy === "Pragmático" ? 62 : 56;
  return { version: 1, seed, rngState: seed || 1978, manager: { ...manager, reputation: 28, leadership: philosophyLeadership, respect: 42 }, history: [], trophies: 0, promotions: 0 };
}

export function generateOffers(state: CareerState) {
  const eligible = CLUBS.filter((club) => club.reputation <= Math.max(125, state.manager.reputation * 1.55) || club.id === state.clubId);
  const ordered = [...eligible].sort((a, b) => {
    const ah = (a.id.length * 31 + state.rngState) % 97;
    const bh = (b.id.length * 31 + state.rngState) % 97;
    return bh - ah;
  });
  const current = state.clubId ? getClub(state.clubId) : undefined;
  return [current, ...ordered.filter((club) => club.id !== current?.id)].filter(Boolean).slice(0, 3) as typeof CLUBS;
}

export function startSeason(state: CareerState, clubId: string): CareerState {
  const club = getClub(clubId);
  const year = (state.history.at(-1)?.year ?? 2025) + 1;
  const season: Season = {
    year, clubId, week: 0, totalWeeks: club.tier === 1 ? 27 : 38, position: Math.ceil(18 / 2), teams: 18,
    points: 0, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, form: [],
    morale: 58, harmony: 60, fanApproval: 52, boardTrust: 61, pressure: club.fanPressure / 3,
    performanceModifier: 0, eventCount: 0, seenEvents: [], moments: [],
  };
  return { ...state, clubId, season };
}

function matchProbability(state: CareerState) {
  const season = state.season!;
  const club = getClub(season.clubId);
  const philosophy = state.manager.philosophy;
  const philosophyBoost = philosophy === "Ofensivo" || philosophy === "Motivador" ? .025 : philosophy === "Pragmático" ? .018 : .01;
  const score = .34 + (club.squadStrength - 50) / 180 + (season.morale - 50) / 520 + season.performanceModifier + state.manager.reputation / 9000 + philosophyBoost - season.pressure / 1200;
  return clamp(score, .18, .66);
}

function simulateMatch(state: CareerState): CareerState {
  const season = { ...state.season! };
  let rng = state.rngState;
  const [roll, afterRoll] = nextRandom(rng); rng = afterRoll;
  const win = matchProbability(state);
  const draw = .25;
  const result: MatchResult = roll < win ? "W" : roll < win + draw ? "D" : "L";
  const [gf, afterGoalsFor] = randomInt(rng, result === "W" ? 1 : 0, result === "W" ? 4 : result === "D" ? 2 : 1); rng = afterGoalsFor;
  let ga; [ga, rng] = randomInt(rng, result === "L" ? Math.max(1, gf + 1) : 0, result === "L" ? 4 : result === "D" ? gf : Math.max(0, gf - 1));
  if (result === "D") ga = gf;
  season.week++; season.played++; season.goalsFor += gf; season.goalsAgainst += ga;
  season.form = [...season.form, result].slice(-5);
  if (result === "W") { season.won++; season.points += 3; season.morale = clamp(season.morale + 3); season.fanApproval = clamp(season.fanApproval + 2); season.pressure = clamp(season.pressure - 2); }
  if (result === "D") { season.drawn++; season.points++; season.morale = clamp(season.morale); }
  if (result === "L") { season.lost++; season.morale = clamp(season.morale - 4); season.fanApproval = clamp(season.fanApproval - 3); season.pressure = clamp(season.pressure + 4); }
  const ppg = season.points / season.played;
  season.position = clamp(Math.round(18 - ppg * 7 + (roll - .5) * 3), 1, 18);
  season.boardTrust = clamp(season.boardTrust + (result === "W" ? 2 : result === "L" ? -2 : 0));
  season.performanceModifier *= .96;
  return { ...state, rngState: rng, season };
}

function eligibleEvent(state: CareerState): GameEvent | undefined {
  const season = state.season!;
  if (season.eventCount >= 5 || season.week < 3) return undefined;
  const losses = season.form.filter((result) => result === "L").length;
  const pool = EVENTS.filter((event) => !season.seenEvents.includes(event.id) && season.week >= event.minWeek && (
    event.condition === "any" ||
    (event.condition === "crisis" && (losses >= 3 || season.pressure > 62)) ||
    (event.condition === "low_morale" && season.morale < 48) ||
    (event.condition === "good_form" && season.form.filter((r) => r === "W").length >= 3)
  ));
  if (!pool.length) return undefined;
  const [roll, afterRoll] = nextRandom(state.rngState); state.rngState = afterRoll;
  const baseChance = .06 + Math.max(0, season.pressure - 50) / 500 + (season.week > season.totalWeeks - 5 ? .06 : 0);
  if (roll > baseChance) return undefined;
  const [pick, afterPick] = nextRandom(state.rngState); state.rngState = afterPick;
  return pool[Math.floor(pick * pool.length)];
}

export function advanceUntilNextMeaningfulMoment(input: CareerState): MeaningfulMoment {
  let state = structuredClone(input);
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
  season.morale = clamp(season.morale + (effects.morale ?? 0));
  season.harmony = clamp(season.harmony + (effects.harmony ?? 0));
  season.fanApproval = clamp(season.fanApproval + (effects.fanApproval ?? 0));
  season.boardTrust = clamp(season.boardTrust + (effects.boardTrust ?? 0));
  season.pressure = clamp(season.pressure + (effects.pressure ?? 0));
  season.performanceModifier = clamp(season.performanceModifier + (effects.performance ?? 0), -.14, .14);
  const manager = { ...state.manager, respect: clamp(state.manager.respect + (effects.respect ?? 0)) };
  return { ...state, manager, season };
}

export function resolveEvent(input: CareerState, event: GameEvent, option: EventOption) {
  let state = structuredClone(input);
  let roll; [roll, state.rngState] = nextRandom(state.rngState);
  const leadership = (state.manager.leadership - 50) / 500;
  const pressure = (state.season!.pressure - 50) / 600;
  const adjusted = option.outcomes.map((outcome) => ({ ...outcome, p: Math.max(.04, outcome.baseProbability + (outcome.tone === "positive" ? leadership - pressure : outcome.tone === "negative" ? pressure - leadership : 0)) }));
  const total = adjusted.reduce((sum, outcome) => sum + outcome.p, 0);
  let cursor = 0;
  const chosen = adjusted.find((outcome) => (cursor += outcome.p / total) >= roll) ?? adjusted.at(-1)!;
  state = applyEffects(state, chosen.effects);
  state.season!.moments.push(`${event.title}: ${chosen.title}.`);
  return { state, outcome: chosen };
}

export function finishSeason(input: CareerState): CareerState {
  const state = structuredClone(input);
  const season = state.season!;
  const club = getClub(season.clubId);
  const promoted = season.position <= 2 && club.tier > 1;
  const champion = season.position === 1;
  const outcome = champion ? "CAMPEÓN" : promoted ? "ASCENSO" : season.position <= 6 ? "Gran campaña" : season.position >= 16 ? "Permanencia sufrida" : "Objetivo cumplido";
  const reputationGain = Math.round((19 - season.position) * 2.4 + (promoted ? 55 : 0) + (champion ? 45 : 0));
  const record: SeasonRecord = {
    year: season.year, club: club.name, division: club.division, position: season.position, outcome,
    played: season.played, won: season.won, drawn: season.drawn, lost: season.lost,
    story: season.moments.length ? `Una temporada marcada por ${season.moments.slice(0, 2).join(" ")} El equipo terminó ${season.position}°.` : `Una campaña sin grandes crisis: ${club.name} terminó ${season.position}° y el trabajo habló en la cancha.`,
  };
  state.manager.reputation = clamp(state.manager.reputation + reputationGain, 0, 1000);
  state.history.push(record);
  state.promotions += promoted ? 1 : 0;
  state.trophies += champion ? 1 : 0;
  delete state.season;
  return state;
}
