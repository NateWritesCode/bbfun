import { z } from "zod";
import { ZRegexSlug } from ".";

const ZRowOotpPlayerRatingsPitches = z.object({
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

const ZRowOotpPlayerRatingsBattingSplitsValues = z.object({
	avoidKs: z.number(),
	contact: z.number(),
	gap: z.number(),
	eye: z.number(),
	power: z.number(),
});

const ZRowOotpPlayerRatingsBattingSplits = z.object({
	l: ZRowOotpPlayerRatingsBattingSplitsValues,
	r: ZRowOotpPlayerRatingsBattingSplitsValues,
});

const ZRowOotpPlayerRatingsBatting = z.object({
	avoidKs: z.number(),
	contact: z.number(),
	eye: z.number(),
	gap: z.number(),
	power: z.number(),
	splits: ZRowOotpPlayerRatingsBattingSplits,
});

const ZRowOotpPlayerRatingsPitchingSplitsValues = z.object({
	balk: z.number(),
	control: z.number(),
	movement: z.number(),
	stuff: z.number(),
	wildPitch: z.number(),
});

const ZRowOotpPlayerRatingsPitchingSplits = z.object({
	l: ZRowOotpPlayerRatingsPitchingSplitsValues,
	r: ZRowOotpPlayerRatingsPitchingSplitsValues,
});

const ZRowOotpPlayerRatingsPitching = z.object({
	balk: z.number(),
	control: z.number(),
	hold: z.number(),
	movement: z.number(),
	pitches: ZRowOotpPlayerRatingsPitches,
	stamina: z.number(),
	stuff: z.number(),
	velocity: z.number(),
	wildPitch: z.number(),
	splits: ZRowOotpPlayerRatingsPitchingSplits,
});

const ZRowOotpPlayerRatingsRunning = z.object({
	baserunning: z.number(),
	speed: z.number(),
	stealing: z.number(),
});

const ZRowOotpPlayerRatings = z.object({
	batting: ZRowOotpPlayerRatingsBatting,
	pitching: ZRowOotpPlayerRatingsPitching,
	running: ZRowOotpPlayerRatingsRunning,
});

export const ZRowOotp = z.object({
	bbRefId: z.string(),
	id: ZRegexSlug,
	ratings: ZRowOotpPlayerRatings,
});
export type TRowOotp = z.infer<typeof ZRowOotp>;
