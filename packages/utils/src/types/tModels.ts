import { z } from "zod";

export const ZInputPitchPicker = z.object({
	balls: z.number().min(0).max(3),
	changeup: z.number(),
	circlechange: z.number(),
	cutter: z.number(),
	curveball: z.number(),
	fastball: z.number(),
	forkball: z.number(),
	knuckleball: z.number(),
	knucklecurve: z.number(),
	outs: z.number().min(0).max(2),
	screwball: z.number(),
	sinker: z.number(),
	slider: z.number(),
	splitter: z.number(),
	strikes: z.number().min(0).max(2),
});
export type TInputPitchPicker = z.infer<typeof ZInputPitchPicker>;

export const ZResponsePitchPicker = z.array(z.number()).max(15).min(15);
export type TResponsePitchPicker = z.infer<typeof ZResponsePitchPicker>;

export const ZInputPitchLocater = z.object({
	control: z.number(),
	movement: z.number(),
	pitchName: z.string(),
	pitchRating: z.number(),
	pitchNumber: z.number(),
	stuff: z.number(),
});
export type TInputPitchLocater = z.infer<typeof ZInputPitchLocater>;

export const ZResponsePitchLocater = z.array(z.number()).max(17).min(17);
export type TResponsePitchLocater = z.infer<typeof ZResponsePitchLocater>;
