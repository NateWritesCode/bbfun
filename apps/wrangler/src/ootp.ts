import {
	PATH_INPUT_ROOT,
	PATH_OUTPUT_ROOT,
	POSITION_MAPPING,
} from "@bbfun/utils";
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

const divisionsCsv = `${PATH_INPUT}/divisions.csv`;
const divisionsText = await Bun.file(divisionsCsv).text();
const divisionsRows = CSV.parse(divisionsText);
divisionsRows.shift();

const gamesCsv = `${PATH_INPUT}/games.csv`;
const gamesText = await Bun.file(gamesCsv).text();
const gamesRows = CSV.parse(gamesText);
gamesRows.shift();

const leaguesCsv = `${PATH_INPUT}/leagues.csv`;
const leaguesText = await Bun.file(leaguesCsv).text();
const leaguesRows = CSV.parse(leaguesText);
leaguesRows.shift();

const parksCsv = `${PATH_INPUT}/parks.csv`;
const parksText = await Bun.file(parksCsv).text();
const parksRows = CSV.parse(parksText);
parksRows.shift();

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

const subleaguesCsv = `${PATH_INPUT}/sub_leagues.csv`;
const subleaguesText = await Bun.file(subleaguesCsv).text();
const subleaguesRows = CSV.parse(subleaguesText);
subleaguesRows.shift();

const teamsCsv = `${PATH_INPUT}/teams.csv`;
const teamsText = await Bun.file(teamsCsv).text();
const teamsRows = CSV.parse(teamsText);
teamsRows.shift();

const parseLeagues = async () => {
	const holder: TRowOotp[] = [];

	for (const [iterLeague, league] of leaguesRows.entries()) {
		console.info(`Processing league ${iterLeague + 1} of ${leaguesRows.length}`);

		const id = league[0];
		const name = league[1];

		const row = ZRowOotp.parse({
			id,
			name,
		});

		holder.push(row);
	}

	await Bun.write(
		`${PATH_OUTPUT}/leagues.json`,
		JSON.stringify(holder, null, 0),
	);
};

const parseSubleagues = async () => {};

const parsePlayers = async () => {
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

		const position = POSITION_MAPPING[player[3] as keyof typeof POSITION_MAPPING];

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
			bbRefId,
			id,
			position,
			ratings: {
				avoidKs,
				baserunning,
				contact,
				control,
				eye,
				gap,
				movement,
				power,
				speed,
				stealing,
				stuff,
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
			},
		});

		holder.push(row);
	}

	await Bun.write(
		`${PATH_OUTPUT}/players.json`,
		JSON.stringify(holder, null, 0),
	);

	return holder;
};
