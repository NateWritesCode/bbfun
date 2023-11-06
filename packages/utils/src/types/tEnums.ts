import {
	GENDER_CIS,
	GENDER_IDENTITY,
	HANDEDNESS,
	POSITIONS,
} from "../constants";
import { z } from "zod";

export const ZEGamePositions = z.enum(POSITIONS);

export type TEGamePositions = z.infer<typeof ZEGamePositions>;

export const ZEHandedness = z.enum(HANDEDNESS);
export type TEHandedness = z.infer<typeof ZEHandedness>;

export const ZEGenderIdentity = z.enum(GENDER_IDENTITY);
export type TEGenderIdentity = z.infer<typeof ZEGenderIdentity>;

export const ZEGenderCis = z.enum(GENDER_CIS);
export type TEGenderCis = z.infer<typeof ZEGenderCis>;
