import { nextRandom } from "./rng.ts";
import { nextPlayerDivision, playerClubsForDivision, PRIMERA_D_CLUBS } from "../data/playerClubs.ts";
import { PLAYER_EVENTS } from "../data/playerEvents.ts";
import type { PlayerCareerState, PlayerDivision, PlayerEventEffects, PlayerMatch, PlayerOffer, PlayerPosition, PreferredFoot, TrainingFocus } from "../domain/playerCareer.ts";

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const retirementAge = (position: PlayerPosition) => position === "ARQ" ? 41 : position === "DEF" ? 39 : position === "MED" ? 38 : 37;
const goalChance: Record<PlayerPosition, number> = { ARQ: .003, DEF: .045, MED: .13, DEL: .29 };
const assistChance: Record<PlayerPosition, number> = { ARQ: .008, DEF: .06, MED: .2, DEL: .14 };

function random(state: PlayerCareerState) {
  const [value, rngState] = nextRandom(state.rngState);
  state.rngState = rngState;
  return value;
}

function shuffled<T>(items: T[], seed: number) {
  return [...items].sort((a, b) => {
    const score = (item: T) => [...JSON.stringify(item)].reduce((sum, char) => (sum * 31 + char.charCodeAt(0)) >>> 0, seed);
    return score(a) - score(b);
  });
}

function initialOffers(seed: number): PlayerOffer[] {
  return shuffled(PRIMERA_D_CLUBS, seed).slice(0, 3).map((club) => ({ club, kind: "new", reason: "Tu primera ficha en el fútbol de AFA" }));
}

export function createPlayerCareer(input: { name: string; age: number; position: PlayerPosition; preferredFoot: PreferredFoot }, seed = Date.now() >>> 0): PlayerCareerState {
  const safeSeed = seed || 1986;
  const baseOverall = input.position === "ARQ" ? 50 : input.position === "DEF" ? 49 : 48;
  return {
    version: 1,
    seed: safeSeed,
    rngState: safeSeed,
    player: { ...input, age: clamp(input.age, 16, 24), overall: baseOverall + safeSeed % 4, potential: 78 + safeSeed % 10, reputation: 4 },
    offers: initialOffers(safeSeed),
    history: [],
    totals: { appearances: 0, starts: 0, minutes: 0, goals: 0, assists: 0 },
    seenEvents: [],
    reachedFirstDivision: false,
  };
}

export function startPlayerSeason(input: PlayerCareerState, clubId: string): PlayerCareerState {
  const state = structuredClone(input);
  const offeredClub = state.offers.find((offer) => offer.club.id === clubId)?.club;
  if (!offeredClub) return state;
  const catalogClub = playerClubsForDivision(offeredClub.division).find((item) => item.id === offeredClub.id);
  const club = { ...offeredClub, ...catalogClub };
  const firstArrival = club.division === "Liga Profesional";
  state.club = club;
  state.reachedFirstDivision ||= firstArrival;
  state.season = {
    year: (state.history.at(-1)?.year ?? 2025) + 1,
    club,
    round: 0,
    totalRounds: 24,
    focus: "Técnica",
    appearances: 0,
    starts: 0,
    minutes: 0,
    goals: 0,
    assists: 0,
    ratingTotal: 0,
    coachTrust: clamp(43 + state.player.overall - club.strength / 2),
    fitness: 100,
    formBoost: 0,
    recentMatches: [],
    completed: false,
  };
  state.offers = [];
  delete state.pendingEvent;
  delete state.lastEventOutcome;
  return state;
}

export function setTrainingFocus(input: PlayerCareerState, focus: TrainingFocus) {
  const state = structuredClone(input);
  if (state.season && !state.season.completed) state.season.focus = focus;
  return state;
}

function opponentFor(state: PlayerCareerState, round: number) {
  const season = state.season!;
  const opponents = playerClubsForDivision(season.club.division).filter((club) => club.id !== season.club.id);
  return opponents[(round + state.seed) % opponents.length];
}

export function playPlayerBlock(input: PlayerCareerState): PlayerCareerState {
  const state = structuredClone(input);
  const season = state.season;
  if (!season || season.completed || state.retirement) return state;
  const block: PlayerMatch[] = [];
  const matches = Math.min(4, season.totalRounds - season.round);
  for (let index = 0; index < matches; index++) {
    season.round++;
    const appearanceChance = clamp(.52 + (state.player.overall - season.club.strength) / 95 + season.coachTrust / 300, .2, .98);
    const appears = random(state) < appearanceChance;
    const starts = appears && random(state) < clamp(season.coachTrust / 100, .24, .92);
    const minutes = appears ? starts ? 68 + Math.floor(random(state) * 23) : 12 + Math.floor(random(state) * 27) : 0;
    const focusBonus = season.focus === "Físico" ? .11 : season.focus === "Técnica" ? .16 : .08;
    const rawRating = appears ? clamp(5.35 + random(state) * 2.25 + (state.player.overall - season.club.strength) / 45 + focusBonus + (season.formBoost ?? 0), 4.6, 9.4) : undefined;
    const minuteFactor = minutes / 90;
    let goals = appears && random(state) < goalChance[state.player.position] * minuteFactor * (season.focus === "Definición" ? 1.38 : 1) ? 1 : 0;
    if (goals && random(state) < .08) goals++;
    const assists = appears && random(state) < assistChance[state.player.position] * minuteFactor * (season.focus === "Técnica" ? 1.25 : 1) ? 1 : 0;
    const teamEdge = (season.club.strength - 45) / 120 + (rawRating ? (rawRating - 6.4) / 12 : 0);
    const resultRoll = random(state);
    const result = resultRoll < clamp(.36 + teamEdge, .18, .7) ? "G" : resultRoll < clamp(.67 + teamEdge / 2, .43, .82) ? "E" : "P";
    if (appears) {
      season.appearances++; season.minutes += minutes; season.goals += goals; season.assists += assists; season.ratingTotal += rawRating!;
      if (starts) season.starts++;
      season.coachTrust = clamp(season.coachTrust + (rawRating! - 6.2) * 2.5 + goals * 3 + assists * 2);
      state.totals.appearances++; state.totals.minutes += minutes; state.totals.goals += goals; state.totals.assists += assists;
      if (starts) state.totals.starts++;
    } else {
      season.coachTrust = clamp(season.coachTrust - .6);
    }
    season.fitness = clamp(season.fitness - minutes / 34 + (season.focus === "Físico" ? 2.8 : 2), 45, 100);
    season.formBoost = (season.formBoost ?? 0) * .85;
    const opponent = opponentFor(state, season.round);
    block.push({ round: season.round, opponent: opponent?.name ?? "Selección de la categoría", opponentCrestId: opponent?.crestId, result, minutes, rating: rawRating ? Number(rawRating.toFixed(1)) : undefined, goals, assists });
  }
  season.recentMatches = block;
  season.completed = season.round >= season.totalRounds;
  if (!season.completed && !state.pendingEvent && random(state) < .58) queuePlayerEvent(state);
  return state;
}

function queuePlayerEvent(state: PlayerCareerState) {
  const seen = state.seenEvents ?? [];
  const recent = new Set(seen.slice(-5));
  const pool = PLAYER_EVENTS.filter((event) => !recent.has(event.id));
  const event = pool[Math.floor(random(state) * pool.length)] ?? PLAYER_EVENTS[0];
  state.pendingEvent = structuredClone(event);
  state.seenEvents = [...seen, event.id].slice(-10);
}

function applyEventEffects(state: PlayerCareerState, effects: PlayerEventEffects) {
  if (state.season) {
    state.season.coachTrust = clamp(state.season.coachTrust + (effects.coachTrust ?? 0));
    state.season.fitness = clamp(state.season.fitness + (effects.fitness ?? 0));
    state.season.formBoost = clamp((state.season.formBoost ?? 0) + (effects.formBoost ?? 0), -.5, .5);
  }
  state.player.reputation = clamp(state.player.reputation + (effects.reputation ?? 0));
  state.player.overall = clamp(state.player.overall + (effects.overall ?? 0), 35, state.player.potential);
}

export function resolvePlayerEvent(input: PlayerCareerState, optionId: string): PlayerCareerState {
  const state = structuredClone(input);
  const option = state.pendingEvent?.options.find((item) => item.id === optionId);
  if (!option) return state;
  const composureBonus = (state.player.reputation - 25) / 500 + ((state.season?.coachTrust ?? 50) - 50) / 1000;
  const success = random(state) < clamp(option.successChance + composureBonus, .15, .88);
  const result = structuredClone(success ? option.outcomes.success : option.outcomes.failure);
  applyEventEffects(state, result.effects);
  state.lastEventOutcome = result;
  delete state.pendingEvent;
  return state;
}

export function dismissPlayerEventOutcome(input: PlayerCareerState): PlayerCareerState {
  const state = structuredClone(input);
  delete state.lastEventOutcome;
  return state;
}

function offersAfterSeason(state: PlayerCareerState, averageRating: number): PlayerOffer[] {
  const current = state.club!;
  const season = state.history.at(-1)!;
  const nextDivision = nextPlayerDivision(current.division);
  const earnedStep = Boolean(nextDivision) && season.appearances >= 12 && (averageRating >= 6.55 || state.player.overall >= current.strength + 10);
  const targetDivision: PlayerDivision = earnedStep ? nextDivision! : current.division;
  const candidates = shuffled(playerClubsForDivision(targetDivision).filter((club) => club.id !== current.id), state.rngState);
  const offers: PlayerOffer[] = [{ club: current, kind: "renewal", reason: averageRating >= 6.5 ? "El cuerpo técnico quiere darte continuidad" : "El club apuesta por tu recuperación" }];
  offers.push(...candidates.slice(0, 2).map((club) => ({
    club,
    kind: "new" as const,
    reason: earnedStep ? `Tu rendimiento abrió la puerta de ${targetDivision}` : "Una oportunidad para ganar protagonismo",
  })));
  return offers;
}

export function finishPlayerSeason(input: PlayerCareerState): PlayerCareerState {
  const state = structuredClone(input);
  const season = state.season;
  if (!season?.completed) return state;
  const averageRating = season.appearances ? season.ratingTotal / season.appearances : 5.5;
  const overallBefore = state.player.overall;
  const development = state.player.age <= 24 ? 2 : state.player.age <= 29 ? 1 : state.player.age >= 34 ? -1 : 0;
  const performanceGrowth = averageRating >= 7.35 ? 2 : averageRating >= 6.65 ? 1 : averageRating < 5.8 ? -1 : 0;
  state.player.overall = clamp(state.player.overall + development + performanceGrowth, 35, state.player.potential);
  state.player.reputation = clamp(state.player.reputation + Math.round((averageRating - 5.8) * 14 + season.goals * 1.8 + season.assists * 1.3 + season.appearances / 4), 0, 100);
  const outcome = averageRating >= 7.3 ? "Figura de la temporada" : averageRating >= 6.65 ? "Temporada en crecimiento" : averageRating >= 6.1 ? "Cumplió con el equipo" : "Año de aprendizaje";
  state.history.push({
    year: season.year, age: state.player.age, club: season.club.name, clubShortName: season.club.shortName, crestId: season.club.crestId, division: season.club.division,
    appearances: season.appearances, starts: season.starts, minutes: season.minutes, goals: season.goals, assists: season.assists,
    averageRating: Number(averageRating.toFixed(2)), overallBefore, overallAfter: state.player.overall, outcome,
  });
  state.player.age++;
  delete state.season;
  if (state.player.age >= retirementAge(state.player.position)) {
    state.retirement = { reason: "age", year: season.year, age: state.player.age, title: "EL CUERPO DIJO BASTA" };
    state.offers = [];
  } else {
    state.offers = offersAfterSeason(state, averageRating);
  }
  return state;
}

export function retirePlayer(input: PlayerCareerState): PlayerCareerState {
  const state = structuredClone(input);
  const year = state.season?.year ?? state.history.at(-1)?.year ?? 2026;
  state.retirement = { reason: "voluntary", year, age: state.player.age, title: "EL ÚLTIMO PARTIDO" };
  delete state.season;
  state.offers = [];
  return state;
}

export function playerRetirementAge(position: PlayerPosition) {
  return retirementAge(position);
}

