import assert from "node:assert/strict";
import test from "node:test";
import { createPlayerCareer, finishPlayerSeason, retirePlayer, startPlayerSeason } from "../src/game-engine/playerCareerEngine.ts";
import type { PlayerCareerState, PlayerDivision } from "../src/domain/playerCareer.ts";

const player = { name: "Test Player", age: 18, position: "DEL" as const, preferredFoot: "Derecha" as const };

function completeExcellentSeason(state: PlayerCareerState) {
  assert.ok(state.season);
  state.season.completed = true;
  state.season.round = state.season.totalRounds;
  state.season.appearances = 24;
  state.season.starts = 22;
  state.season.minutes = 1900;
  state.season.goals = 12;
  state.season.assists = 7;
  state.season.ratingTotal = 24 * 7.5;
  return finishPlayerSeason(state);
}

test("player career always begins with Primera D offers", () => {
  const state = createPlayerCareer(player, 2026);
  assert.equal(state.offers.length, 3);
  assert.ok(state.offers.every((offer) => offer.club.division === "Primera D"));
});

test("an excellent player can climb every step and continue after reaching Primera", () => {
  let state = createPlayerCareer(player, 77);
  state = startPlayerSeason(state, state.offers[0].club.id);
  const path: PlayerDivision[] = ["Primera C", "Primera B", "Primera Nacional", "Liga Profesional"];
  for (const division of path) {
    state = completeExcellentSeason(state);
    const offer = state.offers.find((item) => item.club.division === division);
    assert.ok(offer, `missing offer from ${division}`);
    state = startPlayerSeason(state, offer.club.id);
  }
  assert.equal(state.reachedFirstDivision, true);
  assert.equal(state.season?.club.division, "Liga Profesional");
  state = completeExcellentSeason(state);
  assert.equal(state.retirement, undefined);
  assert.ok(state.offers.some((offer) => offer.club.division === "Liga Profesional"));
});

test("retirement can be voluntary or triggered by age", () => {
  let voluntary = createPlayerCareer(player, 91);
  voluntary = startPlayerSeason(voluntary, voluntary.offers[0].club.id);
  voluntary = retirePlayer(voluntary);
  assert.equal(voluntary.retirement?.reason, "voluntary");

  let aged = createPlayerCareer({ ...player, age: 24 }, 92);
  aged = startPlayerSeason(aged, aged.offers[0].club.id);
  aged.player.age = 36;
  aged = completeExcellentSeason(aged);
  assert.equal(aged.retirement?.reason, "age");
  assert.equal(aged.player.age, 37);
});

