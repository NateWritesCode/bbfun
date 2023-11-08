import { z } from "zod";
import { ZEPitchTypes } from ".";

export const ZInputWrangleXPitchPicker = z.object({
	balls: z.number().min(0).max(3),
	changeup: z.number(),
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
export type TInputWrangleXPitchPicker = z.infer<
	typeof ZInputWrangleXPitchPicker
>;

export const ZResponseWrangleXPitchPicker = z.array(z.number()).max(14).min(14);
export type TResponseWrangleXPitchPicker = z.infer<
	typeof ZResponseWrangleXPitchPicker
>;

export const ZInputWrangleXPitchLocater = z.object({
	control: z.number(),
	movement: z.number(),
	pitchName: ZEPitchTypes,
	pitchRating: z.number(),
	pitchNumber: z.number(),
	stuff: z.number(),
});
export type TInputWrangleXPitchLocater = z.infer<
	typeof ZInputWrangleXPitchLocater
>;

export const ZResponseWrangleXPitchLocater = z
	.array(z.number())
	.max(16)
	.min(16);
export type TResponseWrangleXPitchLocater = z.infer<
	typeof ZResponseWrangleXPitchLocater
>;

export const ZInputWrangleYPitchLocater = z.object({
	ax: z.number(),
	ay: z.number(),
	az: z.number(),
	pfxX: z.number(),
	pfxZ: z.number(),
	plateX: z.number(),
	plateZ: z.number(),
	releaseSpeed: z.number(),
	releasePosX: z.number(),
	releasePosY: z.number(),
	releasePosZ: z.number(),
	szBot: z.number(),
	szTop: z.number(),
	vx0: z.number(),
	vy0: z.number(),
	vz0: z.number(),
});
export type TInputWrangleYPitchLocater = z.infer<
	typeof ZInputWrangleYPitchLocater
>;

export const ZResponseWrangleYPitchLocater = z
	.array(z.number())
	.max(16)
	.min(16);
export type TResponseWrangleYPitchLocater = z.infer<
	typeof ZResponseWrangleYPitchLocater
>;

export const ZInputWrangleXPitchOutcome = z.object({
	ax: z.number(),
	ay: z.number(),
	az: z.number(),
	pfxX: z.number(),
	pfxZ: z.number(),
	plateX: z.number(),
	plateZ: z.number(),
	releaseSpeed: z.number(),
	releasePosX: z.number(),
	releasePosY: z.number(),
	releasePosZ: z.number(),
	szBot: z.number(),
	szTop: z.number(),
	vx0: z.number(),
	vy0: z.number(),
	vz0: z.number(),
	avoidKs: z.number(),
	contact: z.number(),
	eye: z.number(),
	gap: z.number(),
	power: z.number(),
});
export type TInputWrangleXPitchOutcome = z.infer<
	typeof ZInputWrangleXPitchOutcome
>;

export const ZResponseWrangleXPitchOutcome = z
	.array(z.number())
	.max(21)
	.min(21);
export type TResponseWrangleXPitchOutcome = z.infer<
	typeof ZResponseWrangleXPitchOutcome
>;

export const ZInputWrangleXPitchInPlay = z.object({
	ax: z.number(),
	ay: z.number(),
	az: z.number(),
	pfxX: z.number(),
	pfxZ: z.number(),
	plateX: z.number(),
	plateZ: z.number(),
	releaseSpeed: z.number(),
	releasePosX: z.number(),
	releasePosY: z.number(),
	releasePosZ: z.number(),
	szBot: z.number(),
	szTop: z.number(),
	vx0: z.number(),
	vy0: z.number(),
	vz0: z.number(),
	contact: z.number(),
	gap: z.number(),
	power: z.number(),
});
export type TInputWrangleXPitchInPlay = z.infer<
	typeof ZInputWrangleXPitchInPlay
>;

export const ZResponseWrangleXPitchInPlay = z.array(z.number()).max(19).min(19);
export type TResponseWrangleXPitchInPlay = z.infer<
	typeof ZResponseWrangleXPitchInPlay
>;
