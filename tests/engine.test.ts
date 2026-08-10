import assert from "node:assert/strict";
import test from "node:test";
import { advanceUntilNextMeaningfulMoment, createCareer, finishSeason, resolveEvent, startSeason } from "../src/game-engine/careerEngine.ts";

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

test("same seed reproduces the same season", () => {
  assert.deepEqual(autoplay(1978).history, autoplay(1978).history);
});

test("different seeds can diverge", () => {
  assert.notDeepEqual(autoplay(1978).history, autoplay(1986).history);
});

test("one hundred automated seasons do not block", () => {
  for (let seed = 1; seed <= 100; seed++) assert.equal(autoplay(seed).history.length, 1);
});
