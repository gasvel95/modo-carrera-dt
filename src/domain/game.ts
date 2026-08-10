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

export type EventOption = { id: string; text: string; approach: "bold" | "calm" | "safe"; outcomes: EventOutcome[] };

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
};

export type CareerState = {
  version: 1;
  seed: number;
  rngState: number;
  manager: Manager;
  clubId?: string;
  season?: Season;
  history: SeasonRecord[];
  trophies: number;
  promotions: number;
};

export type MeaningfulMoment =
  | { type: "event"; event: GameEvent; state: CareerState }
  | { type: "season_finished"; state: CareerState };

