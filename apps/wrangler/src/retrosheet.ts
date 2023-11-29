import CSV from "csv-string";

import { PATH_INPUT_ROOT, PATH_OUTPUT_ROOT } from "@bbfun/utils";
import { PersonHistoricalIdHelper } from "@bbfun/utils";
import { createFolderPathIfNeeded } from "@bbfun/utils";

const personHistoricalIdHelper = new PersonHistoricalIdHelper();
await personHistoricalIdHelper.init();

const PATH_INPUT = `${PATH_INPUT_ROOT}/historical/retrosheet/2011`;
const PATH_OUTPUT = `${PATH_OUTPUT_ROOT}/historical/retrosheet/2011`;

createFolderPathIfNeeded(PATH_OUTPUT);

const FILE_KEY = "2011SLN";

const EVENT_MAP = {
   "0": {
      eventType: "unknown",
   },
   "1": {
      eventType: "none",
   },
   "2": {
      eventType: "generic-out",
   },
   "3": {
      eventType: "strikeout",
   },
   "4": {
      eventType: "stolen-base",
   },
   "5": {
      eventType: "defensive-indifference",
   },
   "6": {
      eventType: "caught-stealing",
   },
   "7": {
      eventType: "pickoff-error",
   },
   "8": {
      eventType: "pickoff",
   },
   "9": {
      eventType: "wild-pitch",
   },
   "10": {
      eventType: "passed-ball",
   },
   "11": {
      eventType: "balk",
   },
   "12": {
      eventType: "other-advance",
   },
   "13": {
      eventType: "foul-error",
   },
   "14": {
      eventType: "walk",
   },
   "15": {
      eventType: "intentional-walk",
   },
   "16": {
      eventType: "hit-by-pitch",
   },
   "17": {
      eventType: "interference",
   },
   "18": {
      eventType: "error",
   },
   "19": {
      eventType: "fielders-choice",
   },
   "20": {
      eventType: "single",
   },
   "21": {
      eventType: "double",
   },
   "22": {
      eventType: "triple",
   },
   "23": {
      eventType: "home-run",
   },
   "24": {
      eventType: "missing",
   },
};

const parserNumber = (x: string) => (x ? Number(x) : null);
const parserStringOrNull = (x: string) => (x ? x : null);
const parseEventType = (x: string) => {
   if (!x) {
      return null;
   }

   if (Object.keys(EVENT_MAP).includes(x) || x === "") {
      return EVENT_MAP[x as keyof typeof EVENT_MAP].eventType; // or whatever your function returns
   } else {
      throw new Error(`Missing event for: ${x}`);
   }
};

const parserPlayerId = (x: string) => {
   if (!x) {
      return null;
   }

   const playerId = personHistoricalIdHelper.getPersonIdFromRetrosheetId(x);

   return playerId;
};

const retrosheetHelper: {
   ourKey: string;
   cwEventKey: string;
   parser: (x: string) => unknown;
}[] = [
   {
      ourKey: "gameId",
      cwEventKey: "GAME_ID",
      parser: parserStringOrNull,
   },
   {
      ourKey: "awayTeamId",
      cwEventKey: "AWAY_TEAM_ID",
      parser: parserStringOrNull,
   },
   {
      ourKey: "inning",
      cwEventKey: "INN_CT",
      parser: parserNumber,
   },
   {
      ourKey: "battingTeamId",
      cwEventKey: "BAT_HOME_ID",
      parser: parserNumber,
   },
   { ourKey: "outs", cwEventKey: "OUTS_CT", parser: parserNumber },
   {
      ourKey: "balls",
      cwEventKey: "BALLS_CT",
      parser: parserNumber,
   },
   {
      ourKey: "strikes",
      cwEventKey: "STRIKES_CT",
      parser: parserNumber,
   },
   {
      ourKey: "pitchSequence",
      cwEventKey: "PITCH_SEQ_TX",
      parser: parserStringOrNull,
   },
   {
      ourKey: "awayScore",
      cwEventKey: "AWAY_SCORE_CT",
      parser: parserNumber,
   },
   {
      ourKey: "homeScore",
      cwEventKey: "HOME_SCORE_CT",
      parser: parserNumber,
   },
   {
      ourKey: "batterId",
      cwEventKey: "BAT_ID",
      parser: parserPlayerId,
   },
   {
      ourKey: "batterHand",
      cwEventKey: "BAT_HAND_CD",
      parser: parserStringOrNull,
   },
   {
      ourKey: "resultBatterId",
      cwEventKey: "RESP_BAT_ID",
      parser: parserPlayerId,
   },
   {
      ourKey: "resultBatterHand",
      cwEventKey: "RESP_BAT_HAND_CD",
      parser: parserStringOrNull,
   },
   {
      ourKey: "pitcherId",
      cwEventKey: "PIT_ID",
      parser: parserPlayerId,
   },
   {
      ourKey: "pitcherHand",
      cwEventKey: "PIT_HAND_CD",
      parser: parserStringOrNull,
   },
   {
      ourKey: "resultPitcherId",
      cwEventKey: "RESP_PIT_ID",
      parser: parserStringOrNull,
   },
   {
      ourKey: "resultPitcherHand",
      cwEventKey: "RESP_PIT_HAND_CD",
      parser: parserStringOrNull,
   },
   {
      ourKey: "runner1Id",
      cwEventKey: "BASE1_RUN_ID",
      parser: parserPlayerId,
   },
   {
      ourKey: "runner2Id",
      cwEventKey: "BASE2_RUN_ID",
      parser: parserPlayerId,
   },
   {
      ourKey: "runner3Id",
      cwEventKey: "BASE3_RUN_ID",
      parser: parserPlayerId,
   },
   {
      ourKey: "eventTx",
      cwEventKey: "EVENT_TX",
      parser: parserStringOrNull,
   },
   {
      ourKey: "eventType",
      cwEventKey: "EVENT_CD",
      parser: parseEventType,
   },
   {
      ourKey: "hitValue",
      cwEventKey: "H_FL",
      parser: parserNumber,
   },
   {
      ourKey: "battedBallLocation",
      cwEventKey: "BATTEDBALL_LOC_TX",
      parser: parserStringOrNull,
   },
   {
      ourKey: "eventId",
      cwEventKey: "EVENT_ID",
      parser: parserNumber,
   },
];

const filepath = `${PATH_INPUT}/${FILE_KEY}.csv`;
const foo = Bun.file(filepath);
const text = await foo.text();
const rows = CSV.parse(text);

const holder = rows.map((row) => {
   const holderObj: { [key: string]: unknown } = {};

   for (const [iterColumn, column] of retrosheetHelper.entries()) {
      const { ourKey, parser } = column;
      const value = parser(row[iterColumn]);

      holderObj[ourKey] = value;
   }

   return holderObj;
});

await Bun.write(
   `${PATH_OUTPUT}/${FILE_KEY}.json`,
   JSON.stringify(holder, null, 2),
);
