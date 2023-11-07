import { PATH_INPUT_ROOT, PATH_OUTPUT_ROOT } from "@bbfun/utils";
import { createFolderPathIfNeeded } from "@bbfun/utils";

import { PersonHistoricalIdHelper } from "@bbfun/utils";
import CSV from "csv-string";

import assert from "assert";
import { TRowOotp, ZRowOotp } from "@bbfun/utils";

const PATH_INPUT = `${PATH_INPUT_ROOT}/ootp/2011`;
const PATH_OUTPUT = `${PATH_OUTPUT_ROOT}/ootp/2011`;

createFolderPathIfNeeded(PATH_OUTPUT);

const personHistoricalIdHelper = new PersonHistoricalIdHelper();
await personHistoricalIdHelper.init();

const playersCsv = `${PATH_INPUT}/players.csv`;
const playersText = await Bun.file(playersCsv).text();
const playersRows = CSV.parse(playersText);
playersRows.shift();

const playersBattingCsv = `${PATH_INPUT}/players_batting.csv`;
const playersBattingText = await Bun.file(playersBattingCsv).text();
const playersBattingRows = CSV.parse(playersBattingText);
playersBattingRows.shift();

const playersPitchingCsv = `${PATH_INPUT}/players_pitching.csv`;
const playersPitchingText = await Bun.file(playersPitchingCsv).text();
const playersPitchingRows = CSV.parse(playersPitchingText);
playersPitchingRows.shift();

const playersFieldingCsv = `${PATH_INPUT}/players_fielding.csv`;
const playersFieldingText = await Bun.file(playersFieldingCsv).text();
const playersFieldingRows = CSV.parse(playersFieldingText);
playersFieldingRows.shift();

assert(
	playersRows.length === playersBattingRows.length &&
		playersRows.length === playersPitchingRows.length &&
		playersRows.length === playersFieldingRows.length,
);

const holder: TRowOotp[] = [];

for (const [iterPlayer, player] of playersRows.entries()) {
	console.info(`Processing player ${iterPlayer + 1} of ${playersRows.length}`);

	// Get necessary data from players.csv
	const bbRefId = player[34];

	const id = personHistoricalIdHelper.getPersonIdFromBbRefId(bbRefId);
	if (!id) continue;

	const speed = Number(player[67]);
	const stealing = Number(player[68]);
	const baserunning = Number(player[69]);

	// Get necessary data from players_batting.csv
	const batterRatings = playersBattingRows[iterPlayer];

	const contact = Number(batterRatings[5]);
	const gap = Number(batterRatings[6]);
	const eye = Number(batterRatings[7]);
	const avoidKs = Number(batterRatings[8]);
	const power = Number(batterRatings[10]);

	// Get necessary data from players_pitching.csv
	const pitcherRatings = playersPitchingRows[iterPlayer];
	const stuff = Number(pitcherRatings[5]);
	const control = Number(pitcherRatings[6]);
	const movement = Number(pitcherRatings[7]);
	// Indiviuual pitches
	const fastball = Number(pitcherRatings[29]);
	const slider = Number(pitcherRatings[30]);
	const curveball = Number(pitcherRatings[31]);
	const screwball = Number(pitcherRatings[32]);
	const forkball = Number(pitcherRatings[33]);
	const changeup = Number(pitcherRatings[34]);
	const sinker = Number(pitcherRatings[35]);
	const splitter = Number(pitcherRatings[36]);
	const knuckleball = Number(pitcherRatings[37]);
	const cutter = Number(pitcherRatings[38]);
	// const circlechange = Number(pitcherRatings[39]);
	const knucklecurve = Number(pitcherRatings[40]);

	const row = ZRowOotp.parse({
		avoidKs,
		baserunning,
		bbRefId,
		contact,
		control,
		eye,
		gap,
		id,
		movement,
		pitches: {
			changeup,
			// circlechange,
			cutter,
			curveball,
			fastball,
			forkball,
			knuckleball,
			knucklecurve,
			screwball,
			sinker,
			slider,
			splitter,
		},
		power,
		speed,
		stealing,
		stuff,
	});

	// Get necessary data from players_fielding.csv
	holder.push(row);
}

await Bun.write(`${PATH_OUTPUT}/players.json`, JSON.stringify(holder, null, 0));
