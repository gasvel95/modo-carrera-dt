export type PlayerPosition = "ARQ" | "DEF" | "MED" | "DEL";
export type PreferredFoot = "Derecha" | "Izquierda";
export type TrainingFocus = "Definición" | "Físico" | "Técnica";
export type PlayerDivision = "Primera D" | "Primera C" | "Primera B" | "Primera Nacional" | "Liga Profesional";

export type PlayerClub = {
  id: string;
  name: string;
  shortName: string;
  crestId?: number;
  division: PlayerDivision;
  tier: number;
  strength: number;
  region: string;
};

export type PlayerOffer = {
  club: PlayerClub;
  kind: "renewal" | "new";
  reason: string;
};

export type PlayerMatch = {
  round: number;
  opponent: string;
  opponentCrestId?: number;
  result: "G" | "E" | "P";
  minutes: number;
  rating?: number;
  goals: number;
  assists: number;
};

export type PlayerSeason = {
  year: number;
  club: PlayerClub;
  round: number;
  totalRounds: number;
  focus: TrainingFocus;
  appearances: number;
  starts: number;
  minutes: number;
  goals: number;
  assists: number;
  ratingTotal: number;
  coachTrust: number;
  fitness: number;
  formBoost?: number;
  recentMatches: PlayerMatch[];
  completed: boolean;
};

export type PlayerSeasonRecord = {
  year: number;
  age: number;
  club: string;
  clubShortName?: string;
  crestId?: number;
  division: PlayerDivision;
  appearances: number;
  starts: number;
  minutes: number;
  goals: number;
  assists: number;
  averageRating: number;
  overallBefore: number;
  overallAfter: number;
  outcome: string;
};

export type PlayerEventEffects = Partial<{ coachTrust: number; fitness: number; reputation: number; overall: number; formBoost: number }>;
export type PlayerEventOutcome = { title: string; description: string; tone: "positive" | "negative" | "neutral"; effects: PlayerEventEffects };
export type PlayerEventOption = { id: string; text: string; approach: "bold" | "calm" | "safe"; successChance: number; outcomes: { success: PlayerEventOutcome; failure: PlayerEventOutcome } };
export type PlayerCareerEvent = { id: string; kicker: string; title: string; description: string; options: PlayerEventOption[] };

export type PlayerRetirement = {
  reason: "voluntary" | "age";
  year: number;
  age: number;
  title: string;
};

export type PlayerCareerState = {
  version: 1;
  seed: number;
  rngState: number;
  player: {
    name: string;
    age: number;
    position: PlayerPosition;
    preferredFoot: PreferredFoot;
    overall: number;
    potential: number;
    reputation: number;
  };
  club?: PlayerClub;
  season?: PlayerSeason;
  offers: PlayerOffer[];
  history: PlayerSeasonRecord[];
  totals: { appearances: number; starts: number; minutes: number; goals: number; assists: number };
  reachedFirstDivision: boolean;
  seenEvents?: string[];
  pendingEvent?: PlayerCareerEvent;
  lastEventOutcome?: PlayerEventOutcome;
  retirement?: PlayerRetirement;
};

