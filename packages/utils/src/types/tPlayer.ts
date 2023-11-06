import { z } from "zod";
// import { ZEHandedness, ZRatingNumeric } from "@bbfun/utils";

// const ZRatingVsHandedness = z.object({
//   l: ZRatingNumeric,
//   r: ZRatingNumeric,
// });

// const ZRating = z.object({
//   defensive: z.object({
//     catcherAbility: ZRatingNumeric,
//     catcherArm: ZRatingNumeric,
//     infieldRange: ZRatingNumeric,
//     infieldError: ZRatingNumeric,
//     infieldArm: ZRatingNumeric,
//     infieldTurnDp: ZRatingNumeric,
//     outfieldRange: ZRatingNumeric,
//     outfieldError: ZRatingNumeric,
//     outfieldArm: ZRatingNumeric,
//     position: z.object({
//       p: ZRatingNumeric,
//       c: ZRatingNumeric,
//       "1b": ZRatingNumeric,
//       "2b": ZRatingNumeric,
//       "3b": ZRatingNumeric,
//       ss: ZRatingNumeric,
//       lf: ZRatingNumeric,
//       cf: ZRatingNumeric,
//       rf: ZRatingNumeric,
//     }),
//   }),
//   offensive: z.object({
//     avoidKs: ZRatingVsHandedness,
//     baseRunning: ZRatingVsHandedness,
//     buntForHit: ZRatingVsHandedness,
//     contact: ZRatingVsHandedness,
//     eye: ZRatingVsHandedness,
//     gap: ZRatingVsHandedness,
//     power: ZRatingVsHandedness,
//     sacrifeBunt: ZRatingNumeric,
//     speedRunning: ZRatingNumeric,
//     stealing: ZRatingNumeric,
//   }),
//   pitching: z.object({
//     control: ZRatingVsHandedness,
//     holdRunners: ZRatingVsHandedness,
//     movement: ZRatingVsHandedness,
//     stamina: ZRatingNumeric,
//     stuff: ZRatingVsHandedness,
//     pitches: z.object({
//       curveball: ZRatingNumeric,
//       fastball: ZRatingNumeric,
//     }),
//   }),
// });

export const ZPlayer = z.object({
	personId: z.string(),
	ratings: z.object({
		batting: z.object({
			avoidKs: z.number(),
			contact: z.number(),
			eye: z.number(),
			gap: z.number(),
			power: z.number(),
		}),
		pitching: z.object({
			control: z.number(),
			movement: z.number(),
			pitches: z.object({
				changeup: z.number(),
				circlechange: z.number(),
				cutter: z.number(),
				curveball: z.number(),
				fastball: z.number(),
				forkball: z.number(),
				knuckleball: z.number(),
				knucklecurve: z.number(),
				screwball: z.number(),
				sinker: z.number(),
				slider: z.number(),
				splitter: z.number(),
			}),
			stuff: z.number(),
		}),
	}),
	// handednessBat: ZEHandedness,
	// handednessThrow: ZEHandedness,
	// ratings: z.object({
	//   current: ZRating,
	//   potential: ZRating,
	// }),
});
export type TPlayer = z.infer<typeof ZPlayer>;
export const ZPlayers = z.array(ZPlayer);
export type TPlayers = z.infer<typeof ZPlayers>;
