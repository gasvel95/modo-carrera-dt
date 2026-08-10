import { CLUBS, getClub } from "../data/clubs.ts";
import { DIVISION_TEAMS, DIVISION_TIER, NEXT_DIVISION } from "../data/divisions.ts";
import { EVENTS } from "../data/events.ts";
import { FIRST_NAMES, LAST_NAMES, TRANSFER_PROFILES } from "../data/players.ts";
import type { CareerState, Club, ClubOffer, CupRun, Effects, EventOption, EventOutcome, Formation, GameEvent, Manager, MatchResult, MeaningfulMoment, PlayerScorer, Season, SeasonRecord, StandingRow, TacticalApproach } from "../domain/game.ts";
import { nextRandom, randomInt } from "./rng.ts";

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));

export function createCareer(manager: Omit<Manager, "reputation" | "leadership" | "respect">, seed = Date.now() >>> 0): CareerState {
  const philosophyLeadership = manager.philosophy === "Motivador" ? 68 : manager.philosophy === "Pragmático" ? 62 : 56;
  return { version: 7, seed, rngState: seed || 1978, manager: { ...manager, reputation: 28, leadership: philosophyLeadership, respect: 42 }, history: [], trophies: 0, promotions: 0, clubDivisions: {}, eventHistory: {}, offerHistory: [], clubIdolatry: {}, clubSeasons: {}, achievements: { leagueTitles: 0, copaArgentinaTitles: 0, libertadoresTitles: 0, sudamericanaTitles: 0 } };
}

const seededScore = (text: string, seed: number) => [...text].reduce((sum, char) => sum + char.charCodeAt(0) * 17, seed) % 997;

function clubForCareer(state: CareerState, clubId: string) {
  const base = getClub(clubId); const division = state.clubDivisions[clubId] ?? base.division;
  return { ...base, division, tier: DIVISION_TIER[division] ?? base.tier, objective: division === base.division ? base.objective : "Evitar el descenso" };
}

export function generateOffers(state: CareerState): ClubOffer[] {
  const current = state.clubId ? clubForCareer(state, state.clubId) : undefined;
  const last = state.history.at(-1);
  const year = (last?.year ?? 2025) + 1;
  const recentlyOffered = new Set(state.offerHistory.slice(-2).flatMap((entry) => entry.clubIds));
  if (!last) {
    return [...CLUBS]
      .filter((club) => club.reputation <= 125 && !recentlyOffered.has(club.id))
      .sort((a, b) => seededScore(`${a.id}-${year}`, state.rngState) - seededScore(`${b.id}-${year}`, state.rngState))
      .slice(0, 3)
      .map((club) => ({ club, kind: "new", reason: "Primera oportunidad profesional" }));
  }

  const noise = (seededScore(last.club, state.rngState) % 121) - 60;
  const performanceDelta = last.objectiveMet ? 125 + Math.max(0, 8 - last.position) * 9 : -70 - Math.max(0, last.position - 12) * 5;
  const target = Math.max(55, (current?.reputation ?? state.manager.reputation) + performanceDelta + noise);
  let outsiders = CLUBS.map((club) => clubForCareer(state, club.id))
    .filter((club) => club.id !== current?.id && !recentlyOffered.has(club.id));
  if (outsiders.length < 3) outsiders = CLUBS.map((club) => clubForCareer(state, club.id)).filter((club) => club.id !== current?.id);
  outsiders.sort((a, b) => (Math.abs(a.reputation - target) + seededScore(`${a.id}-${year}`, state.seed) % 150) - (Math.abs(b.reputation - target) + seededScore(`${b.id}-${year}`, state.seed) % 150));
  const offers: ClubOffer[] = [];
  if (current && !last.contractTerminated) offers.push({ club: current, kind: "renewal", reason: last.objectiveMet ? `La dirigencia valora el ${last.position}° puesto y quiere continuidad` : "La junta decidió sostenerte pese al objetivo incumplido" });
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

function generatedName(key: string, seed: number, used: Set<string>) {
  let first = seededScore(`${key}-nombre`, seed) % FIRST_NAMES.length;
  let last = seededScore(`${key}-apellido`, seed + 97) % LAST_NAMES.length;
  let name = `${FIRST_NAMES[first]} ${LAST_NAMES[last]}`;
  while (used.has(name)) { first = (first + 7) % FIRST_NAMES.length; last = (last + 11) % LAST_NAMES.length; name = `${FIRST_NAMES[first]} ${LAST_NAMES[last]}`; }
  used.add(name);
  return name;
}

function initialScorers(clubId: string, year: number, seed: number): PlayerScorer[] {
  const used = new Set<string>();
  const roles: Array<[string, number]> = [["DEL", 5], ["EXT", 3], ["MCO", 2], ["MC", 1], ["DEL", 2], ["EXT", 1], ["VOL", 1]];
  return roles.map(([position, weight], index) => ({ name: generatedName(`${clubId}-${year}-plantel-${index}`, seed, used), position, goals: 0, weight }));
}

function initialCups(state: CareerState, club: Club): CupRun[] {
  const cup = (name: CupRun["name"], stage: string, nextWeek: number): CupRun => ({ name, stage, status: "active", played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, roundIndex: 0, nextWeek });
  const cups = [cup("Copa Argentina", "32avos de final", 5)];
  const last = state.history.at(-1); const sameClub = last?.club === club.name; const priorPosition = sameClub && last.division === "Liga Profesional" ? last.position : undefined;
  const copaArgentinaChampion = sameClub && last.cups.some((item) => item.name === "Copa Argentina" && item.status === "champion");
  if (club.division !== "Liga Profesional" && !copaArgentinaChampion) return cups;
  const libertadores = copaArgentinaChampion || (priorPosition ? priorPosition <= 4 : club.squadStrength >= 86);
  const sudamericana = priorPosition ? priorPosition >= 5 && priorPosition <= 10 : !libertadores && club.squadStrength >= 80;
  if (libertadores) cups.push(cup("Copa Libertadores", "Fase de grupos", 6));
  else if (sudamericana) cups.push(cup("Copa Sudamericana", "Fase de grupos", 6));
  return cups;
}

function transferCandidates(clubId: string, budget: number, year: number, seed: number) {
  const offset = seededScore(`${clubId}-${year}`, seed) % TRANSFER_PROFILES.length;
  const used = new Set<string>();
  return Array.from({ length: 4 }, (_, index) => {
    const profile = TRANSFER_PROFILES[(offset + index * 3) % TRANSFER_PROFILES.length];
    let firstIndex = (seededScore(`${profile.id}-${year}-${index}`, seed) + index * 7) % FIRST_NAMES.length;
    let lastIndex = (seededScore(`${clubId}-${profile.position}-${index}`, seed + year) + index * 11) % LAST_NAMES.length;
    let name = `${FIRST_NAMES[firstIndex]} ${LAST_NAMES[lastIndex]}`;
    while (used.has(name)) { firstIndex = (firstIndex + 1) % FIRST_NAMES.length; lastIndex = (lastIndex + 3) % LAST_NAMES.length; name = `${FIRST_NAMES[firstIndex]} ${LAST_NAMES[lastIndex]}`; }
    used.add(name);
    const factor = clamp(budget / 900000, .28, 1.5);
    return { ...profile, id: `${profile.id}_${year}_${index}`, name, cost: Math.round(profile.cost * factor / 10000) * 10000 };
  });
}

export function startSeason(state: CareerState, clubId: string): CareerState {
  const displayedOffers = generateOffers(state);
  const club = clubForCareer(state, clubId);
  const year = (state.history.at(-1)?.year ?? 2025) + 1;
  const teams = DIVISION_TEAMS[club.division] ?? DIVISION_TEAMS["Primera C"];
  const roster = teams.some((team) => team.id === club.id) ? teams : [...teams.slice(0, -1), { id: club.id, name: club.name, shortName: club.shortName, crestId: club.crestId, strength: club.squadStrength }];
  const standings = roster.map((team) => emptyRow(team.id === club.id ? { ...team, strength: club.squadStrength } : team));
  const variance = (seededScore(`${clubId}-${year}-report`, state.seed) % 5) - 2;
  const attack = clamp(club.attack + variance); const midfield = clamp(club.midfield - Math.sign(variance)); const defense = clamp(club.defense - variance);
  const lines = [{ label: "ataque", value: attack }, { label: "mediocampo", value: midfield }, { label: "defensa", value: defense }].sort((a, b) => b.value - a.value);
  const idolatry = state.clubIdolatry[clubId] ?? 0;
  const season: Season = {
    year, clubId, division: club.division, week: 0, totalWeeks: 34, position: 1, teams: standings.length,
    points: 0, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, form: [],
    morale: 58, harmony: 60, fanApproval: 52, boardTrust: 61, pressure: clamp(club.fanPressure / 3 - idolatry / 5), idolatry,
    performanceModifier: 0, eventCount: 0, seenEvents: [], moments: [], standings,
    scorers: initialScorers(clubId, year, state.seed), transferCandidates: transferCandidates(clubId, club.budget, year, state.rngState), preseasonDone: false, squadStrengthModifier: 0, pendingTransfers: [],
    squadReport: { attack, midfield, defense, strengths: [`El ${lines[0].label} es la línea más confiable`, attack >= 82 ? "Hay desequilibrio individual en los últimos metros" : midfield >= 76 ? "El equipo puede sostener la posesión" : "El grupo compite bien en duelos"], weaknesses: [`El ${lines[2].label} ofrece menos garantías`, defense < 65 ? "Falta profundidad defensiva" : attack < 65 ? "Cuesta transformar dominio en goles" : "El recambio es irregular"] },
    tacticalModifier: 0, tacticsConfirmed: false, cups: initialCups(state, club),
  };
  const offerHistory = [...state.offerHistory, { year, clubIds: displayedOffers.map((offer) => offer.club.id) }].slice(-4);
  return { ...state, clubId, season, offerHistory };
}

export function confirmSeasonTactics(input: CareerState, tacticalApproach: TacticalApproach, formation: Formation): CareerState {
  const state = structuredClone(input); const season = state.season!; const { attack, midfield, defense } = season.squadReport;
  const profiles: Record<Formation, [number, number, number]> = {
    "4-3-3": [.5, .3, .2], "4-2-3-1": [.38, .37, .25], "4-4-2": [.34, .32, .34], "3-5-2": [.34, .45, .21], "5-3-2": [.22, .3, .48],
  };
  const [aw, mw, dw] = profiles[formation];
  const formationScore = attack * aw + midfield * mw + defense * dw;
  const approachScore = tacticalApproach === "Ofensivo" ? attack * .62 + midfield * .28 + defense * .1 : tacticalApproach === "Defensivo" ? defense * .62 + midfield * .28 + attack * .1 : (attack + midfield + defense) / 3;
  const coherence = tacticalApproach === "Ofensivo" && (formation === "4-3-3" || formation === "4-2-3-1") ? 3 : tacticalApproach === "Defensivo" && (formation === "5-3-2" || formation === "4-4-2") ? 3 : tacticalApproach === "Equilibrado" && (formation === "4-4-2" || formation === "4-2-3-1") ? 2 : 0;
  const squadBaseline = (attack + midfield + defense) / 3;
  season.tacticalModifier = clamp((formationScore * .55 + approachScore * .45 + coherence - squadBaseline) / 80, -.055, .065);
  season.tacticalApproach = tacticalApproach; season.formation = formation; season.tacticsConfirmed = true;
  return state;
}

function transferEvent(state: CareerState): GameEvent {
  const club = getClub(state.season!.clubId);
  return {
    id: `preseason_market_${state.season!.year}`, category: "transfer", level: "MAJOR", kicker: "MERCADO DE PASES", title: "Una sola bala para reforzar el plantel",
    description: `La dirigencia de ${club.name} aprobó una incorporación. Hay cuatro perfiles sobre la mesa; cada uno puede cambiar la temporada.`, minWeek: 0, condition: "any", weight: 100,
    options: state.season!.transferCandidates.map((player) => ({
      id: player.id, playerName: player.name, text: `${player.name} · ${player.position} · ${player.age} años — ${player.profile}`, approach: player.risk > .35 ? "bold" : player.risk < .18 ? "safe" : "calm",
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
  const score = .34 + (effectiveStrength - 50) / 180 + (season.morale - 50) / 520 + season.performanceModifier + season.tacticalModifier + state.manager.reputation / 9000 + philosophyBoost - season.pressure / 1200;
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
    let credited; [credited, rng] = nextRandom(rng); if (credited > .72) continue;
    const eligible = season.scorers.filter((scorer) => !/^(ARQ|DFC|LAT|LI|LD|DEF)$/i.test(scorer.position) && scorer.goals < 12);
    if (!eligible.length) break;
    const total = eligible.reduce((sum, scorer) => sum + scorer.weight, 0);
    let roll; [roll, rng] = nextRandom(rng); let cursor = 0;
    const scorer = eligible.find((player) => (cursor += player.weight / total) >= roll) ?? eligible[0];
    scorer.goals++;
  }
  return rng;
}

const CUP_STAGES: Record<CupRun["name"], string[]> = {
  "Copa Argentina": ["32avos de final", "16avos de final", "Octavos de final", "Cuartos de final", "Semifinal", "Final"],
  "Copa Libertadores": ["Fase de grupos", "Octavos de final", "Cuartos de final", "Semifinal", "Final"],
  "Copa Sudamericana": ["Fase de grupos", "Octavos de final", "Cuartos de final", "Semifinal", "Final"],
};

function simulateCups(input: CareerState, forcedCup?: { name: CupRun["name"]; result: MatchResult }): CareerState {
  const state = structuredClone(input); const season = state.season!; let rng = state.rngState;
  for (const cup of season.cups.filter((item) => item.status === "active" && item.nextWeek <= season.week)) {
    const stages = CUP_STAGES[cup.name];
    if (cup.roundIndex === 0 && cup.name !== "Copa Argentina") {
      let roll; [roll, rng] = nextRandom(rng);
      const club = getClub(season.clubId); const qualifyChance = clamp(.42 + (club.squadStrength + season.squadStrengthModifier - 70) / 110 + season.tacticalModifier, .28, .82);
      const qualified = forcedCup?.name === cup.name ? forcedCup.result === "W" : roll < qualifyChance; let draws; [draws, rng] = randomInt(rng, 1, 2);
      cup.played += 6; cup.won += qualified ? 3 : 1; cup.drawn += draws; cup.lost += 6 - (qualified ? 3 : 1) - draws;
      let gf; [gf, rng] = randomInt(rng, qualified ? 7 : 3, qualified ? 12 : 8); let ga; [ga, rng] = randomInt(rng, qualified ? 3 : 7, qualified ? 8 : 13);
      cup.goalsFor += gf; cup.goalsAgainst += ga; rng = scoreGoals(season, gf, rng);
      if (qualified) { cup.roundIndex = 1; cup.stage = stages[1]; cup.nextWeek += 4; }
      else { cup.status = "eliminated"; }
      continue;
    }
    const club = getClub(season.clubId); const international = cup.name !== "Copa Argentina";
    const winChance = clamp(.44 + (club.squadStrength + season.squadStrengthModifier - (international ? 80 : 65)) / 140 + season.tacticalModifier, .27, .68);
    let roll; [roll, rng] = nextRandom(rng); let advanced = roll < winChance; let result: MatchResult = advanced ? "W" : "L";
    if (forcedCup?.name === cup.name) { result = forcedCup.result; advanced = result === "W"; }
    if (forcedCup?.name !== cup.name && !advanced && roll < winChance + .18) { result = "D"; let shootout; [shootout, rng] = nextRandom(rng); advanced = shootout < .5; }
    let gf; [gf, rng] = randomInt(rng, result === "W" ? 1 : 0, result === "W" ? 3 : result === "D" ? 2 : 1); let ga; [ga, rng] = randomInt(rng, result === "L" ? Math.max(1, gf + 1) : 0, result === "L" ? 3 : result === "D" ? gf : Math.max(0, gf - 1)); if (result === "D") ga = gf;
    cup.played++; cup.goalsFor += gf; cup.goalsAgainst += ga; cup.won += result === "W" ? 1 : 0; cup.drawn += result === "D" ? 1 : 0; cup.lost += result === "L" ? 1 : 0; rng = scoreGoals(season, gf, rng);
    if (!advanced) cup.status = "eliminated";
    else if (cup.roundIndex === stages.length - 1) { cup.status = "champion"; cup.stage = "CAMPEÓN"; }
    else { cup.roundIndex++; cup.stage = stages[cup.roundIndex]; cup.nextWeek += 4; }
  }
  state.rngState = rng; return state;
}

function simulateMatch(state: CareerState, forcedLeagueResult?: MatchResult, forcedCup?: { name: CupRun["name"]; result: MatchResult }): CareerState {
  const season = structuredClone(state.season!);
  let rng = state.rngState;
  const [roll, afterRoll] = nextRandom(rng); rng = afterRoll;
  const win = matchProbability(state); const draw = .25;
  const result: MatchResult = forcedLeagueResult ?? (roll < win ? "W" : roll < win + draw ? "D" : "L");
  const [gf, afterGoalsFor] = randomInt(rng, result === "W" ? 1 : 0, result === "W" ? 4 : result === "D" ? 2 : 1); rng = afterGoalsFor;
  let ga; [ga, rng] = randomInt(rng, result === "L" ? Math.max(1, gf + 1) : 0, result === "L" ? 4 : result === "D" ? gf : Math.max(0, gf - 1));
  if (result === "D") ga = gf;
  season.week++; season.played++; season.goalsFor += gf; season.goalsAgainst += ga; season.form = [...season.form, result].slice(-5);
  if (result === "W") { season.won++; season.points += 3; season.morale = clamp(season.morale + 3); season.fanApproval = clamp(season.fanApproval + 2); season.pressure = clamp(season.pressure - 2 - season.idolatry / 35); }
  if (result === "D") { season.drawn++; season.points++; }
  if (result === "L") { season.lost++; season.morale = clamp(season.morale - 4); season.fanApproval = clamp(season.fanApproval - 3); season.pressure = clamp(season.pressure + 4 + season.idolatry / 18); }
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
  return simulateCups({ ...state, rngState: rng, season }, forcedCup);
}

function decisiveOption(id: string, text: string, approach: EventOption["approach"], winChance: number, effects: Effects): EventOption {
  const drawChance = .18;
  return { id, text, approach, outcomes: [
    { id: `${id}_win`, title: "La apuesta gana el partido", description: "El equipo ejecuta el plan y se queda con una victoria trascendental.", baseProbability: winChance, tone: "positive", effects, matchResult: "W" },
    { id: `${id}_draw`, title: "El partido termina igualado", description: "La decisión alcanza para competir, pero no para quebrar el empate.", baseProbability: drawChance, tone: "neutral", effects: { pressure: -1 }, matchResult: "D" },
    { id: `${id}_loss`, title: "La apuesta no funciona", description: "El rival encuentra la respuesta y el partido se escapa.", baseProbability: 1 - winChance - drawChance, tone: "negative", effects: { pressure: 9, morale: -6 }, matchResult: "L" },
  ] };
}

function keyMatchEvent(state: CareerState): GameEvent | undefined {
  const season = state.season!;
  if (season.eventCount >= 6 || season.seenEvents.filter((id) => id.startsWith("key_")).length >= 2) return undefined;
  const club = getClub(season.clubId); const nextWeek = season.week + 1;
  const dueCup = season.cups.find((cup) => cup.status === "active" && cup.nextWeek <= nextWeek);
  const derbyWeek = 8 + seededScore(`${club.id}-${season.year}-clasico`, state.seed) % 18;
  const relegationFight = season.week >= season.totalWeeks - 7 && season.position >= season.teams - 4;
  const campaignWeek = 19 + seededScore(`${club.id}-${season.year}-campana`, state.seed) % 10;
  let target: GameEvent["matchTarget"] | undefined; let id = ""; let kicker = ""; let title = ""; let description = "";
  if (dueCup) {
    let chance; [chance, state.rngState] = nextRandom(state.rngState);
    if (dueCup.roundIndex >= 2 || chance < .38) {
      id = `key_cup_${season.year}_${dueCup.name}_${dueCup.roundIndex}`; kicker = `${dueCup.name.toUpperCase()} · ${dueCup.stage.toUpperCase()}`; title = "Una noche que puede cambiar la temporada";
      description = `${dueCup.name} no admite distracciones. El cuerpo técnico espera tu plan para ${dueCup.stage.toLowerCase()}.`;
      target = { type: "cup", label: `${dueCup.name} · ${dueCup.stage}`, cupName: dueCup.name };
    }
  } else if (club.rivalId && nextWeek === derbyWeek) {
    const rival = getClub(club.rivalId); id = `key_derby_${season.year}`; kicker = "CLÁSICO RIVAL"; title = `${club.name} contra ${rival.name}`;
    description = "No es una fecha más. La ciudad se paraliza y una decisión táctica puede definir el clásico."; target = { type: "league", label: `Clásico ante ${rival.name}` };
  } else if (relegationFight) {
    id = `key_relegation_${season.year}`; kicker = "PARTIDO POR LA PERMANENCIA"; title = "Noventa minutos para escapar del fondo";
    description = "Un rival directo espera del otro lado. Ganar puede sacar al equipo de la zona roja; perder multiplica la presión."; target = { type: "league", label: "Partido clave por la permanencia" };
  } else if (nextWeek === campaignWeek) {
    id = `key_campaign_${season.year}`; kicker = season.position <= 6 ? "PARTIDO PARA DAR EL SALTO" : "PARTIDO BISAGRA"; title = "La campaña llega a una fecha decisiva";
    description = season.position <= 6 ? "Una victoria acerca al equipo a los puestos de privilegio." : "La tabla está apretada y estos puntos pueden cambiar el rumbo del año."; target = { type: "league", label: "Partido clave para la campaña" };
  }
  if (!target || season.seenEvents.includes(id)) return undefined;
  return { id, category: "partido_trascendental", level: "CAREER_DEFINING", kicker, title, description, minWeek: season.week, condition: "any", weight: 100, matchTarget: target, options: [
    decisiveOption(`${id}_counter`, "Esperar y atacar de contra", "safe", .46, { performance: .02, respect: 4 }),
    decisiveOption(`${id}_attack`, "Salir a buscarlo desde el arranque", "bold", .52, { fanApproval: 8, morale: 4 }),
    decisiveOption(`${id}_bonus`, "Prometer un plus al plantel si gana", "bold", .56, { morale: 8, boardTrust: -8 }),
    decisiveOption(`${id}_identity`, "Confiar en el plan habitual", "calm", .43, { harmony: 6, boardTrust: 3 }),
  ] };
}

function materializeEvent(event: GameEvent, state: CareerState, rng: number): [GameEvent, number] {
  const season = state.season!;
  const sorted = [...season.scorers].sort((a, b) => b.goals - a.goals);
  let pick; [pick, rng] = randomInt(rng, 1, Math.min(3, sorted.length - 1));
  const player = sorted[pick]?.name ?? sorted[0].name; const topScorer = sorted[0].name;
  const currentClub = getClub(season.clubId).name; const formerClub = [...state.history].reverse().find((record) => record.club !== currentClub)?.club ?? "tu anterior club";
  const replace = (text: string) => text.replaceAll("{player}", player).replaceAll("{topScorer}", topScorer).replaceAll("{formerClub}", formerClub);
  return [{ ...event, title: replace(event.title), description: replace(event.description) }, rng];
}

function eligibleEvent(state: CareerState): GameEvent | undefined {
  const season = state.season!;
  if (season.eventCount >= 4 || season.week < 3) return undefined;
  const losses = season.form.filter((result) => result === "L").length;
  const hasFormerClub = state.history.some((record) => record.club !== getClub(season.clubId).name);
  const pool = EVENTS.filter((event) => (event.id !== "former_player_criticism" || hasFormerClub) && !season.seenEvents.includes(event.id) && (!state.eventHistory[event.id] || season.year - state.eventHistory[event.id] >= 6) && season.week >= event.minWeek && (
    event.condition === "any" || (event.condition === "crisis" && (losses >= 3 || season.pressure > 62)) ||
    (event.condition === "low_morale" && season.morale < 50) || (event.condition === "good_form" && season.form.filter((r) => r === "W").length >= 3)
  ));
  if (!pool.length) return undefined;
  const [roll, afterRoll] = nextRandom(state.rngState); state.rngState = afterRoll;
  const baseChance = .08 + Math.max(0, season.pressure - 50) / 450 + (season.week > season.totalWeeks - 5 ? .05 : 0);
  if (roll > baseChance) return undefined;
  const [pick, afterPick] = nextRandom(state.rngState); state.rngState = afterPick;
  const [result, finalRng] = materializeEvent(pool[Math.floor(pick * pool.length)], state, state.rngState); state.rngState = finalRng;
  return result;
}

export function advanceUntilNextMeaningfulMoment(input: CareerState): MeaningfulMoment {
  let state = structuredClone(input);
  if (state.season && !state.season.preseasonDone) {
    state.season.preseasonDone = true;
    return { type: "event", event: transferEvent(state), state };
  }
  while (state.season && state.season.week < state.season.totalWeeks) {
    const decisive = keyMatchEvent(state);
    if (decisive) {
      state.season = { ...state.season, eventCount: state.season.eventCount + 1, seenEvents: [...state.season.seenEvents, decisive.id] };
      state.eventHistory[decisive.id] = state.season.year;
      return { type: "event", event: decisive, state };
    }
    state = simulateMatch(state);
    const transferResult = resolvePendingTransfer(state);
    if (transferResult) return { type: "delayed_outcome", ...transferResult };
    const event = eligibleEvent(state);
    if (event) {
      state.season = { ...state.season!, eventCount: state.season!.eventCount + 1, seenEvents: [...state.season!.seenEvents, event.id] };
      state.eventHistory[event.id] = state.season.year;
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

function resolvePendingTransfer(input: CareerState): { state: CareerState; outcome: EventOutcome } | undefined {
  const pending = input.season!.pendingTransfers.find((item) => !item.resolved && item.triggerWeek <= input.season!.week);
  if (!pending) return undefined;
  let state = structuredClone(input); let roll; [roll, state.rngState] = nextRandom(state.rngState);
  const successCutoff = .48 - pending.risk / 4 + pending.fitBonus; const neutralCutoff = Math.min(.9, successCutoff + .32);
  let outcome: EventOutcome;
  if (roll < successCutoff) outcome = { id: `${pending.id}_impact`, title: `${pending.playerName} se ganó un lugar`, description: `Después de ${state.season!.week} fechas, el refuerzo se adaptó y ya mejora al equipo.`, baseProbability: successCutoff, tone: "positive", effects: { strength: pending.strength, morale: 5, performance: .025 } };
  else if (roll < neutralCutoff) outcome = { id: `${pending.id}_slow`, title: `${pending.playerName} todavía está en deuda`, description: "Mostró algunas condiciones, pero su adaptación está llevando más tiempo del esperado.", baseProbability: .32, tone: "neutral", effects: { strength: Math.max(1, pending.strength - 2) } };
  else outcome = { id: `${pending.id}_miss`, title: `${pending.playerName} no logra funcionar`, description: "Pasaron varios partidos y el refuerzo sigue sin encajar. La dirigencia cuestiona tu elección y la inversión ya genera críticas.", baseProbability: 1 - neutralCutoff, tone: "negative", effects: { pressure: 7, boardTrust: -11 } };
  state = applyEffects(state, outcome.effects);
  state.season!.pendingTransfers = state.season!.pendingTransfers.map((item) => item.id === pending.id ? { ...item, resolved: true } : item);
  state.season!.moments.push(`Evaluación de ${pending.playerName}: ${outcome.title}.`);
  return { state, outcome };
}

export function resolveEvent(input: CareerState, event: GameEvent, chosenOption: EventOption) {
  let state = structuredClone(input);
  if (event.category === "transfer" && chosenOption.playerName) {
    const candidate = state.season!.transferCandidates.find((player) => player.name === chosenOption.playerName)!;
    let delay; [delay, state.rngState] = randomInt(state.rngState, 4, 7);
    const defensiveNeed = state.season!.squadReport.defense < Math.min(state.season!.squadReport.attack, state.season!.squadReport.midfield);
    const defensiveSigning = /^(DFC|ARQ|LAT|LI|LD|DEF)$/i.test(candidate.position);
    const fitBonus = defensiveNeed && defensiveSigning ? .16 : 0;
    if (!defensiveSigning) state.season!.scorers.push({ name: candidate.name, position: candidate.position, goals: 0, weight: 3 });
    state.season!.pendingTransfers.push({ id: candidate.id, playerName: candidate.name, triggerWeek: state.season!.week + delay, strength: candidate.strength, risk: candidate.risk, fitBonus, resolved: false });
    const outcome: EventOutcome = { id: `${candidate.id}_signed`, title: `${candidate.name} ya es refuerzo`, description: `Firmó su contrato y se sumó al plantel. Su evaluación llegará después de varios partidos, no hoy.`, baseProbability: 1, tone: "neutral", effects: {} };
    return { state, outcome };
  }
  let roll; [roll, state.rngState] = nextRandom(state.rngState);
  const leadership = (state.manager.leadership - 50) / 500; const pressure = (state.season!.pressure - 50) / 600;
  const adjusted = chosenOption.outcomes.map((outcome) => ({ ...outcome, p: Math.max(.04, outcome.baseProbability + (outcome.tone === "positive" ? leadership - pressure : outcome.tone === "negative" ? pressure - leadership : 0)) }));
  const total = adjusted.reduce((sum, item) => sum + item.p, 0); let cursor = 0;
  const chosen = adjusted.find((item) => (cursor += item.p / total) >= roll) ?? adjusted.at(-1)!;
  state = applyEffects(state, chosen.effects);
  if (event.category === "partido_trascendental" && event.matchTarget && chosen.matchResult) {
    const before = structuredClone(state.season!);
    state = event.matchTarget.type === "cup" && event.matchTarget.cupName
      ? simulateMatch(state, undefined, { name: event.matchTarget.cupName, result: chosen.matchResult })
      : simulateMatch(state, chosen.matchResult);
    const after = state.season!; let detail: string;
    if (event.matchTarget.type === "cup" && event.matchTarget.cupName) {
      const cup = after.cups.find((item) => item.name === event.matchTarget!.cupName)!;
      detail = cup.status === "eliminated" ? `${event.matchTarget.label}: el equipo quedó eliminado.` : cup.status === "champion" ? `${event.matchTarget.label}: ¡el equipo salió campeón!` : `${event.matchTarget.label}: el equipo avanzó a ${cup.stage}.`;
    } else {
      detail = `${event.matchTarget.label}: ${after.goalsFor - before.goalsFor}-${after.goalsAgainst - before.goalsAgainst}.`;
    }
    const resolved = { ...chosen, title: chosen.matchResult === "W" ? "Victoria en el partido trascendental" : chosen.matchResult === "D" ? "Empate en una noche decisiva" : "Derrota en el partido clave", description: `${chosen.description} ${detail}` };
    state.season!.moments.push(`${event.title}: ${resolved.title}.`);
    return { state, outcome: resolved };
  }
  if (chosenOption.playerName && !state.season!.scorers.some((player) => player.name === chosenOption.playerName)) {
    const position = state.season!.transferCandidates.find((player) => player.name === chosenOption.playerName)?.position ?? "REF";
    if (!/^(ARQ|DFC|LAT|LI|LD|DEF)$/i.test(position)) state.season!.scorers.push({ name: chosenOption.playerName, position, goals: 0, weight: 3 });
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
  const state = structuredClone(input); const season = state.season!; const baseClub = getClub(season.clubId);
  const club = { ...baseClub, division: season.division, tier: DIVISION_TIER[season.division] ?? baseClub.tier, objective: season.division === baseClub.division ? baseClub.objective : "Evitar el descenso" };
  const promotedTo = season.position <= 2 ? NEXT_DIVISION[season.division] : undefined;
  const promoted = Boolean(promotedTo); const champion = season.position === 1; const objectiveMet = season.position <= objectiveTarget(club.objective);
  const libertadoresChampion = season.cups.some((cup) => cup.name === "Copa Libertadores" && cup.status === "champion");
  const copaArgentinaChampion = season.cups.some((cup) => cup.name === "Copa Argentina" && cup.status === "champion");
  const sudamericanaChampion = season.cups.some((cup) => cup.name === "Copa Sudamericana" && cup.status === "champion");
  const outcome = champion ? "CAMPEÓN" : promoted ? "ASCENSO" : season.position <= 6 ? "Gran campaña" : season.position >= 16 ? "Permanencia sufrida" : objectiveMet ? "Objetivo cumplido" : "Objetivo incumplido";
  const reputationDelta = Math.round((objectiveTarget(club.objective) - season.position) * 5 + (promoted ? 55 : 0) + (champion ? 45 : 0));
  const topScorers = [...season.scorers].sort((a, b) => b.goals - a.goals).slice(0, 4);
  const seasonsAtClub = (state.clubSeasons[club.id] ?? 0) + 1; state.clubSeasons[club.id] = seasonsAtClub;
  const idolDelta = 3 + Math.min(10, seasonsAtClub * 2) + (objectiveMet ? 6 : -10) + (champion ? 15 : 0) + (libertadoresChampion ? 14 : 0);
  const projectedIdolatry = clamp((state.clubIdolatry[club.id] ?? 0) + idolDelta); state.clubIdolatry[club.id] = projectedIdolatry;
  const wonCup = season.cups.some((cup) => cup.status === "champion");
  const terminationRisk = clamp(.14 + (objectiveMet ? -.13 : .36) + (50 - season.boardTrust) * .008 - projectedIdolatry * .003 + (season.pressure - 50) * .0025 - (champion ? .25 : 0) - (wonCup ? .12 : 0), .03, .92);
  let boardRoll; [boardRoll, state.rngState] = nextRandom(state.rngState); const contractTerminated = boardRoll < terminationRisk;
  const boardDecision = contractTerminated
    ? objectiveMet ? "La relación con la junta quedó rota y el azar político pesó más que el objetivo cumplido." : "El objetivo incumplido y la relación con la junta inclinaron la decisión hacia la rescisión."
    : objectiveMet ? "La junta ratificó la continuidad del proyecto." : "La idolatría, el respaldo interno y la evaluación global evitaron la rescisión pese al objetivo incumplido.";
  const record: SeasonRecord = {
    year: season.year, club: club.name, division: season.division, position: season.position, outcome, objectiveMet, topScorers, promotedTo, cups: season.cups, contractTerminated, terminationRisk, boardDecision,
    played: season.played, won: season.won, drawn: season.drawn, lost: season.lost,
    story: season.moments.length ? `Una temporada marcada por ${season.moments.slice(0, 2).join(" ")} El equipo terminó ${season.position}°${promotedTo ? ` y ascendió a ${promotedTo}` : ""}.` : `Una campaña sin grandes crisis: ${club.name} terminó ${season.position}°${promotedTo ? ` y ascendió a ${promotedTo}` : ""}.`,
  };
  state.manager.reputation = clamp(state.manager.reputation + reputationDelta, 0, 1000); state.manager.age++; state.history.push(record);
  if (promotedTo) state.clubDivisions[club.id] = promotedTo;
  if (champion && season.division === "Liga Profesional") state.achievements.leagueTitles++;
  if (copaArgentinaChampion) state.achievements.copaArgentinaTitles++;
  if (libertadoresChampion) state.achievements.libertadoresTitles++;
  if (sudamericanaChampion) state.achievements.sudamericanaTitles++;
  state.promotions += promoted ? 1 : 0; state.trophies += (champion ? 1 : 0) + season.cups.filter((cup) => cup.status === "champion").length; delete state.season;
  if (contractTerminated) delete state.clubId;
  return state;
}

export function canMoveToEurope(state: CareerState) {
  return state.achievements.leagueTitles > 0 && state.achievements.libertadoresTitles > 0;
}

export function endCareer(input: CareerState, reason: "retirement" | "europe"): CareerState {
  const state = structuredClone(input); const activeClub = state.season?.clubId ?? state.clubId; const club = activeClub ? getClub(activeClub).name : state.history.at(-1)?.club;
  const year = state.season?.year ?? state.history.at(-1)?.year ?? 2026;
  state.ending = reason === "europe"
    ? { reason, year, age: state.manager.age, club, title: "El llamado de Europa", description: "Después de conquistar el campeonato argentino y la Copa Libertadores, llegó la propuesta que completa tu recorrido. Dejás el país habiéndolo ganado todo." }
    : { reason, year, age: state.manager.age, club, title: "El último silbato", description: "Decidiste cerrar tu carrera por voluntad propia. Los resultados quedan atrás; la historia y la huella en cada club permanecen." };
  delete state.season; delete state.clubId;
  return state;
}
