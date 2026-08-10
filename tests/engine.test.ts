import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import test from "node:test";
import { advanceUntilNextMeaningfulMoment, canMoveToEurope, confirmSeasonTactics, createCareer, endCareer, finishSeason, generateOffers, resolveEvent, startSeason } from "../src/game-engine/careerEngine.ts";
import { EVENTS } from "../src/data/events.ts";
import { getClub } from "../src/data/clubs.ts";
import { FIRST_NAMES, LAST_NAMES } from "../src/data/players.ts";

const manager = { name: "Test DT", age: 38, nationality: "Argentina", supportedClub: "Ninguno", philosophy: "Equilibrado" as const };

function autoplay(seed: number) {
  let state = startSeason(createCareer(manager, seed), "ituzaingo");
  let guard = 0;
  while (state.season && guard++ < 20) {
    const moment = advanceUntilNextMeaningfulMoment(state);
    state = moment.state;
    if (moment.type === "event") state = resolveEvent(state, moment.event, moment.event.options[guard % moment.event.options.length]).state;
    else if (moment.type === "season_finished") return finishSeason(state);
  }
  throw new Error("Season did not finish");
}

test("a full season finishes with a valid table and record", () => {
  const state = autoplay(20260810);
  assert.equal(state.history.length, 1);
  assert.ok(state.history[0].position >= 1 && state.history[0].position <= 18);
  assert.equal(state.history[0].played, state.history[0].won + state.history[0].drawn + state.history[0].lost);
});

test("a season begins with a four-player transfer decision", () => {
  const state = startSeason(createCareer(manager, 123), "ituzaingo");
  const moment = advanceUntilNextMeaningfulMoment(state);
  assert.equal(moment.type, "event");
  if (moment.type === "event") {
    assert.equal(moment.event.category, "transfer");
    assert.equal(moment.event.options.length, 4);
    assert.equal(new Set(moment.event.options.map((item) => item.text)).size, 4);
    assert.ok(moment.event.options.every((item) => !/US\$|\$\d|K\b/.test(item.text)));
  }
});

test("board relationship and idolatry change dismissal risk", () => {
  const finishProfile = (boardTrust: number, idolatry: number, pressure: number) => {
    const career = createCareer(manager, 303); career.clubIdolatry.ituzaingo = idolatry;
    let state = startSeason(career, "ituzaingo"); state.season!.position = 18; state.season!.boardTrust = boardTrust; state.season!.pressure = pressure;
    return finishSeason(state).history[0];
  };
  const protectedIdol = finishProfile(92, 90, 15); const isolatedManager = finishProfile(8, 0, 90);
  assert.ok(protectedIdol.terminationRisk < isolatedManager.terminationRisk);
  let retainedDespiteMissing = false;
  for (let seed = 100000; seed <= 100020; seed++) { const career = createCareer(manager, seed); career.clubIdolatry.ituzaingo = 90; let state = startSeason(career, "ituzaingo"); state.season!.position = 18; state.season!.boardTrust = 92; state.season!.pressure = 15; retainedDespiteMissing ||= !finishSeason(state).history[0].contractTerminated; }
  assert.equal(retainedDespiteMissing, true);
});

test("a failed signing damages the relationship with the board", () => {
  let foundFailure = false;
  for (let seed = 1; seed < 80 && !foundFailure; seed++) {
    let state = startSeason(createCareer(manager, seed), "ituzaingo"); const market = advanceUntilNextMeaningfulMoment(state); if (market.type !== "event") continue;
    state = resolveEvent(market.state, market.event, market.event.options[0]).state;
    for (let guard = 0; guard < 8; guard++) {
      const moment = advanceUntilNextMeaningfulMoment(state); state = moment.state;
      if (moment.type === "delayed_outcome") { if (moment.outcome.tone === "negative") { assert.ok((state.season?.boardTrust ?? 100) <= 50); foundFailure = true; } break; }
      if (moment.type === "event") state = resolveEvent(state, moment.event, moment.event.options[0]).state;
    }
  }
  assert.equal(foundFailure, true);
});

test("winning Copa Argentina grants the next Libertadores place", () => {
  let state = startSeason(createCareer(manager, 404), "ituzaingo"); state.season!.position = 5; state.season!.cups[0].status = "champion"; state.season!.cups[0].stage = "CAMPEÓN"; state = finishSeason(state);
  const next = startSeason(state, "ituzaingo");
  assert.ok(next.season?.cups.some((cup) => cup.name === "Copa Libertadores"));
});

test("trophy artwork is bundled locally", () => {
  for (const file of ["liga-profesional.png", "copa-argentina.png", "libertadores.png"]) assert.equal(existsSync(`public/trophies/${file}`), true);
});

test("transfer names vary between seasons", () => {
  const career = createCareer(manager, 991);
  const first = startSeason(career, "ituzaingo").season!.transferCandidates.map((player) => player.name);
  career.history.push({ year: 2026, club: "Ituzaingó", division: "Primera C", position: 8, outcome: "Objetivo cumplido", played: 34, won: 12, drawn: 10, lost: 12, story: "", objectiveMet: true, topScorers: [], cups: [], contractTerminated: false, terminationRisk: .1, boardDecision: "Continuidad" });
  const second = startSeason(career, "ituzaingo").season!.transferCandidates.map((player) => player.name);
  assert.notDeepEqual(first, second);
});

test("a transfer is evaluated only after several matches", () => {
  let state = startSeason(createCareer(manager, 5150), "ituzaingo");
  const market = advanceUntilNextMeaningfulMoment(state);
  assert.equal(market.type, "event");
  if (market.type !== "event") return;
  const signing = resolveEvent(market.state, market.event, market.event.options[0]);
  state = signing.state;
  assert.equal(signing.outcome.tone, "neutral");
  assert.equal(state.season!.squadStrengthModifier, 0);
  let evaluation = advanceUntilNextMeaningfulMoment(state); let guard = 0;
  while (evaluation.type === "event" && guard++ < 8) {
    state = resolveEvent(evaluation.state, evaluation.event, evaluation.event.options[0]).state;
    evaluation = advanceUntilNextMeaningfulMoment(state);
  }
  assert.equal(evaluation.type, "delayed_outcome");
  assert.ok((evaluation.state.season?.week ?? 0) >= 4);
});

test("player names use broad first-name and surname pools", () => {
  assert.ok(FIRST_NAMES.length >= 50);
  assert.ok(LAST_NAMES.length >= 55);
  const first = startSeason(createCareer(manager, 710), "ituzaingo").season!.scorers.map((player) => player.name);
  const secondCareer = createCareer(manager, 710); secondCareer.history.push({ year: 2026, club: "Ituzaingó", division: "Primera C", position: 8, outcome: "Objetivo cumplido", played: 34, won: 12, drawn: 10, lost: 12, story: "", objectiveMet: true, topScorers: [], cups: [], contractTerminated: false, terminationRisk: .1, boardDecision: "Continuidad" });
  const second = startSeason(secondCareer, "ituzaingo").season!.scorers.map((player) => player.name);
  assert.notDeepEqual(first, second);
});

test("decisive match events resolve an actual match result", () => {
  let state = startSeason(createCareer(manager, 2027), "ituzaingo");
  const market = advanceUntilNextMeaningfulMoment(state); assert.equal(market.type, "event"); if (market.type !== "event") return;
  state = resolveEvent(market.state, market.event, market.event.options[0]).state;
  let found = false;
  for (let guard = 0; guard < 12 && state.season; guard++) {
    const moment = advanceUntilNextMeaningfulMoment(state); state = moment.state;
    if (moment.type === "event" && moment.event.category === "partido_trascendental") {
      assert.match(moment.event.title, / vs\. | contra /i);
      const playedBefore = state.season!.played; const resolution = resolveEvent(state, moment.event, moment.event.options[0]);
      assert.equal(resolution.state.season!.played, playedBefore + 1);
      assert.match(resolution.outcome.description, /\d+-\d+|avanzó|eliminado|campeón/i); found = true; break;
    }
    if (moment.type === "event") state = resolveEvent(state, moment.event, moment.event.options[0]).state;
  }
  assert.equal(found, true);
});

test("the catalog includes fictional bizarre Argentine-football incidents", () => {
  for (const id of ["locker_room_weapon", "player_fights_fan", "former_player_criticism", "wrong_kits", "locked_dressing_room", "assistant_red_card"]) assert.ok(EVENTS.some((event) => event.id === id));
  assert.equal(EVENTS.some((event) => /mascota/i.test(`${event.title} ${event.description}`)), false);
});

test("a promoted club starts the next season in the higher division", () => {
  let state = startSeason(createCareer(manager, 1810), "ituzaingo");
  state.season!.position = 1;
  state = finishSeason(state);
  assert.equal(state.clubDivisions.ituzaingo, "Primera B");
  const renewal = generateOffers(state).find((offer) => offer.kind === "renewal");
  assert.equal(renewal?.club.division, "Primera B");
  const nextSeason = startSeason(state, "ituzaingo");
  assert.equal(nextSeason.season?.division, "Primera B");
  assert.equal(nextSeason.season?.standings.length, 18);
  assert.ok(nextSeason.season?.standings.some((row) => row.id === "ituzaingo"));
});

test("standings contain all teams and keep valid row totals", () => {
  let state = startSeason(createCareer(manager, 456), "atlanta");
  const preseason = advanceUntilNextMeaningfulMoment(state);
  if (preseason.type === "event") state = resolveEvent(preseason.state, preseason.event, preseason.event.options[0]).state;
  const next = advanceUntilNextMeaningfulMoment(state);
  assert.equal(next.state.season?.standings.length, 18);
  for (const row of next.state.season?.standings ?? []) assert.equal(row.played, row.won + row.drawn + row.lost);
});

test("narrative catalog has distinct choices and no chapter suffixes", () => {
  assert.ok(EVENTS.length >= 30);
  assert.ok(EVENTS.every((item) => !/capítulo/i.test(item.title)));
  assert.ok(new Set(EVENTS.flatMap((item) => item.options.map((choice) => choice.text))).size > 45);
});

test("career events cannot repeat during four consecutive seasons", () => {
  let state = createCareer(manager, 2408); const seen = new Set<string>();
  for (let seasonIndex = 0; seasonIndex < 4; seasonIndex++) {
    state = startSeason(state, seasonIndex ? generateOffers(state)[0].club.id : "ituzaingo");
    let guard = 0;
    while (state.season && guard++ < 20) {
      const moment = advanceUntilNextMeaningfulMoment(state); state = moment.state;
      if (moment.type === "event") {
        if (moment.event.category !== "transfer") { assert.ok(!seen.has(moment.event.id)); seen.add(moment.event.id); }
        state = resolveEvent(state, moment.event, moment.event.options[0]).state;
      } else if (moment.type === "season_finished") { state = finishSeason(state); break; }
    }
  }
  assert.ok(seen.size >= 6);
});

test("offers rotate away from the previous market", () => {
  let state = createCareer(manager, 8008); state.clubId = "ituzaingo";
  state.history.push({ year: 2026, club: "Ituzaingó", division: "Primera C", position: 4, outcome: "Gran campaña", played: 34, won: 17, drawn: 8, lost: 9, story: "", objectiveMet: true, topScorers: [], cups: [], contractTerminated: false, terminationRisk: .1, boardDecision: "Continuidad" });
  const first = generateOffers(state);
  state = startSeason(state, first[0].club.id); state.season!.position = 5; state = finishSeason(state);
  const second = generateOffers(state);
  const oldOutsiders = new Set(first.filter((offer) => offer.club.id !== state.clubId).map((offer) => offer.club.id));
  assert.ok(second.filter((offer) => offer.kind === "new").every((offer) => !oldOutsiders.has(offer.club.id)));
});

test("club ratings reflect hierarchy without determining results", () => {
  assert.ok(getClub("river").squadStrength >= 90);
  assert.ok(getClub("boca").squadStrength >= 90);
  assert.ok(getClub("racing").squadStrength < getClub("river").squadStrength);
});

test("formation and approach create a hidden performance modifier", () => {
  const base = startSeason(createCareer(manager, 4310), "river");
  const aligned = confirmSeasonTactics(base, "Ofensivo", "4-3-3");
  const mismatched = confirmSeasonTactics(base, "Defensivo", "3-5-2");
  assert.equal(aligned.season?.tacticsConfirmed, true);
  assert.ok((aligned.season?.tacticalModifier ?? 0) > (mismatched.season?.tacticalModifier ?? 0));
});

test("qualified teams play domestic and international cups", () => {
  const river = startSeason(createCareer(manager, 410), "river");
  assert.deepEqual(river.season?.cups.map((cup) => cup.name), ["Copa Argentina", "Copa Libertadores"]);
  const lowerDivision = startSeason(createCareer(manager, 410), "ituzaingo");
  assert.deepEqual(lowerDivision.season?.cups.map((cup) => cup.name), ["Copa Argentina"]);
  const finished = autoplay(411);
  assert.ok(finished.history[0].cups.every((cup) => cup.played > 0 && cup.status !== "active"));
});

test("scorers are attacking players and never exceed fifteen goals", () => {
  const state = autoplay(2027); const scorers = state.history[0].topScorers;
  assert.ok(scorers.every((player) => player.goals <= 12));
  assert.ok(scorers.reduce((sum, player) => sum + player.goals, 0) <= 42);
  assert.ok(scorers.every((player) => !/^(ARQ|DFC|LAT|LI|LD|DEF)$/i.test(player.position)));
});

test("idolatry persists by club and lowers starting pressure", () => {
  const plain = startSeason(createCareer(manager, 91), "ituzaingo");
  const career = createCareer(manager, 91); career.clubIdolatry.ituzaingo = 70;
  let idol = startSeason(career, "ituzaingo");
  assert.equal(idol.season?.idolatry, 70);
  assert.ok((idol.season?.pressure ?? 100) < (plain.season?.pressure ?? 0));
  idol.season!.position = 5; idol = finishSeason(idol);
  assert.ok(idol.clubIdolatry.ituzaingo > 70);
});

test("career can end by retirement or a move to Europe", () => {
  let state = createCareer(manager, 100); const retired = endCareer(state, "retirement");
  assert.equal(retired.ending?.reason, "retirement");
  state.achievements = { leagueTitles: 1, copaArgentinaTitles: 0, libertadoresTitles: 1, sudamericanaTitles: 0 };
  assert.equal(canMoveToEurope(state), true);
  assert.equal(endCareer(state, "europe").ending?.reason, "europe");
});

test("the AFA approach has distinct accept and reject consequences", () => {
  const event = EVENTS.find((item) => item.id === "afa_fixed_match"); assert.ok(event);
  assert.equal(event?.options.length, 3);
  assert.ok(event?.options.some((choice) => choice.id === "accept_fix" && choice.outcomes.some((outcome) => (outcome.effects.morale ?? 0) < 0)));
  assert.ok(event?.options.some((choice) => choice.id === "reject_fix" && choice.outcomes.some((outcome) => (outcome.effects.performance ?? 0) < 0)));
});

test("missing the objective terminates the contract", () => {
  let state = startSeason(createCareer(manager, 77), "ituzaingo"); state.season!.position = 18; state = finishSeason(state);
  assert.equal(state.history[0].contractTerminated, true);
  assert.equal(state.clubId, undefined);
  assert.ok(generateOffers(state).every((offer) => offer.kind === "new"));
});

test("a defensive signing gets a fit bonus when defense is the weakness", () => {
  let state = startSeason(createCareer(manager, 123), "ituzaingo");
  state.season!.squadReport = { ...state.season!.squadReport, attack: 70, midfield: 70, defense: 40 };
  const market = advanceUntilNextMeaningfulMoment(state); assert.equal(market.type, "event"); if (market.type !== "event") return;
  const defender = market.event.options.find((option) => /· (DFC|ARQ|LAT) ·/.test(option.text)); assert.ok(defender);
  state = resolveEvent(market.state, market.event, defender!).state;
  assert.equal(state.season!.pendingTransfers[0].fitBonus, .16);
});

test("successful campaign includes renewal and upward offers", () => {
  const state = createCareer(manager, 789);
  state.clubId = "ituzaingo";
  state.history.push({ year: 2026, club: "Ituzaingó", division: "Primera C", position: 3, outcome: "Gran campaña", played: 34, won: 18, drawn: 8, lost: 8, story: "Buena campaña", objectiveMet: true, topScorers: [], cups: [], contractTerminated: false, terminationRisk: .1, boardDecision: "Continuidad" });
  const offers = generateOffers(state);
  assert.equal(offers.length, 3);
  assert.ok(offers.some((offer) => offer.kind === "renewal" && offer.club.id === "ituzaingo"));
  assert.ok(offers.some((offer) => offer.club.reputation > 82));
});

test("same seed reproduces the same season", () => {
  assert.deepEqual(autoplay(1978).history, autoplay(1978).history);
});

test("different seeds can diverge", () => {
  assert.notDeepEqual(autoplay(1978).history, autoplay(1986).history);
});

test("one thousand automated seasons do not block", () => {
  for (let seed = 1; seed <= 1000; seed++) assert.equal(autoplay(seed).history.length, 1);
});
