import type { Club } from "../domain/game.ts";

// Real club identities with deliberately fictional, game-balanced ratings.
export const CLUBS: Club[] = [
  { id: "ituzaingo", name: "Ituzaingó", shortName: "ITU", division: "Primera C", tier: 5, region: "Buenos Aires", reputation: 82, squadStrength: 45, fanPressure: 52, boardPressure: 40, budget: 180000, objective: "Mitad de tabla", rivalId: "midland" },
  { id: "midland", name: "Ferrocarril Midland", shortName: "MID", division: "Primera C", tier: 5, region: "Buenos Aires", reputation: 88, squadStrength: 48, fanPressure: 55, boardPressure: 46, budget: 210000, objective: "Entrar al Reducido", rivalId: "ituzaingo" },
  { id: "lamadrid", name: "General Lamadrid", shortName: "LAM", division: "Primera C", tier: 5, region: "Buenos Aires", reputation: 72, squadStrength: 43, fanPressure: 38, boardPressure: 35, budget: 150000, objective: "Evitar el descenso" },
  { id: "germinal", name: "Germinal", shortName: "GER", division: "Federal A", tier: 4, region: "Chubut", reputation: 91, squadStrength: 48, fanPressure: 37, boardPressure: 34, budget: 240000, objective: "Evitar el descenso" },
  { id: "sol_de_mayo", name: "Sol de Mayo", shortName: "SOL", division: "Federal A", tier: 4, region: "Río Negro", reputation: 86, squadStrength: 46, fanPressure: 35, boardPressure: 39, budget: 225000, objective: "Permanecer" },
  { id: "douglas", name: "Douglas Haig", shortName: "DOU", division: "Federal A", tier: 4, region: "Pergamino", reputation: 121, squadStrength: 55, fanPressure: 66, boardPressure: 57, budget: 390000, objective: "Pelear el ascenso" },
  { id: "atlanta", name: "Atlanta", shortName: "ATL", division: "Primera Nacional", tier: 2, region: "CABA", reputation: 190, squadStrength: 62, fanPressure: 72, boardPressure: 68, budget: 820000, objective: "Entrar al Reducido", rivalId: "chacarita" },
  { id: "chacarita", name: "Chacarita Juniors", shortName: "CHA", division: "Primera Nacional", tier: 2, region: "San Martín", reputation: 205, squadStrength: 64, fanPressure: 78, boardPressure: 71, budget: 900000, objective: "Pelear el ascenso", rivalId: "atlanta" },
  { id: "quilmes", name: "Quilmes", shortName: "QUI", division: "Primera Nacional", tier: 2, region: "Quilmes", reputation: 225, squadStrength: 67, fanPressure: 82, boardPressure: 76, budget: 1100000, objective: "Ascender" },
  { id: "lanus", name: "Lanús", shortName: "LAN", division: "Liga Profesional", tier: 1, region: "Lanús", reputation: 420, squadStrength: 77, fanPressure: 77, boardPressure: 73, budget: 4200000, objective: "Clasificar a una copa" },
  { id: "racing", name: "Racing Club", shortName: "RAC", division: "Liga Profesional", tier: 1, region: "Avellaneda", reputation: 680, squadStrength: 86, fanPressure: 94, boardPressure: 90, budget: 10500000, objective: "Pelear el campeonato" },
  { id: "river", name: "River Plate", shortName: "RIV", division: "Liga Profesional", tier: 1, region: "CABA", reputation: 900, squadStrength: 92, fanPressure: 98, boardPressure: 96, budget: 18000000, objective: "Ser campeón" },
];

export const getClub = (id: string) => CLUBS.find((club) => club.id === id) ?? CLUBS[0];
