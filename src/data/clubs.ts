import type { Club } from "../domain/game.ts";
import { DIVISION_TEAMS, DIVISION_TIER } from "./divisions.ts";

type ClubBase = Omit<Club, "attack" | "midfield" | "defense">;

const FEATURED_BASE: ClubBase[] = [
  { id: "ituzaingo", name: "Ituzaingó", shortName: "ITU", crestId: 265447, division: "Primera C", tier: 5, region: "Buenos Aires", reputation: 82, squadStrength: 45, fanPressure: 52, boardPressure: 40, budget: 180000, objective: "Mitad de tabla", rivalId: "midland" },
  { id: "midland", name: "Ferrocarril Midland", shortName: "MID", crestId: 270344, division: "Primera C", tier: 5, region: "Buenos Aires", reputation: 88, squadStrength: 48, fanPressure: 55, boardPressure: 46, budget: 210000, objective: "Entrar al Reducido", rivalId: "ituzaingo" },
  { id: "lamadrid", name: "General Lamadrid", shortName: "LAM", crestId: 266134, division: "Primera C", tier: 5, region: "Buenos Aires", reputation: 72, squadStrength: 43, fanPressure: 38, boardPressure: 35, budget: 150000, objective: "Evitar el descenso" },
  { id: "germinal", name: "Germinal", shortName: "GER", crestId: 464795, division: "Federal A", tier: 4, region: "Chubut", reputation: 91, squadStrength: 48, fanPressure: 37, boardPressure: 34, budget: 240000, objective: "Evitar el descenso" },
  { id: "sol_de_mayo", name: "Sol de Mayo", shortName: "SOL", crestId: 254166, division: "Federal A", tier: 4, region: "Río Negro", reputation: 86, squadStrength: 46, fanPressure: 35, boardPressure: 39, budget: 225000, objective: "Permanecer" },
  { id: "douglas", name: "Douglas Haig", shortName: "DOU", crestId: 76199, division: "Federal A", tier: 4, region: "Pergamino", reputation: 121, squadStrength: 55, fanPressure: 66, boardPressure: 57, budget: 390000, objective: "Pelear el ascenso" },
  { id: "atlanta", name: "Atlanta", shortName: "ATL", crestId: 53799, division: "Primera Nacional", tier: 2, region: "CABA", reputation: 190, squadStrength: 62, fanPressure: 72, boardPressure: 68, budget: 820000, objective: "Entrar al Reducido", rivalId: "chacarita" },
  { id: "chacarita", name: "Chacarita Juniors", shortName: "CHA", crestId: 3214, division: "Primera Nacional", tier: 2, region: "San Martín", reputation: 205, squadStrength: 64, fanPressure: 78, boardPressure: 71, budget: 900000, objective: "Pelear el ascenso", rivalId: "atlanta" },
  { id: "quilmes", name: "Quilmes", shortName: "QUI", crestId: 4936, division: "Primera Nacional", tier: 2, region: "Quilmes", reputation: 225, squadStrength: 67, fanPressure: 82, boardPressure: 76, budget: 1100000, objective: "Ascender" },
  { id: "lanus", name: "Lanús", shortName: "LAN", crestId: 3218, division: "Liga Profesional", tier: 1, region: "Lanús", reputation: 420, squadStrength: 84, fanPressure: 77, boardPressure: 73, budget: 4200000, objective: "Clasificar a una copa" },
  { id: "racing", name: "Racing Club", shortName: "RAC", crestId: 3215, division: "Liga Profesional", tier: 1, region: "Avellaneda", reputation: 680, squadStrength: 88, fanPressure: 94, boardPressure: 90, budget: 10500000, objective: "Pelear el campeonato" },
  { id: "river", name: "River Plate", shortName: "RIV", crestId: 3211, division: "Liga Profesional", tier: 1, region: "CABA", reputation: 900, squadStrength: 93, fanPressure: 98, boardPressure: 96, budget: 18000000, objective: "Ser campeón" },
];

const CURRENT_LINES: Record<string, [number, number, number]> = {
  river: [94, 93, 91], boca: [91, 90, 93], racing: [89, 88, 87], estudiantes: [85, 86, 86],
  lanus: [85, 84, 82], belgrano: [84, 83, 84], talleres: [85, 84, 82], central: [84, 83, 82],
  velez: [82, 84, 83], independiente: [82, 83, 82], argentinos: [81, 84, 80], san_lorenzo: [79, 81, 82], defensa: [80, 80, 78],
};

const featured = new Map(FEATURED_BASE.map((club) => [club.id, club]));
const hash = (text: string) => [...text].reduce((sum, char) => sum + char.charCodeAt(0) * 13, 0);
const regionFor = (division: string) => division === "Liga Profesional" ? "Argentina" : division === "Primera Nacional" ? "Interior y AMBA" : "Argentina";

export const CLUBS: Club[] = Object.entries(DIVISION_TEAMS).flatMap(([division, teams]) => teams.map((team) => {
  const base = featured.get(team.id);
  const strength = CURRENT_LINES[team.id] ? Math.round(CURRENT_LINES[team.id].reduce((a, b) => a + b, 0) / 3) : team.strength;
  const wobble = hash(team.id) % 5 - 2;
  const lines = CURRENT_LINES[team.id] ?? [strength + wobble, strength - wobble, strength + ((hash(team.id) % 3) - 1)];
  const tier = DIVISION_TIER[division];
  return {
    ...(base ?? {
      id: team.id, name: team.name, shortName: team.shortName, crestId: team.crestId, division, tier,
      region: regionFor(division), reputation: Math.round(strength * (tier === 1 ? 7 : tier === 2 ? 3.2 : 1.8)),
      squadStrength: strength, fanPressure: Math.min(94, 30 + strength * .62), boardPressure: Math.min(91, 28 + strength * .6),
      budget: Math.round((strength ** 3) * (6 - tier) * 3),
      objective: tier === 1 ? (strength >= 88 ? "Pelear el campeonato" : strength >= 82 ? "Clasificar a una copa" : "Mitad de tabla") : strength >= 64 ? "Pelear el ascenso" : strength >= 55 ? "Entrar al Reducido" : "Permanecer",
    }),
    division, tier, squadStrength: strength, attack: lines[0], midfield: lines[1], defense: lines[2],
  };
}));

export const getClub = (id: string) => CLUBS.find((club) => club.id === id) ?? CLUBS[0];
