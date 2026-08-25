import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { createPlayerCareer, finishPlayerSeason, playPlayerBlock, resolvePlayerEvent, retirePlayer, startPlayerSeason } from "../src/game-engine/playerCareerEngine.ts";
import { PLAYER_EVENTS } from "../src/data/playerEvents.ts";
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
  assert.ok(state.offers.every((offer) => offer.club.crestId));
  for (const offer of state.offers) {
    assert.ok(existsSync(join(process.cwd(), "public", "crests", `${offer.club.crestId}.png`)), `missing crest for ${offer.club.name}`);
  }
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

test("folklore events always offer meaningful probabilistic choices", () => {
  assert.ok(PLAYER_EVENTS.length >= 10);
  for (const event of PLAYER_EVENTS) {
    assert.equal(event.options.length, 3, event.id);
    for (const choice of event.options) {
      assert.ok(choice.successChance > 0 && choice.successChance < 1);
      assert.ok(Object.keys(choice.outcomes.success.effects).length > 0);
      assert.ok(Object.keys(choice.outcomes.failure.effects).length > 0);
      assert.notDeepEqual(choice.outcomes.success.effects, choice.outcomes.failure.effects);
    }
  }
});

test("event decisions can end well or badly and persist their repercussions", () => {
  let base = createPlayerCareer(player, 10);
  base = startPlayerSeason(base, base.offers[0].club.id);
  base.pendingEvent = structuredClone(PLAYER_EVENTS[0]);
  const tones = new Set<string>();
  for (const seed of [1, 1_000_000]) {
    const attempt = structuredClone(base);
    attempt.rngState = seed;
    const resolved = resolvePlayerEvent(attempt, "dar_la_cara");
    assert.equal(resolved.pendingEvent, undefined);
    assert.ok(resolved.lastEventOutcome);
    tones.add(resolved.lastEventOutcome.tone);
    assert.notEqual(resolved.player.reputation, attempt.player.reputation);
  }
  assert.deepEqual(tones, new Set(["positive", "negative"]));
});

test("played fixtures retain the opponent crest", () => {
  let state = createPlayerCareer(player, 404);
  state = startPlayerSeason(state, state.offers[0].club.id);
  state = playPlayerBlock(state);
  assert.ok(state.season?.recentMatches.length);
  assert.ok(state.season?.recentMatches.every((match) => match.opponentCrestId));
});
