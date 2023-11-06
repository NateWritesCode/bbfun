import { execSync } from "child_process";
import { z } from "zod";

const MAPS = {
	POSITIONS: {
		"1": "p",
		"2": "c",
		"3": "1b",
		"4": "2b",
		"5": "3b",
		"6": "ss",
		"7": "lf",
		"8": "cf",
		"9": "rf",
		"10": "dh",
	},
};

const ZTeamId = z.string().length(3);
const ZLeagueId = z.string().length(2);
const ZNumberNotNull = z
	.string()
	.transform((x) => (x.length === 0 ? 0 : parseInt(x)));
const ZNumberAllowNull = z
	.string()
	.transform((x) => (x.length === 0 ? null : parseInt(x)));
const ZYear = z
	.string()
	.length(4)
	.transform((x) => parseInt(x));
const ZStringNotNull = z.string().min(1);
const ZPlayerId = ZStringNotNull;
const ZPlayoffRounds = z.enum([
	"WS",
	"CS",
	"NLCS",
	"ALCS",
	"NEDIV",
	"AWDIV",
	"NWDIV",
	"AEDIV",
	"ALDS1",
	"NLDS2",
	"NLDS1",
	"ALDS2",
	"ALWC",
	"NLWC",
	"ALWC4",
	"NLWC4",
	"ALWC1",
	"NLWC2",
	"NLWC3",
	"ALWC3",
	"NLWC1",
	"ALWC2",
]);

const ZParkId = ZStringNotNull;

const ZPositionAbbrev = z
	.enum(["SS", "2B", "OF", "C", "1B", "3B", "P", "LF", "RF", "CF"])
	.transform((pos) => {
		switch (pos) {
			case "SS":
				return "ss";
			case "2B":
				return "2b";
			case "OF":
				return "of";
			case "LF":
				return "lf";
			case "CF":
				return "cf";
			case "RF":
				return "rf";
			case "C":
				return "c";
			case "1B":
				return "1b";
			case "3B":
				return "3b";
			case "P":
				return "p";
			default:
				throw new Error("Invalid position");
		}
	});

const ZPositionNumeric = z
	.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", ""])
	.transform((pos) => (pos ? MAPS.POSITIONS[pos] : null));

const ZRegexDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

const ZYNtoTF = z.enum(["Y", "N"]).transform((x) => x === "Y");

// International stadiums throw off state from just US
const ZState = z.string();
const ZCountry = z.string().length(2);

const ZRetrosheetId = ZStringNotNull;
const ZBaseballReferenceId = ZStringNotNull;

const HELPER_OBJ = {
	//   AllstarFull: {
	//     columns: [
	//       {
	//         description: "Player ID code",
	//         key: "playerId",
	//       },
	//       {
	//         description: "Year of game",
	//         key: "yearId",
	//       },
	//       {
	//         description:
	//           "Game number (zero if only one All-Star game played that season)",
	//         key: "gameNum",
	//       },
	//       {
	//         description: "Game ID",
	//         key: "gameId",
	//       },
	//       {
	//         description:
	//           "Team abbreviation of the team on which the All-Star player represented",
	//         key: "teamId",
	//       },
	//       {
	//         description:
	//           "League ID of the team on which the All-Star player represented",
	//         key: "leagueId",
	//       },
	//       {
	//         description:
	//           "Number of games the player was on the roster of the All-Star team",
	//         key: "gp",
	//       },
	//       {
	//         description: "Starting position represented by the player",
	//         key: "startingPos",
	//       },
	//     ],
	//     newFilename: "allstarFull",
	//     zodObj: z.object({
	//       playerId: ZPlayerId,
	//       yearId: ZYear,
	//       gameNum: z.enum(["0", "1", "2"]).transform((x) => parseInt(x)),
	//       gameId: z.string(),
	//       teamId: ZTeamId,
	//       leagueId: ZLeagueId,
	//       gp: ZNumberNotNull,
	//       startingPos: ZPositionNumeric,
	//     }),
	//   },
	//   Appearances: {
	//     columns: [
	//       {
	//         description: "Year",
	//         key: "yearId",
	//       },
	//       {
	//         key: "teamId",
	//         description: "Team",
	//       },
	//       { description: "League", key: "leagueId" },
	//       { description: "Player", key: "playerId" },
	//       { description: "Games all", key: "gAll" },
	//       { description: "Games started", key: "gS" },
	//       { description: "Games batting", key: "gBatting" },
	//       { description: "Games defense", key: "gDefense" },
	//       { description: "Games pitching", key: "gP" },
	//       { description: "Games catcher", key: "gC" },
	//       { description: "Games 1st base", key: "g1b" },
	//       { description: "Games 2nd base", key: "g2b" },
	//       { description: "Games 3rd base", key: "g3b" },
	//       { description: "Games SS", key: "gSs" },
	//       { description: "Games left field", key: "gLf" },
	//       { description: "Games center field", key: "gCf" },
	//       { description: "Games right field", key: "gRf" },
	//       { description: "Games outfield", key: "gOf" },
	//       { description: "Games DH", key: "gDh" },
	//       { description: "Games pinch hitting", key: "gPh" },
	//       { description: "Games pinch running", key: "gPr" },
	//     ],
	//     newFilename: "appearances",
	//     zodObj: z.object({
	//       gAll: ZNumberNotNull,
	//       gS: ZNumberNotNull,
	//       gBatting: ZNumberNotNull,
	//       gDefense: ZNumberNotNull,
	//       gP: ZNumberNotNull,
	//       gC: ZNumberNotNull,
	//       g1b: ZNumberNotNull,
	//       g2b: ZNumberNotNull,
	//       g3b: ZNumberNotNull,
	//       gSs: ZNumberNotNull,
	//       gLf: ZNumberNotNull,
	//       gCf: ZNumberNotNull,
	//       gRf: ZNumberNotNull,
	//       gOf: ZNumberNotNull,
	//       gDh: ZNumberNotNull,
	//       gPh: ZNumberNotNull,
	//       gPr: ZNumberNotNull,
	//       leagueId: ZLeagueId,
	//       playerId: ZPlayerId,
	//       teamId: ZTeamId,
	//       yearId: ZYear,
	//     }),
	//   },
	//   Batting: {
	//     columns: [
	//       { description: "", key: "playerId" },
	//       { description: "", key: "yearId" },
	//       {
	//         description: "player's stint (order of appearances within a season)",
	//         key: "stint",
	//       },
	//       { description: "", key: "teamId" },
	//       { description: "", key: "leagueId" },
	//       { description: "", key: "g" },
	//       { description: "", key: "ab" },
	//       { description: "", key: "r" },
	//       { description: "", key: "h" },
	//       { description: "", key: "2b" },
	//       { description: "", key: "3b" },
	//       { description: "", key: "hr" },
	//       { description: "", key: "rbi" },
	//       { description: "", key: "sb" },
	//       { description: "", key: "cs" },
	//       { description: "", key: "bb" },
	//       { description: "", key: "so" },
	//       { description: "", key: "ibb" },
	//       { description: "", key: "hbp" },
	//       { description: "", key: "sh" },
	//       { description: "", key: "sf" },
	//       { description: "", key: "gidp" },
	//     ],
	//     newFilename: "batting",
	//     zodObj: z.object({
	//       leagueId: ZLeagueId,
	//       playerId: ZPlayerId,
	//       teamId: ZTeamId,
	//       yearId: ZYear,
	//       stint: ZNumberNotNull,
	//       "2b": ZNumberNotNull,
	//       "3b": ZNumberNotNull,
	//       hr: ZNumberNotNull,
	//       ab: ZNumberNotNull,
	//       g: ZNumberNotNull,
	//       r: ZNumberNotNull,
	//       sb: ZNumberNotNull,
	//       cs: ZNumberNotNull,
	//       bb: ZNumberNotNull,
	//       so: ZNumberNotNull,
	//       ibb: ZNumberNotNull,
	//       hbp: ZNumberNotNull,
	//       sh: ZNumberNotNull,
	//       sf: ZNumberNotNull,
	//       gidp: ZNumberNotNull,
	//     }),
	//   },
	//   BattingPost: {
	//     columns: [
	//       { description: "", key: "yearId" },
	//       { description: "Level of playoffs", key: "round" },
	//       { description: "", key: "playerId" },
	//       { description: "", key: "teamId" },
	//       { description: "", key: "leagueId" },
	//       { description: "", key: "g" },
	//       { description: "", key: "ab" },
	//       { description: "", key: "r" },
	//       { description: "", key: "h" },
	//       { description: "", key: "2b" },
	//       { description: "", key: "3b" },
	//       { description: "", key: "hr" },
	//       { description: "", key: "rbi" },
	//       { description: "", key: "sb" },
	//       { description: "", key: "cs" },
	//       { description: "", key: "bb" },
	//       { description: "", key: "so" },
	//       { description: "", key: "ibb" },
	//       { description: "", key: "hbp" },
	//       { description: "", key: "sh" },
	//       { description: "", key: "sf" },
	//       { description: "", key: "gidp" },
	//     ],
	//     newFilename: "battingPostseason",
	//     zodObj: z.object({
	//       leagueId: ZLeagueId,
	//       playerId: ZPlayerId,
	//       round: ZPlayoffRounds,
	//       teamId: ZTeamId,
	//       yearId: ZYear,
	//       "2b": ZNumberNotNull,
	//       "3b": ZNumberNotNull,
	//       hr: ZNumberNotNull,
	//       ab: ZNumberNotNull,
	//       g: ZNumberNotNull,
	//       r: ZNumberNotNull,
	//       sb: ZNumberNotNull,
	//       cs: ZNumberNotNull,
	//       bb: ZNumberNotNull,
	//       so: ZNumberNotNull,
	//       ibb: ZNumberNotNull,
	//       hbp: ZNumberNotNull,
	//       sh: ZNumberNotNull,
	//       sf: ZNumberNotNull,
	//       gidp: ZNumberNotNull,
	//     }),
	//   },
	//   Fielding: {
	//     columns: [
	//       { description: "", key: "playerId" },
	//       { description: "", key: "yearId" },
	//       {
	//         description: "player's stint (order of appearances within a season)",
	//         key: "stint",
	//       },
	//       { description: "", key: "teamId" },
	//       { description: "", key: "leagueId" },
	//       { description: "", key: "position" },
	//       { description: "", key: "g" },
	//       { description: "", key: "gs" },
	//       {
	//         description: "Time played in the field expressed as outs",
	//         key: "innOuts",
	//       },
	//       { description: "", key: "po" },
	//       { description: "", key: "a" },
	//       { description: "", key: "e" },
	//       { description: "", key: "dp" },
	//       { description: "", key: "pb" },
	//       { description: "", key: "wp" },
	//       { description: "", key: "sb" },
	//       { description: "", key: "cs" },
	//       { description: "", key: "zr" },
	//     ],
	//     newFilename: "fielding",
	//     zodObj: z.object({
	//       playerId: ZPlayerId,
	//       yearId: ZYear,
	//       stint: ZNumberNotNull,
	//       teamId: ZTeamId,
	//       leagueId: ZLeagueId,
	//       position: ZPositionAbbrev,
	//       g: ZNumberNotNull,
	//       gs: ZNumberNotNull,
	//       innOuts: ZNumberNotNull,
	//       po: ZNumberNotNull,
	//       a: ZNumberNotNull,
	//       e: ZNumberNotNull,
	//       dp: ZNumberNotNull,
	//       pb: ZNumberNotNull,
	//       wp: ZNumberNotNull,
	//       sb: ZNumberNotNull,
	//       cs: ZNumberNotNull,
	//       zr: ZNumberNotNull,
	//     }),
	//   },
	//   FieldingOF: {
	//     columns: [
	//       { description: "", key: "playerId" },
	//       { description: "", key: "yearId" },
	//       { description: "", key: "stint" },
	//       { description: "", key: "gLf" },
	//       { description: "", key: "gCf" },
	//       { description: "", key: "gRf" },
	//     ],
	//     newFilename: "fieldingOf",
	//     zodObj: z.object({
	//       playerId: ZPlayerId,
	//       yearId: ZYear,
	//       stint: ZNumberNotNull,
	//       gLf: ZNumberNotNull,
	//       gCf: ZNumberNotNull,
	//       gRf: ZNumberNotNull,
	//     }),
	//   },
	//   FieldingOFsplit: {
	//     columns: [
	//       { description: "", key: "playerId" },
	//       { description: "", key: "yearId" },
	//       { description: "", key: "stint" },
	//       { description: "", key: "teamId" },
	//       { description: "", key: "leagueId" },
	//       { description: "", key: "position" },
	//       { description: "", key: "g" },
	//       { description: "", key: "gs" },
	//       { description: "", key: "innOuts" },
	//       { description: "", key: "po" },
	//       { description: "", key: "a" },
	//       { description: "", key: "e" },
	//       { description: "", key: "dp" },
	//       { description: "", key: "pb" },
	//       { description: "", key: "wp" },
	//       { description: "", key: "sb" },
	//       { description: "", key: "cs" },
	//       { description: "", key: "zr" },
	//     ],
	//     newFilename: "fieldingOfSplit",
	//     zodObj: z.object({
	//       playerId: ZPlayerId,
	//       yearId: ZYear,
	//       stint: ZNumberNotNull,
	//       teamId: ZTeamId,
	//       leagueId: ZLeagueId,
	//       position: ZPositionAbbrev,
	//       g: ZNumberNotNull,
	//       gs: ZNumberNotNull,
	//       innOuts: ZNumberNotNull,
	//       po: ZNumberNotNull,
	//       a: ZNumberNotNull,
	//       e: ZNumberNotNull,
	//       dp: ZNumberNotNull,
	//       pb: ZNumberNotNull,
	//       wp: ZNumberNotNull,
	//       sb: ZNumberNotNull,
	//       cs: ZNumberNotNull,
	//       zr: ZNumberNotNull,
	//     }),
	//   },
	//   FieldingPost: {
	//     columns: [
	//       { description: "", key: "playerId" },
	//       { description: "", key: "yearId" },
	//       { description: "", key: "teamId" },
	//       { description: "", key: "leagueId" },
	//       { description: "", key: "round" },
	//       { description: "", key: "position" },
	//       { description: "", key: "g" },
	//       { description: "", key: "gs" },
	//       { description: "", key: "innOuts" },
	//       { description: "", key: "po" },
	//       { description: "", key: "a" },
	//       { description: "", key: "e" },
	//       { description: "", key: "dp" },
	//       { description: "", key: "tp" },
	//       { description: "", key: "pb" },
	//       { description: "", key: "sb" },
	//       { description: "", key: "cs" },
	//     ],
	//     newFilename: "fieldingPostseason",
	//     zodObj: z.object({
	//       playerId: ZPlayerId,
	//       yearId: ZYear,
	//       teamId: ZTeamId,
	//       leagueId: ZLeagueId,
	//       round: ZPlayoffRounds,
	//       position: ZPositionAbbrev,
	//       g: ZNumberNotNull,
	//       gs: ZNumberNotNull,
	//       innOuts: ZNumberNotNull,
	//       po: ZNumberNotNull,
	//       a: ZNumberNotNull,
	//       e: ZNumberNotNull,
	//       dp: ZNumberNotNull,
	//       tp: ZNumberNotNull,
	//       pb: ZNumberNotNull,
	//       sb: ZNumberNotNull,
	//       cs: ZNumberNotNull,
	//     }),
	//   },
	//   HomeGames: {
	//     columns: [
	//       { description: "", key: "yearId" },
	//       { description: "", key: "leagueId" },
	//       { description: "", key: "teamId" },
	//       { description: "", key: "parkId" },
	//       {
	//         description:
	//           "First date the park began acting as home field for the team",
	//         key: "spanFirst",
	//       },
	//       {
	//         description:
	//           "Last date the park began acting as home field for the team",
	//         key: "spanLast",
	//       },
	//       { description: "Total games in this time span", key: "numGames" },
	//       { description: "Total opening in this time span", key: "numOpenings" },
	//       {
	//         description: "Total attendance in this time span",
	//         key: "numAttendance",
	//       },
	//     ],
	//     newFilename: "homeGames",
	//     zodObj: z.object({
	//       yearId: ZYear,
	//       leagueId: ZLeagueId,
	//       teamId: ZTeamId,
	//       parkId: ZParkId,
	//       spanFirst: ZRegexDate,
	//       spanLast: ZRegexDate,
	//       numGames: ZNumberNotNull,
	//       numOpenings: ZNumberNotNull,
	//       numAttendance: ZNumberNotNull,
	//     }),
	//   },
	//   Managers: {
	//     columns: [
	//       { description: "", key: "playerId" },
	//       { description: "", key: "yearId" },
	//       { description: "", key: "teamId" },
	//       { description: "", key: "leagueId" },
	//       {
	//         description:
	//           "Managerial order. Zero if the individual managed the team the entire year. Otherwise denotes where the manager appeared in the managerial order (1 for first manager, 2 for second, etc.)",
	//         key: "inseason",
	//       },
	//       { description: "", key: "g" },
	//       { description: "", key: "w" },
	//       { description: "", key: "l" },
	//       {
	//         description: "Team's final position in standings that year",
	//         key: "rank",
	//       },
	//       { description: "", key: "isPlayerManager" },
	//     ],
	//     newFilename: "managers",
	//     zodObj: z.object({
	//       playerId: ZPlayerId,
	//       yearId: ZYear,
	//       teamId: ZTeamId,
	//       leagueId: ZLeagueId,
	//       inseason: ZNumberNotNull,
	//       g: ZNumberNotNull,
	//       w: ZNumberNotNull,
	//       l: ZNumberNotNull,
	//       rank: ZNumberNotNull,
	//       isPlayerManager: ZYNtoTF,
	//     }),
	//   },
	//   ManagersHalf: {
	//     columns: [
	//       { description: "", key: "playerId" },
	//       { description: "", key: "yearId" },
	//       { description: "", key: "teamId" },
	//       { description: "", key: "leagueId" },
	//       { description: "", key: "inseason" },
	//       { description: "First or second half of season", key: "half" },
	//       { description: "", key: "g" },
	//       { description: "", key: "w" },
	//       { description: "", key: "l" },
	//       { description: "", key: "rank" },
	//     ],
	//     newFilename: "managersSplitSeason",
	//     zodObj: z.object({
	//       playerId: ZPlayerId,
	//       yearId: ZYear,
	//       teamId: ZTeamId,
	//       leagueId: ZLeagueId,
	//       inseason: ZNumberNotNull,
	//       half: z.enum(["1", "2"]).transform((x) => parseInt(x)),
	//       g: ZNumberNotNull,
	//       w: ZNumberNotNull,
	//       l: ZNumberNotNull,
	//       rank: ZNumberNotNull,
	//     }),
	//   },
	//   Parks: {
	//     columns: [
	//       { description: "", key: "parkId" },
	//       { description: "", key: "name" },
	//       {
	//         description:
	//           "a semicolon delimited list of other names for the ballpark if they exist",
	//         key: "namesOther",
	//       },
	//       { description: "", key: "city" },
	//       { description: "", key: "state" },
	//       { description: "", key: "country" },
	//     ],
	//     newFilename: "parks",
	//     zodObj: z.object({
	//       parkId: ZParkId,
	//       name: ZStringNotNull,
	//       namesOther: z
	//         .string()
	//         .transform((v) =>
	//           v.length === 0 ? null : v.split(";").map((x) => x.trim())
	//         ),
	//       city: ZStringNotNull,
	//       state: ZState,
	//       country: ZCountry,
	//     }),
	//   },
	People: {
		columns: [
			{
				description: "",
				key: "playerId",
			},
			{
				description: "",
				key: "birthYear",
			},
			{
				description: "",
				key: "birthMonth",
			},
			{
				description: "",
				key: "birthDay",
			},
			{
				description: "",
				key: "birthCountry",
			},
			{
				description: "",
				key: "birthState",
			},
			{
				description: "",
				key: "birthCity",
			},
			{
				description: "",
				key: "deathYear",
			},
			{
				description: "",
				key: "deathMonth",
			},
			{
				description: "",
				key: "deathDay",
			},
			{
				description: "",
				key: "deathCountry",
			},
			{
				description: "",
				key: "deathState",
			},
			{
				description: "",
				key: "deathCity",
			},
			{
				description: "",
				key: "nameFirst",
			},
			{
				description: "",
				key: "nameLast",
			},
			{
				description: "Player's given name (typically first and middle)",
				key: "nameGiven",
			},
			{
				description: "",
				key: "weight",
			},
			{
				description: "",
				key: "height",
			},
			{
				description: "",
				key: "bats",
			},
			{
				description: "",
				key: "throws",
			},
			{
				description: "",
				key: "debut",
			},
			{
				description: "",
				key: "finalGame",
			},
			{
				description: "",
				key: "retrosheetId",
			},
			{
				description: "",
				key: "baseballReferenceId",
			},
		],
		newFilename: "people",
		zodObj: z.object({}),
	},
	//   Pitching: {
	//     playerID: {},
	//     yearId: {},
	//     stint: {},
	//     teamId: {},
	//     leagueId: {},
	//     W: {},
	//     L: {},
	//     G: {},
	//     GS: {},
	//     CG: {},
	//     SHO: {},
	//     SV: {},
	//     IPouts: {},
	//     H: {},
	//     ER: {},
	//     HR: {},
	//     BB: {},
	//     SO: {},
	//     BAOpp: {},
	//     ERA: {},
	//     IBB: {},
	//     WP: {},
	//     HBP: {},
	//     BK: {},
	//     BFP: {},
	//     GF: {},
	//     R: {},
	//     SH: {},
	//     SF: {},
	//     GIDP: {},
	//   },
	//   PitchingPost: {
	//     playerID: {},
	//     yearId: {},
	//     round: {},
	//     teamId: {},
	//     leagueId: {},
	//     W: {},
	//     L: {},
	//     G: {},
	//     GS: {},
	//     CG: {},
	//     SHO: {},
	//     SV: {},
	//     IPouts: {},
	//     H: {},
	//     ER: {},
	//     HR: {},
	//     BB: {},
	//     SO: {},
	//     BAOpp: {},
	//     ERA: {},
	//     IBB: {},
	//     WP: {},
	//     HBP: {},
	//     BK: {},
	//     BFP: {},
	//     GF: {},
	//     R: {},
	//     SH: {},
	//     SF: {},
	//     GIDP: {},
	//   },
	//   SeriesPost: {
	//     yearId: {},
	//     round: {},
	//     teamIdwinner: {},
	//     leagueIdwinner: {},
	//     teamIdloser: {},
	//     leagueIdloser: {},
	//     wins: {},
	//     losses: {},
	//     ties: {},
	//   },
	//   Teams: {
	//     yearId: {},
	//     leagueId: {},
	//     teamId: {},
	//     franchID: {},
	//     divID: {},
	//     Rank: {},
	//     G: {},
	//     Ghome: {},
	//     W: {},
	//     L: {},
	//     DivWin: {},
	//     WCWin: {},
	//     LgWin: {},
	//     WSWin: {},
	//     R: {},
	//     AB: {},
	//     H: {},
	//     "2B": {},
	//     "3B": {},
	//     HR: {},
	//     BB: {},
	//     SO: {},
	//     SB: {},
	//     CS: {},
	//     HBP: {},
	//     SF: {},
	//     RA: {},
	//     ER: {},
	//     ERA: {},
	//     CG: {},
	//     SHO: {},
	//     SV: {},
	//     IPouts: {},
	//     HA: {},
	//     HRA: {},
	//     BBA: {},
	//     SOA: {},
	//     E: {},
	//     DP: {},
	//     FP: {},
	//     name: {},
	//     park: {},
	//     attendance: {},
	//     BPF: {},
	//     PPF: {},
	//     teamIdBR: {},
	//     teamIdlahman45: {},
	//     teamIdretro: {},
	//   },
	//   TeamsFranchises: {
	//     franchID: {},
	//     franchName: {},
	//     active: {},
	//     NAassoc: {},
	//   },
	//   TeamsHalf: {
	//     yearId: {},
	//     leagueId: {},
	//     teamId: {},
	//     Half: {},
	//     divID: {},
	//     DivWin: {},
	//     Rank: {},
	//     G: {},
	//     W: {},
	//     L: {},
	//   },
};
type Filenames = keyof typeof HELPER_OBJ;

const filenames = Object.keys(HELPER_OBJ) as Filenames[];

const PATH_INPUT = "input/historical/lahman";
const PATH_OUTPUT = "output/historical/lahman";
const PATH_COPY = "../server/src/data/historical/lahman";

let counter = 0;

while (counter < 1) {
	// while (counter < filenames.length) {
	// const filename = filenames[counter];
	// const columns = HELPER_OBJ[filename].columns;
	// const newFilename = HELPER_OBJ[filename].newFilename;
	// const zodObj = HELPER_OBJ[filename].zodObj;
	// const filepath = `${PATH_INPUT}/${filename}.csv`;
	// const foo = Bun.file(filepath);
	// const text = await foo.text();
	// const lines = text.trim().split("\n").slice(1);
	// //   Trim and exclude headers
	// const holder = lines.map((line) => {
	// 	const lineValues = line
	// 		.split(",")
	// 		.map((x) => x.trim())
	// 		.map((x) => x.replace(/"/g, ""));
	// 	const holderObj: any = {};
	// 	columns.forEach((column, index) => {
	// 		holderObj[column.key] = lineValues[index];
	// 	});
	// 	return zodObj.parse(holderObj);
	// });
	// await Bun.write(
	// 	`${PATH_OUTPUT}/${newFilename}.json`,
	// 	JSON.stringify(holder, null, 0),
	// );
	counter++;
}
