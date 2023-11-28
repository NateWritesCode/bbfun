export const MAX_BASEBALL_RATING = 100;
export const MIN_BASEBALL_RATING = 0;
export const PITCH_NAMES = [
   "changeup",
   "cutter",
   "curveball",
   "fastball",
   "forkball",
   "knuckleball",
   "knucklecurve",
   "screwball",
   "sinker",
   "slider",
   "splitter",
] as const;

export const POSITIONS = [
   "p",
   "c",
   "1b",
   "2b",
   "3b",
   "ss",
   "lf",
   "cf",
   "rf",
] as const;

export const POSITION_MAPPING = {
   "1": "p",
   "2": "c",
   "3": "1b",
   "4": "2b",
   "5": "3b",
   "6": "ss",
   "7": "lf",
   "8": "cf",
   "9": "rf",
};

export const PITCH_OUTCOMES = ["B", "S", "X"] as const;

export const PITCH_IN_PLAY_EVENTS = [
   "caughtStealing2B",
   "double",
   "doublePlay",
   "fieldError",
   "fieldersChoice",
   "fieldersChoiceOut",
   "fieldOut",
   "forceOut",
   "groundedIntoDoublePlay",
   "hitByPitch",
   "homeRun",
   "intentionalWalk",
   "otherOut",
   "pickoff1B",
   "pickoff2B",
   "runnerDoublePlay",
   "sacBunt",
   "sacFly",
   "single",
   "strikeout",
   "strikeoutDoublePlay",
   "triple",
   "triplePlay",
   "walk",
   "wildPitch",
] as const;
