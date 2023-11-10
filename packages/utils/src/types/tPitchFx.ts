import { PITCH_NAMES, PITCH_OUTCOMES } from "src";
import { z } from "zod";
import { ZInputStringNumber, ZInputStringNumberNullable, ZRegexDate } from ".";

export const ZRowInputPitchFx = z.object({
	atBatNumber: ZInputStringNumber,
	awayScore: ZInputStringNumber,
	awayTeam: z.string(),
	ax: ZInputStringNumber,
	ay: ZInputStringNumber,
	az: ZInputStringNumber,
	// babipValue: z.number().nullable(),
	batterId: z.string(),
	batScore: ZInputStringNumber,
	balls: ZInputStringNumber,
	bbType: z
		.enum(["", "fly_ball", "ground_ball", "line_drive", "popup"])
		.transform((bbType) => {
			if (bbType === "") return null;

			switch (bbType) {
				case "fly_ball": {
					return "FLY_BALL";
				}
				case "ground_ball": {
					return "GROUND_BALL";
				}
				case "line_drive": {
					return "LINE_DRIVE";
				}
				case "popup": {
					return "POPUP";
				}
				default: {
					const exhaustiveCheck: never = bbType;
					throw new Error(exhaustiveCheck);
				}
			}
		}),

	// breakAngleDeprecated: z.number().nullable(),
	// breakLengthDeprecated: z.number().nullable(),
	// catcher: ZPlayerIdNotNull,
	// centerField: ZPlayerIdNotNull,
	// deltaHomeWinExp: z.number(),
	// deltaRunExp: z.number(),
	descriptionPitch: z.string(),
	descriptionPlate: z.string(),
	effectiveSpeed: ZInputStringNumberNullable,
	// estimatedBaUsingSpeedAngle: z.number().nullable(),
	// estimatedWobaUsingSpeedAngle: z.number().nullable(),
	events: z
		.enum([
			"",
			"field_out",
			"home_run",
			"walk",
			"single",
			"strikeout",
			"grounded_into_double_play",
			"field_error",
			"hit_by_pitch",
			"double",
			"sac_bunt",
			"force_out",
			"triple",
			"intent_walk",
			"caught_stealing_2b",
			"sac_fly",
			"fielders_choice_out",
			"pickoff_2b",
			"strikeout_double_play",
			"double_play",
			"triple_play",
			"fielders_choice",
			"pickoff_1b",
			"runner_double_play",
			"other_out",
			"wild_pitch",
		])
		.transform((event) => {
			if (event === "") return null;

			switch (event) {
				case "field_out": {
					return "fieldOut";
				}
				case "home_run": {
					return "homeRun";
				}
				case "walk": {
					return "walk";
				}
				case "single": {
					return "single";
				}
				case "strikeout": {
					return "strikeout";
				}
				case "grounded_into_double_play": {
					return "groundedIntoDoublePlay";
				}
				case "field_error": {
					return "fieldError";
				}
				case "hit_by_pitch": {
					return "hitByPitch";
				}
				case "double": {
					return "double";
				}
				case "sac_bunt": {
					return "sacBunt";
				}
				case "force_out": {
					return "forceOut";
				}
				case "triple": {
					return "triple";
				}
				case "intent_walk": {
					return "intentionalWalk";
				}
				case "caught_stealing_2b": {
					return "caughtStealing2B";
				}
				case "sac_fly": {
					return "sacFly";
				}
				case "fielders_choice_out": {
					return "fieldersChoiceOut";
				}
				case "pickoff_2b": {
					return "pickoff2B";
				}
				case "strikeout_double_play": {
					return "strikeoutDoublePlay";
				}
				case "double_play": {
					return "doublePlay";
				}
				case "triple_play": {
					return "triplePlay";
				}
				case "fielders_choice": {
					return "fieldersChoice";
				}
				case "pickoff_1b": {
					return "pickoff1B";
				}
				case "runner_double_play": {
					return "runnerDoublePlay";
				}
				case "other_out": {
					return "otherOut";
				}
				case "wild_pitch": {
					return "wildPitch";
				}

				default: {
					const exhaustiveCheck: never = event;
					throw new Error(exhaustiveCheck);
				}
			}
		}),
	// firstBase: ZPlayerIdNotNull,
	fldScore: ZInputStringNumber,
	gameDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	gameId: z.string(),
	gameType: z.enum(["E", "S", "R", "F", "D", "L", "W"]),
	gameYear: ZInputStringNumber,
	hcX: ZInputStringNumberNullable,
	hcY: ZInputStringNumberNullable,
	hitDistanceSc: ZInputStringNumberNullable,
	hitLocation: z
		.enum(["", "1", "2", "3", "4", "5", "6", "7", "8", "9"])
		.transform((x) => (x === "" ? null : x)),
	homeScore: ZInputStringNumber,
	homeTeam: z.string(),
	// ifFieldingAlignment: z.string(),
	inning: ZInputStringNumber,
	isoValue: ZInputStringNumberNullable,
	isTopOfInning: z.enum(["Top", "Bot"]).transform((x) => x === "Top"),
	launchAngle: ZInputStringNumberNullable,
	launchSpeed: ZInputStringNumberNullable,
	launchSpeedAngle: ZInputStringNumberNullable,
	// leftField: ZPlayerIdNotNull,
	// ofFieldingAlignment: z.string(),
	outs: ZInputStringNumber,
	pfxX: ZInputStringNumber,
	pfxZ: ZInputStringNumber,
	pitchName: z
		.enum([
			"",
			"Sinker",
			"Changeup",
			"Slider",
			"Split-Finger",
			"4-Seam Fastball",
			"Curveball",
			"Cutter",
			"Knuckle Curve",
			"Intentional Ball",
			"Pitch Out",
			"Screwball",
			"Knuckleball",
			"Forkball",
			"Other",
			"Eephus",
		])
		.transform((pitch) => {
			if (pitch === "") return null;

			switch (pitch) {
				case "4-Seam Fastball": {
					return "fastball";
				}
				case "Sinker": {
					return "sinker";
				}
				case "Cutter": {
					return "cutter";
				}
				case "Split-Finger": {
					return "splitter";
				}
				case "Knuckle Curve": {
					return "knucklecurve";
				}
				case "Knuckleball": {
					return "knuckleball";
				}
				case "Curveball": {
					return "curveball";
				}
				case "Slider": {
					return "slider";
				}
				case "Changeup": {
					return "changeup";
				}
				case "Forkball": {
					return "forkball";
				}
				case "Screwball": {
					return "screwball";
				}
				case "Eephus": {
					return "eephus";
				}
				case "Pitch Out": {
					return "pitchout";
				}
				case "Intentional Ball": {
					return "intentionalBall";
				}
				case "Other": {
					return "other";
				}
				default: {
					const exhaustiveCheck: never = pitch;
					throw new Error(exhaustiveCheck);
				}
			}
		}),
	pitchNumber: ZInputStringNumber,
	pitchType: z.enum([
		"CH",
		"CU",
		"EP",
		"FA",
		"FC",
		"FO",
		"FF",
		"FS",
		"FT",
		"IN",
		"KC",
		"KN",
		"PO",
		"SC",
		"SI",
		"SL",
	]),
	pitcherId: z.string(),
	plateX: ZInputStringNumber,
	plateZ: ZInputStringNumber,
	playerName: z.string(),
	pThrows: z.enum(["L", "R"]),
	// postAwayScore: ZInputStringNumber,
	// postHomeScore: ZInputStringNumber,
	// postFldScore: ZInputStringNumber,
	releaseExtension: ZInputStringNumberNullable,
	releasePosX: ZInputStringNumber,
	releasePosY: ZInputStringNumber,
	releasePosZ: ZInputStringNumber,
	releaseSpeed: ZInputStringNumber,
	releaseSpinRate: ZInputStringNumberNullable,
	// rightField: ZPlayerIdNotNull,
	runner1b: z.string().nullable(),
	runner2b: z.string().nullable(),
	runner3b: z.string().nullable(),
	// secondBase: ZPlayerIdNotNull,
	// shortstop: ZPlayerIdNotNull,
	spinAxis: ZInputStringNumberNullable,
	// spinDirDeprecated: ZInputStringNumberNullable,
	// spinRateDeprecated: ZInputStringNumberNullable,
	stand: z.enum(["L", "R"]),
	strikes: ZInputStringNumber,
	svId: z.string(),
	szBot: ZInputStringNumber,
	szTop: ZInputStringNumber,
	// tfsDeprecated: z.string().transform((x) => (x === "" ? null : x)),
	// tfsZuluDeprecated: z.string().transform((x) => (x === "" ? null : x)),
	// thirdBase: ZPlayerIdNotNull,
	pitchOutcome: z.enum([...PITCH_OUTCOMES]),
	// umpire: z.string().transform((x) => (x === "" ? null : x)),
	// wobaDenom: ZInputStringNumber.nullable(),
	// wobaValue: ZInputStringNumber.nullable(),
	vx0: ZInputStringNumber,
	vy0: ZInputStringNumber,
	vz0: ZInputStringNumber,
	zone: z
		.enum([
			"",
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			"11",
			"12",
			"13",
			"14",
		])
		.transform((x) => (x === "" ? null : x)),
});

export type TRowInputPitchFx = z.infer<typeof ZRowInputPitchFx>;

export const ZRowOutputPitchFx = z.object({
	atBatNumber: z.number(),
	awayScore: z.number(),
	awayTeam: z.string(),
	ax: z.number(),
	ay: z.number(),
	az: z.number(),
	batterId: z.string(),
	batScore: z.number(),
	balls: z.number(),
	bbType: z.enum(["FLY_BALL", "GROUND_BALL", "LINE_DRIVE", "POPUP"]).nullable(),
	descriptionPitch: z.string(),
	descriptionPlate: z.string(),
	effectiveSpeed: z.number().nullable(),
	events: z
		.enum([
			"fieldOut",
			"homeRun",
			"walk",
			"single",
			"strikeout",
			"groundedIntoDoublePlay",
			"fieldError",
			"hitByPitch",
			"double",
			"sacBunt",
			"forceOut",
			"triple",
			"intentionalWalk",
			"caughtStealing2B",
			"sacFly",
			"fieldersChoiceOut",
			"pickoff2B",
			"strikeoutDoublePlay",
			"doublePlay",
			"triplePlay",
			"fieldersChoice",
			"pickoff1B",
			"runnerDoublePlay",
			"otherOut",
			"wildPitch",
		])
		.nullable(),
	fldScore: z.number(),
	gameDate: ZRegexDate,
	gameId: z.string(),
	gameType: z.enum(["E", "S", "R", "F", "D", "L", "W"]),
	gameYear: z.number(),
	hcX: z.number().nullable(),
	hcY: z.number().nullable(),
	hitDistanceSc: z.number().nullable(),
	hitLocation: z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9"]).nullable(),
	homeScore: z.number(),
	homeTeam: z.string(),
	inning: z.number(),
	isoValue: z.number().nullable(),
	isTopOfInning: z.boolean(),
	launchAngle: z.number().nullable(),
	launchSpeed: z.number().nullable(),
	launchSpeedAngle: z.number().nullable(),
	outs: z.number(),
	pfxX: z.number(),
	pfxZ: z.number(),
	pitchName: z
		.enum([
			"changeup",
			"cutter",
			"curveball",
			"eephus",
			"fastball",
			"forkball",
			"intentionalBall",
			"knuckleball",
			"knucklecurve",
			"other",
			"pitchout",
			"screwball",
			"sinker",
			"slider",
			"splitter",
		])
		.nullable(),
	pitchNumber: z.number(),
	pitchType: z.enum([
		"CH",
		"CU",
		"EP",
		"FA",
		"FC",
		"FO",
		"FF",
		"FS",
		"FT",
		"IN",
		"KC",
		"KN",
		"PO",
		"SC",
		"SI",
		"SL",
	]),
	pitcherId: z.string(),
	pitchOutcome: z.enum([...PITCH_OUTCOMES]),
	plateX: z.number(),
	plateZ: z.number(),
	playerName: z.string(),
	pThrows: z.enum(["L", "R"]),
	releaseExtension: z.number().nullable(),
	releasePosX: z.number(),
	releasePosY: z.number(),
	releasePosZ: z.number(),
	releaseSpeed: z.number(),
	releaseSpinRate: z.number().nullable(),
	runner1b: z.string().nullable(),
	runner2b: z.string().nullable(),
	runner3b: z.string().nullable(),
	spinAxis: z.number().nullable(),
	stand: z.enum(["L", "R"]),
	strikes: z.number(),
	svId: z.string(),
	szBot: z.number(),
	szTop: z.number(),
	vx0: z.number(),
	vy0: z.number(),
	vz0: z.number(),
	zone: z
		.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "11", "12", "13", "14"])
		.nullable(),
});

export type TRowOutputPitchFx = z.infer<typeof ZRowOutputPitchFx>;
