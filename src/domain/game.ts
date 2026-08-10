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
export type PendingTransfer = { id: string; playerName: string; triggerWeek: number; strength: number; risk: number; resolved: boolean };
export type ClubOffer = { club: Club; kind: "renewal" | "new"; reason: string };

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
};

export type CareerState = {
  version: 3;
  seed: number;
  rngState: number;
  manager: Manager;
  clubId?: string;
  season?: Season;
  history: SeasonRecord[];
  trophies: number;
  promotions: number;
  clubDivisions: Record<string, string>;
};

export type MeaningfulMoment =
  | { type: "event"; event: GameEvent; state: CareerState }
  | { type: "delayed_outcome"; outcome: EventOutcome; state: CareerState }
  | { type: "season_finished"; state: CareerState };
