import { z } from "zod";
import { ZNumberAllowNull, ZNumberNotNull } from "./tGeneral";

export const ZRowPitchFx = z.object({
	atBatNumber: ZNumberNotNull,
	awayScore: ZNumberNotNull,
	awayTeam: z.string(),
	ax: ZNumberNotNull,
	ay: ZNumberNotNull,
	az: ZNumberNotNull,
	// babipValue: ZNumberAllowNull,
	batterId: z.string(),
	batScore: ZNumberNotNull,
	balls: ZNumberNotNull,
	bbType: z
		.enum(["", "fly_ball", "ground_ball", "line_drive", "popup"])
		.transform((x) => (x === "" ? null : x)),
	// breakAngleDeprecated: ZNumberAllowNull,
	// breakLengthDeprecated: ZNumberAllowNull,
	// catcher: ZPlayerIdNotNull,
	// centerField: ZPlayerIdNotNull,
	// deltaHomeWinExp: ZNumberNotNull,
	// deltaRunExp: ZNumberNotNull,
	descriptionPitch: z.string(),
	descriptionPlate: z.string(),
	effectiveSpeed: ZNumberAllowNull,
	// estimatedBaUsingSpeedAngle: ZNumberAllowNull,
	// estimatedWobaUsingSpeedAngle: ZNumberAllowNull,
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
		.transform((x) => (x === "" ? null : x)),
	// firstBase: ZPlayerIdNotNull,
	fldScore: ZNumberNotNull,
	gameDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
	gameId: z.string(),
	gameType: z.enum(["E", "S", "R", "F", "D", "L", "W"]),
	gameYear: ZNumberNotNull,
	hcX: ZNumberAllowNull,
	hcY: ZNumberAllowNull,
	hitDistanceSc: ZNumberAllowNull,
	hitLocation: z
		.enum(["", "1", "2", "3", "4", "5", "6", "7", "8", "9"])
		.transform((x) => (x === "" ? null : x)),
	homeScore: ZNumberNotNull,
	homeTeam: z.string(),
	// ifFieldingAlignment: z.string(),
	inning: ZNumberNotNull,
	isoValue: ZNumberAllowNull,
	isTopOfInning: z.enum(["Top", "Bot"]).transform((x) => x === "Top"),
	launchAngle: ZNumberAllowNull,
	launchSpeed: ZNumberAllowNull,
	launchSpeedAngle: ZNumberAllowNull,
	// leftField: ZPlayerIdNotNull,
	// ofFieldingAlignment: z.string(),
	outs: ZNumberNotNull,
	pfxX: ZNumberNotNull,
	pfxZ: ZNumberNotNull,
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
					return "intentional-ball";
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
	pitchNumber: ZNumberNotNull,
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
	plateX: ZNumberNotNull,
	plateZ: ZNumberNotNull,
	playerName: z.string(),
	pThrows: z.enum(["L", "R"]),
	// postAwayScore: ZNumberNotNull,
	// postHomeScore: ZNumberNotNull,
	// postFldScore: ZNumberNotNull,
	releaseExtension: ZNumberAllowNull,
	releasePosX: ZNumberNotNull,
	releasePosY: ZNumberNotNull,
	releasePosZ: ZNumberNotNull,
	releaseSpeed: ZNumberNotNull,
	releaseSpinRate: ZNumberAllowNull,
	// rightField: ZPlayerIdNotNull,
	runner1b: z.string().transform((x) => (x === "" ? null : x)),
	runner2b: z.string().transform((x) => (x === "" ? null : x)),
	runner3b: z.string().transform((x) => (x === "" ? null : x)),
	// secondBase: ZPlayerIdNotNull,
	// shortstop: ZPlayerIdNotNull,
	spinAxis: ZNumberAllowNull,
	// spinDirDeprecated: ZNumberAllowNull,
	// spinRateDeprecated: ZNumberAllowNull,
	stand: z.enum(["L", "R"]),
	strikes: ZNumberNotNull,
	svId: z.string(),
	szBot: ZNumberNotNull,
	szTop: ZNumberNotNull,
	// tfsDeprecated: z.string().transform((x) => (x === "" ? null : x)),
	// tfsZuluDeprecated: z.string().transform((x) => (x === "" ? null : x)),
	// thirdBase: ZPlayerIdNotNull,
	type: z.enum(["B", "S", "X"]),
	// umpire: z.string().transform((x) => (x === "" ? null : x)),
	// wobaDenom: ZNumberAllowNull,
	// wobaValue: ZNumberAllowNull,
	vx0: ZNumberNotNull,
	vy0: ZNumberNotNull,
	vz0: ZNumberNotNull,
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

export type TRowPitchFx = z.infer<typeof ZRowPitchFx>;
