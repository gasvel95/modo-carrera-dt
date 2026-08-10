export type Philosophy = "Ofensivo" | "Defensivo" | "Equilibrado" | "Motivador" | "Formador" | "Pragmático";

export type Manager = {
  name: string;
  age: number;
  nationality: string;
  supportedClub: string;
  philosophy: Philosophy;
  reputation: number;
  leadership: number;
  respect: number;
};

export type Club = {
  id: string;
  name: string;
  shortName: string;
  division: string;
  tier: number;
  region: string;
  reputation: number;
  squadStrength: number;
  attack: number;
  midfield: number;
  defense: number;
  fanPressure: number;
  boardPressure: number;
  budget: number;
  objective: string;
  crestId: number;
  rivalId?: string;
};

export type MatchResult = "W" | "D" | "L";
export type Effects = Partial<{
  morale: number;
  harmony: number;
  fanApproval: number;
  boardTrust: number;
  pressure: number;
  idolatry: number;
  respect: number;
  strength: number;
  performance: number;
}>;

export type EventOutcome = {
  id: string;
  title: string;
  description: string;
  baseProbability: number;
  tone: "positive" | "negative" | "neutral";
  effects: Effects;
  matchResult?: MatchResult;
};

export type EventOption = { id: string; text: string; approach: "bold" | "calm" | "safe"; outcomes: EventOutcome[]; playerName?: string };

export type StandingRow = {
  id: string;
  name: string;
  shortName: string;
  crestId: number;
  strength: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
};

export type PlayerScorer = { name: string; position: string; goals: number; weight: number };
export type TransferCandidate = { id: string; name: string; age: number; position: string; profile: string; cost: number; strength: number; risk: number };
export type PendingTransfer = { id: string; playerName: string; triggerWeek: number; strength: number; risk: number; fitBonus: number; resolved: boolean };
export type ClubOffer = { club: Club; kind: "renewal" | "new"; reason: string };
export type TacticalApproach = "Ofensivo" | "Equilibrado" | "Defensivo";
export type Formation = "4-3-3" | "4-2-3-1" | "4-4-2" | "3-5-2" | "5-3-2";
export type SquadReport = { attack: number; midfield: number; defense: number; strengths: string[]; weaknesses: string[] };
export type CupRun = {
  name: "Copa Argentina" | "Copa Libertadores" | "Copa Sudamericana";
  stage: string;
  status: "active" | "eliminated" | "champion";
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  roundIndex: number;
  nextWeek: number;
};

export type GameEvent = {
  id: string;
  category: string;
  level: "MEDIUM" | "MAJOR" | "CAREER_DEFINING";
  kicker: string;
  title: string;
  description: string;
  minWeek: number;
  condition: "any" | "crisis" | "good_form" | "low_morale";
  weight: number;
  options: EventOption[];
  matchTarget?: { type: "league" | "cup"; label: string; cupName?: CupRun["name"] };
};

export type Season = {
  year: number;
  clubId: string;
  division: string;
  week: number;
  totalWeeks: number;
  position: number;
  teams: number;
  points: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  form: MatchResult[];
  morale: number;
  harmony: number;
  fanApproval: number;
  boardTrust: number;
  pressure: number;
  performanceModifier: number;
  eventCount: number;
  seenEvents: string[];
  moments: string[];
  standings: StandingRow[];
  scorers: PlayerScorer[];
  transferCandidates: TransferCandidate[];
  preseasonDone: boolean;
  squadStrengthModifier: number;
  pendingTransfers: PendingTransfer[];
  squadReport: SquadReport;
  tacticalApproach?: TacticalApproach;
  formation?: Formation;
  tacticalModifier: number;
  tacticsConfirmed: boolean;
  cups: CupRun[];
};

export type SeasonRecord = {
  year: number;
  club: string;
  division: string;
  position: number;
  outcome: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  story: string;
  objectiveMet: boolean;
  topScorers: PlayerScorer[];
  promotedTo?: string;
  cups: CupRun[];
  contractTerminated: boolean;
  terminationRisk: number;
  boardDecision: string;
};

export type CareerEnding = {
  reason: "retirement" | "europe";
  year: number;
  age: number;
  club?: string;
  title: string;
  description: string;
};

export type CareerState = {
  version: 7;
  seed: number;
  rngState: number;
  manager: Manager;
  clubId?: string;
  season?: Season;
  history: SeasonRecord[];
  trophies: number;
  promotions: number;
  clubDivisions: Record<string, string>;
  eventHistory: Record<string, number>;
  offerHistory: Array<{ year: number; clubIds: string[] }>;
  clubIdolatry: Record<string, number>;
  clubSeasons: Record<string, number>;
  achievements: { leagueTitles: number; copaArgentinaTitles: number; libertadoresTitles: number; sudamericanaTitles: number };
  ending?: CareerEnding;
};

export type MeaningfulMoment =
  | { type: "event"; event: GameEvent; state: CareerState }
  | { type: "delayed_outcome"; outcome: EventOutcome; state: CareerState }
  | { type: "season_finished"; state: CareerState };
