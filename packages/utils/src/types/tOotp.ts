import { z } from "zod";

const ZRowOotpPitches = z.object({
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
});

export const ZRowOotp = z.object({
	avoidKs: z.number(),
	baserunning: z.number(),
	bbRefId: z.string(),
	contact: z.number(),
	control: z.number(),
	eye: z.number(),
	gap: z.number(),
	id: z.string(),
	movement: z.number(),
	pitches: ZRowOotpPitches,
	power: z.number(),
	speed: z.number(),
	stealing: z.number(),
	stuff: z.number(),
});
export type TRowOotp = z.infer<typeof ZRowOotp>;
