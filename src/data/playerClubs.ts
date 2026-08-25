import { CLUBS } from "./clubs.ts";
import type { PlayerClub, PlayerDivision } from "../domain/playerCareer.ts";

export const PLAYER_DIVISION_PATH: PlayerDivision[] = ["Primera D", "Primera C", "Primera B", "Primera Nacional", "Liga Profesional"];

export const PRIMERA_D_CLUBS: PlayerClub[] = [
  { id: "atlas_d", name: "Atlas", shortName: "ATL", division: "Primera D", tier: 6, strength: 38, region: "General Rodríguez" },
  { id: "ballester_d", name: "Central Ballester", shortName: "CBA", division: "Primera D", tier: 6, strength: 36, region: "José León Suárez" },
  { id: "centro_espanol_d", name: "Centro Español", shortName: "CES", division: "Primera D", tier: 6, strength: 37, region: "Villa Sarmiento" },
  { id: "lugano_d", name: "Lugano", shortName: "LUG", division: "Primera D", tier: 6, strength: 39, region: "Tapiales" },
  { id: "paraguayo_d", name: "Deportivo Paraguayo", shortName: "PAR", division: "Primera D", tier: 6, strength: 35, region: "González Catán" },
  { id: "juventud_unida_d", name: "Juventud Unida", shortName: "JUV", division: "Primera D", tier: 6, strength: 38, region: "San Miguel" },
  { id: "mercedes_d", name: "Mercedes", shortName: "MER", division: "Primera D", tier: 6, strength: 40, region: "Mercedes" },
  { id: "muniz_d", name: "Muñiz", shortName: "MUÑ", division: "Primera D", tier: 6, strength: 37, region: "San Miguel" },
];

export function playerClubsForDivision(division: PlayerDivision): PlayerClub[] {
  if (division === "Primera D") return PRIMERA_D_CLUBS;
  return CLUBS.filter((club) => club.division === division).map((club) => ({
    id: club.id,
    name: club.name,
    shortName: club.shortName,
    division,
    tier: club.tier,
    strength: club.squadStrength,
    region: club.region,
  }));
}

export function nextPlayerDivision(division: PlayerDivision) {
  return PLAYER_DIVISION_PATH[PLAYER_DIVISION_PATH.indexOf(division) + 1];
}

