import { PATH_INPUT_ROOT, PATH_OUTPUT_ROOT } from "@bbfun/utils";
import { PersonHistoricalIdHelper } from "@bbfun/utils";
import { ZRowPitchFx } from "@bbfun/utils";
import { createFolderPathIfNeeded } from "@bbfun/utils";
import CSV from "csv-string";

const YEAR = 2011;

const PATH_INPUT = `${PATH_INPUT_ROOT}/historical/pitchfx/${YEAR}`;
const PATH_OUTPUT = `${PATH_OUTPUT_ROOT}/historical/pitchfx/${YEAR}`;

createFolderPathIfNeeded(PATH_OUTPUT);

const personHistoricalIdHelper = new PersonHistoricalIdHelper();
await personHistoricalIdHelper.init();

const NUM_ROWS = 1_000;

// "pitch_type","game_date","release_speed","release_pos_x","release_pos_z","player_name","batter","pitcher","events","description","spin_dir","spin_rate_deprecated","break_angle_deprecated","break_length_deprecated","zone","des","game_type","stand","p_throws","home_team","away_team","type","hit_location","bb_type","balls","strikes","game_year","pfx_x","pfx_z","plate_x","plate_z","on_3b","on_2b","on_1b","outs_when_up","inning","inning_topbot","hc_x","hc_y","tfs_deprecated","tfs_zulu_deprecated","fielder_2","umpire","sv_id","vx0","vy0","vz0","ax","ay","az","sz_top","sz_bot","hit_distance_sc","launch_speed","launch_angle","effective_speed","release_spin_rate","release_extension","game_pk","pitcher","fielder_2","fielder_3","fielder_4","fielder_5","fielder_6","fielder_7","fielder_8","fielder_9","release_pos_y","estimated_ba_using_speedangle","estimated_woba_using_speedangle","woba_value","woba_denom","babip_value","iso_value","launch_speed_angle","at_bat_number","pitch_number","pitch_name","home_score","away_score","bat_score","fld_score","post_away_score","post_home_score","post_bat_score","post_fld_score","if_fielding_alignment","of_fielding_alignment","spin_axis","delta_home_win_exp","delta_run_exp"

const mapFunc = (row: string[], index: number) => {
	console.info("Processing row", index + 1, "of", NUM_ROWS);
	if (row[0] === "") return null;

	const holderObj = {
		pitchType: row[0],
		gameDate: row[1],
		releaseSpeed: row[2],
		releasePosX: row[3],
		releasePosZ: row[4],
		playerName: row[5],
		batterId: row[6],
		pitcherId: row[7],
		events: row[8],
		descriptionPitch: row[9],
		spinDirDeprecated: row[10],
		spinRateDeprecated: row[11],
		breakAngleDeprecated: row[12],
		breakLengthDeprecated: row[13],
		zone: row[14],
		descriptionPlate: row[15],
		gameType: row[16],
		stand: row[17],
		pThrows: row[18],
		homeTeam: row[19],
		awayTeam: row[20],
		type: row[21],
		hitLocation: row[22],
		bbType: row[23],
		balls: row[24],
		strikes: row[25],
		gameYear: row[26],
		pfxX: row[27],
		pfxZ: row[28],
		plateX: row[29],
		plateZ: row[30],
		runner3b: row[31],
		runner2b: row[32],
		runner1b: row[33],
		outs: row[34],
		inning: row[35],
		isTopOfInning: row[36],
		hcX: row[37],
		hcY: row[38],
		tfsDeprecated: row[39],
		tfsZuluDeprecated: row[40],
		fielder2: row[41],
		umpire: row[42],
		svId: row[43],
		vx0: row[44],
		vy0: row[45],
		vz0: row[46],
		ax: row[47],
		ay: row[48],
		az: row[49],
		szTop: row[50],
		szBot: row[51],
		hitDistanceSc: row[52],
		launchSpeed: row[53],
		launchAngle: row[54],
		effectiveSpeed: row[55],
		releaseSpinRate: row[56],
		releaseExtension: row[57],
		gameId: row[58],
		pitcherIdRepeat: row[59],
		catcher: row[60],
		firstBase: row[61],
		secondBase: row[62],
		thirdBase: row[63],
		shortstop: row[64],
		leftField: row[65],
		centerField: row[66],
		rightField: row[67],
		releasePosY: row[68],
		estimatedBaUsingSpeedAngle: row[69],
		estimatedWobaUsingSpeedAngle: row[70],
		wobaValue: row[71],
		wobaDenom: row[72],
		babipValue: row[73],
		isoValue: row[74],
		launchSpeedAngle: row[75],
		atBatNumber: row[76],
		pitchNumber: row[77],
		pitchName: row[78],
		homeScore: row[79],
		awayScore: row[80],
		batScore: row[81],
		fldScore: row[82],
		postAwayScore: row[83],
		postHomeScore: row[84],
		postBatScore: row[85],
		postFldScore: row[86],
		ifFieldingAlignment: row[87],
		ofFieldingAlignment: row[88],
		spinAxis: row[89],
		deltaHomeWinExp: row[90],
		deltaRunExp: row[91],
	};

	const parsedRow = ZRowPitchFx.parse(holderObj);
	parsedRow.pitcherId = personHistoricalIdHelper.getPersonIdFromMlbId(
		parsedRow.pitcherId,
	);
	parsedRow.batterId = personHistoricalIdHelper.getPersonIdFromMlbId(
		parsedRow.batterId,
	);

	parsedRow.runner1b = parsedRow.runner1b
		? personHistoricalIdHelper.getPersonIdFromMlbId(parsedRow.runner1b)
		: null;
	parsedRow.runner2b = parsedRow.runner2b
		? personHistoricalIdHelper.getPersonIdFromMlbId(parsedRow.runner2b)
		: null;
	parsedRow.runner3b = parsedRow.runner3b
		? personHistoricalIdHelper.getPersonIdFromMlbId(parsedRow.runner3b)
		: null;
};

console.info("Starting pitching");

const filepathPitching = `${PATH_INPUT}/pitching.csv`;
const filePitching = Bun.file(filepathPitching);
const textPitching = await filePitching.text();
const rowsPitching = CSV.parse(textPitching).slice(0, NUM_ROWS + 1);
rowsPitching.shift();

const holderPitching = rowsPitching.map(mapFunc).filter(Boolean);

await Bun.write(
	`${PATH_OUTPUT}/pitching.json`,
	JSON.stringify(holderPitching, null, 0),
);

console.info("Starting batting");

const filepathBatting = `${PATH_INPUT}/batting.csv`;
const fileBatting = Bun.file(filepathBatting);
const textBatting = await fileBatting.text();
const rowsBatting = CSV.parse(textBatting).slice(0, NUM_ROWS + 1);
rowsBatting.shift();

const holderBatting = rowsBatting.map(mapFunc).filter(Boolean);

await Bun.write(
	`${PATH_OUTPUT}/batting.json`,
	JSON.stringify(holderBatting, null, 0),
);
