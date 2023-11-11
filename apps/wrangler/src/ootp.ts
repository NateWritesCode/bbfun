import {
	PATH_INPUT_ROOT,
	PATH_OUTPUT_ROOT,
	POSITION_MAPPING,
	TRowOotpDivision,
	TRowOotpPark,
	TRowOotpSubLeague,
	TRowOotpTeam,
	ZRowOotpDivision,
	ZRowOotpPark,
	ZRowOotpSubLeague,
	ZRowOotpTeam,
} from "@bbfun/utils";
import { createFolderPathIfNeeded } from "@bbfun/utils";

import { PersonHistoricalIdHelper } from "@bbfun/utils";
import CSV from "csv-string";

import assert from "assert";
import {
	TRowOotpLeague,
	TRowOotpPlayer,
	ZRowOotpLeague,
	ZRowOotpPlayer,
} from "@bbfun/utils";
import { kebabCase } from "lodash";

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

const playersFieldingCsv = `${PATH_INPUT}/players_fielding.csv`;
const playersFieldingText = await Bun.file(playersFieldingCsv).text();
const playersFieldingRows = CSV.parse(playersFieldingText);
playersFieldingRows.shift();

const playersPitchingCsv = `${PATH_INPUT}/players_pitching.csv`;
const playersPitchingText = await Bun.file(playersPitchingCsv).text();
const playersPitchingRows = CSV.parse(playersPitchingText);
playersPitchingRows.shift();

const subLeaguesCsv = `${PATH_INPUT}/sub_leagues.csv`;
const subLeaguesText = await Bun.file(subLeaguesCsv).text();
const subLeagueRows = CSV.parse(subLeaguesText);
subLeagueRows.shift();

const teamsCsv = `${PATH_INPUT}/teams.csv`;
const teamsText = await Bun.file(teamsCsv).text();
const teamsRows = CSV.parse(teamsText);
teamsRows.shift();

const leagues: TRowOotpLeague[] = [];
const subLeagues: TRowOotpSubLeague[] = [];
const divisions: TRowOotpDivision[] = [];
const teams: TRowOotpTeam[] = [];
const parks: TRowOotpPark[] = [];
const players: TRowOotpPlayer[] = [];

const parseLeagues = async () => {
	for (const [iterLeague, league] of leaguesRows.entries()) {
		console.info(`Processing league ${iterLeague + 1} of ${leaguesRows.length}`);

		const abbrev = league[2];
		const name = league[1];
		const slug = kebabCase(name);
		const id = slug;
		const ootpId = league[0];

		const row = ZRowOotpLeague.parse({
			abbrev,
			id,
			name,
			ootpId,
			slug,
		});

		leagues.push(row);
	}

	await Bun.write(
		`${PATH_OUTPUT}/leagues.json`,
		JSON.stringify(leagues, null, 0),
	);
};

const parseSubLeagues = async () => {
	for (const [iterSubLeague, subLeague] of subLeagueRows.entries()) {
		console.info(
			`Processing subLeague ${iterSubLeague + 1} of ${subLeagueRows.length}`,
		);

		const abbrev = subLeague[3];
		const name = subLeague[2];
		const slug = kebabCase(name);
		const id = slug;
		const ootpLeagueId = subLeague[0];
		const leagueId = leagues.find((league) => league.ootpId === ootpLeagueId)?.id;
		const ootpId = subLeague[1];

		const row = ZRowOotpSubLeague.parse({
			abbrev,
			id,
			leagueId,
			name,
			ootpId,
			slug,
		});

		subLeagues.push(row);
	}

	await Bun.write(
		`${PATH_OUTPUT}/subLeagues.json`,
		JSON.stringify(subLeagues, null, 0),
	);
};

const parseDivisions = async () => {
	for (const [iterDivision, division] of divisionsRows.entries()) {
		console.info(
			`Processing division ${iterDivision + 1} of ${divisionsRows.length}`,
		);

		const name = division[3];
		const slug = kebabCase(name);
		const id = slug;
		const ootpLeagueId = division[0];
		const ootpSubLeagueId = division[1];
		const leagueId = leagues.find((league) => league.ootpId === ootpLeagueId)?.id;
		const subLeagueId = subLeagues.find(
			(subLeague) => subLeague.ootpId === ootpSubLeagueId,
		)?.id;
		const ootpId = division[2];

		const row = ZRowOotpDivision.parse({
			id,
			leagueId,
			name,
			ootpId,
			slug,
			subLeagueId,
		});

		divisions.push(row);
	}

	await Bun.write(
		`${PATH_OUTPUT}/divisions.json`,
		JSON.stringify(divisions, null, 0),
	);
};

const parseParks = async () => {
	for (const [iterPark, park] of parksRows.entries()) {
		console.info(`Processing subLeague ${iterPark + 1} of ${parksRows.length}`);

		const ootpId = park[0];

		const dimensionsX = Number(park[1]);
		const dimensionsY = Number(park[2]);
		const batterLeftX = Number(park[3]);
		const batterLeftY = Number(park[4]);
		const batterRightX = Number(park[5]);
		const batterRightY = Number(park[6]);
		const basesX0 = Number(park[7]);
		const basesX1 = Number(park[8]);
		const basesX2 = Number(park[9]);
		const basesY0 = Number(park[10]);
		const basesY1 = Number(park[11]);
		const basesY2 = Number(park[12]);
		const positionsX0 = Number(park[13]);
		const positionsX1 = Number(park[14]);
		const positionsX2 = Number(park[15]);
		const positionsX3 = Number(park[16]);
		const positionsX4 = Number(park[17]);
		const positionsX5 = Number(park[18]);
		const positionsX6 = Number(park[19]);
		const positionsX7 = Number(park[20]);
		const positionsX8 = Number(park[21]);
		const positionsX9 = Number(park[22]);
		const positionsY0 = Number(park[23]);
		const positionsY1 = Number(park[24]);
		const positionsY2 = Number(park[25]);
		const positionsY3 = Number(park[26]);
		const positionsY4 = Number(park[27]);
		const positionsY5 = Number(park[28]);
		const positionsY6 = Number(park[29]);
		const positionsY7 = Number(park[30]);
		const positionsY8 = Number(park[31]);
		const positionsY9 = Number(park[32]);
		const avg = Number(park[33]);
		const avgL = Number(park[34]);
		const avgR = Number(park[35]);
		const d = Number(park[36]);
		const t = Number(park[37]);
		const hr = Number(park[38]);
		const hrR = Number(park[39]);
		const hrL = Number(park[40]);
		const temperature0 = Number(park[41]);
		const temperature1 = Number(park[42]);
		const temperature2 = Number(park[43]);
		const temperature3 = Number(park[44]);
		const temperature4 = Number(park[45]);
		const temperature5 = Number(park[46]);
		const temperature6 = Number(park[47]);
		const temperature7 = Number(park[48]);
		const temperature8 = Number(park[49]);
		const temperature9 = Number(park[50]);
		const temperature10 = Number(park[51]);
		const temperature11 = Number(park[52]);
		const rain0 = Number(park[53]);
		const rain1 = Number(park[54]);
		const rain2 = Number(park[55]);
		const rain3 = Number(park[56]);
		const rain4 = Number(park[57]);
		const rain5 = Number(park[58]);
		const rain6 = Number(park[59]);
		const rain7 = Number(park[60]);
		const rain8 = Number(park[61]);
		const rain9 = Number(park[62]);
		const rain10 = Number(park[63]);
		const rain11 = Number(park[64]);
		const wind = Number(park[65]);
		const windDirection = Number(park[66]);
		const distances0 = Number(park[67]);
		const distances1 = Number(park[68]);
		const distances2 = Number(park[69]);
		const distances3 = Number(park[70]);
		const distances4 = Number(park[71]);
		const distances5 = Number(park[72]);
		const distances6 = Number(park[73]);
		const wallHeights0 = Number(park[74]);
		const wallHeights1 = Number(park[75]);
		const wallHeights2 = Number(park[76]);
		const wallHeights3 = Number(park[77]);
		const wallHeights4 = Number(park[78]);
		const wallHeights5 = Number(park[79]);
		const wallHeights6 = Number(park[80]);
		const name = park[81];
		const slug = kebabCase(name);
		const id = slug;
		const capacity = Number(park[85]);
		const type = Number(park[86]);
		const foulGround = Number(park[86]);
		const turf = Number(park[87]);
		const isHomeTeamDugoutAtFirstBase = Boolean(park[92]);

		const row = ZRowOotpPark.parse({
			avg,
			avgL,
			avgR,
			basesX0,
			basesX1,
			basesX2,
			basesY0,
			basesY1,
			basesY2,
			batterLeftX,
			batterLeftY,
			batterRightX,
			batterRightY,
			capacity,
			d,
			dimensionsX,
			dimensionsY,
			distances0,
			distances1,
			distances2,
			distances3,
			distances4,
			distances5,
			distances6,
			foulGround,
			hr,
			hrL,
			hrR,
			id,
			isHomeTeamDugoutAtFirstBase,
			name,
			ootpId,
			positionsX0,
			positionsX1,
			positionsX2,
			positionsX3,
			positionsX4,
			positionsX5,
			positionsX6,
			positionsX7,
			positionsX8,
			positionsX9,
			positionsY0,
			positionsY1,
			positionsY2,
			positionsY3,
			positionsY4,
			positionsY5,
			positionsY6,
			positionsY7,
			positionsY8,
			positionsY9,
			rain0,
			rain1,
			rain10,
			rain11,
			rain2,
			rain3,
			rain4,
			rain5,
			rain6,
			rain7,
			rain8,
			rain9,
			slug,
			t,
			temperature0,
			temperature1,
			temperature10,
			temperature11,
			temperature2,
			temperature3,
			temperature4,
			temperature5,
			temperature6,
			temperature7,
			temperature8,
			temperature9,
			turf,
			type,
			wallHeights0,
			wallHeights1,
			wallHeights2,
			wallHeights3,
			wallHeights4,
			wallHeights5,
			wallHeights6,
			wind,
			windDirection,
		});

		parks.push(row);
	}

	await Bun.write(`${PATH_OUTPUT}/parks.json`, JSON.stringify(parks, null, 0));
};

const parseTeams = async () => {
	for (const [iterTeam, team] of teamsRows.entries()) {
		console.info(`Processing team ${iterTeam + 1} of ${teamsRows.length}`);

		const ootpId = team[0];
		const name = team[1];
		const abbrev = team[2];
		const nickname = team[3];
		const id = kebabCase(`${name}-${nickname}`);
		const slug = id;

		const ootpParkId = team[6];
		const ootpLeagueId = team[7];
		const ootpSubLeagueId = team[8];
		const ootpDivisionId = team[9];

		const leagueId = leagues.find((league) => league.ootpId === ootpLeagueId)?.id;
		const subLeagueId = subLeagues.find(
			(subLeague) => subLeague.ootpId === ootpSubLeagueId,
		)?.id;
		const divisionId = divisions.find(
			(division) => division.ootpId === ootpDivisionId,
		)?.id;
		const parkId = parks.find((park) => park.ootpId === ootpParkId)?.id;

		const backgroundColor = team[17];
		const textColor = team[18];
		const hatMainColor = team[19];
		const hatVisorColor = team[20];
		const jerseyMainColor = team[21];
		const jerseyAwayColor = team[22];
		const jerseySecondaryColor = team[23];
		const jerseyPinStripeColor = team[24];
		const historicalId = team[26];

		const row = ZRowOotpTeam.parse({
			abbrev,
			backgroundColor,
			divisionId,
			hatMainColor,
			hatVisorColor,
			historicalId,
			id,
			jerseyAwayColor,
			jerseyMainColor,
			jerseyPinStripeColor,
			jerseySecondaryColor,
			leagueId,
			name,
			nickname,
			ootpId,
			parkId,
			slug,
			subLeagueId,
			textColor,
		});

		teams.push(row);
	}

	await Bun.write(`${PATH_OUTPUT}/teams.json`, JSON.stringify(teams, null, 0));
};

const parsePlayers = async () => {
	assert(
		playersRows.length === playersBattingRows.length &&
			playersRows.length === playersPitchingRows.length &&
			playersRows.length === playersFieldingRows.length,
	);

	for (const [iterPlayer, player] of playersRows.entries()) {
		console.info(`Processing player ${iterPlayer + 1} of ${playersRows.length}`);

		// Get necessary data from players.csv
		const bbRefId = player[34];

		const id = personHistoricalIdHelper.getPersonIdFromBbRefId(bbRefId);
		if (!id) continue;

		const ootpId = player[0];

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
		// Individual pitches
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
		const circlechange = Number(pitcherRatings[39]);
		const knucklecurve = Number(pitcherRatings[40]);

		const row = ZRowOotpPlayer.parse({
			bbRefId,
			id,
			ootpId,
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
					circlechange,
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

		players.push(row);
	}

	await Bun.write(
		`${PATH_OUTPUT}/players.json`,
		JSON.stringify(players, null, 0),
	);
};

await parseLeagues();
await parseSubLeagues();
await parseDivisions();
await parseParks();
await parseTeams();
await parsePlayers();
