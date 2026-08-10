import assert from "node:assert/strict";
import test from "node:test";
import { advanceUntilNextMeaningfulMoment, createCareer, finishSeason, generateOffers, resolveEvent, startSeason } from "../src/game-engine/careerEngine.ts";
import { EVENTS } from "../src/data/events.ts";

const manager = { name: "Test DT", age: 38, nationality: "Argentina", supportedClub: "Ninguno", philosophy: "Equilibrado" as const };

function autoplay(seed: number) {
  let state = startSeason(createCareer(manager, seed), "ituzaingo");
  let guard = 0;
  while (state.season && guard++ < 20) {
    const moment = advanceUntilNextMeaningfulMoment(state);
    state = moment.state;
    if (moment.type === "event") state = resolveEvent(state, moment.event, moment.event.options[guard % moment.event.options.length]).state;
    else return finishSeason(state);
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
  }
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
  assert.ok(EVENTS.length >= 18);
  assert.ok(EVENTS.every((item) => !/capítulo/i.test(item.title)));
  assert.ok(new Set(EVENTS.flatMap((item) => item.options.map((choice) => choice.text))).size > 45);
});

test("successful campaign includes renewal and upward offers", () => {
  const state = createCareer(manager, 789);
  state.clubId = "ituzaingo";
  state.history.push({ year: 2026, club: "Ituzaingó", division: "Primera C", position: 3, outcome: "Gran campaña", played: 34, won: 18, drawn: 8, lost: 8, story: "Buena campaña", objectiveMet: true, topScorers: [] });
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
