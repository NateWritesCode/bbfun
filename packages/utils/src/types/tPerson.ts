import { MAX_BASEBALL_RATING, MIN_BASEBALL_RATING } from "@bbfun/utils";
import { z } from "zod";
import { ZEGenderCis, ZEGenderIdentity } from "./tEnums";
import { ZRatingNumeric } from "./tGeneral";
import { ZRegexDate, ZRegexSlug, ZRegexSlugCity } from "./tRegex";

export const ZNickname = z.object({
	dateOrigin: ZRegexDate,
	nickname: z.string(),
	popularity: ZRatingNumeric,
});

export const ZPersonRatings = z.object({
	alignment: z.object({
		chaotic: ZRatingNumeric,
		evil: ZRatingNumeric,
		good: ZRatingNumeric,
		lawful: ZRatingNumeric,
		neutralMorality: ZRatingNumeric,
		neutralOrder: ZRatingNumeric,
	}),
	mental: z.object({
		charisma: ZRatingNumeric,
		constitution: ZRatingNumeric,
		intelligence: ZRatingNumeric,
		loyalty: ZRatingNumeric,
		wisdom: ZRatingNumeric,
		workEthic: ZRatingNumeric,
	}),
	myersBriggs: z.object({
		extraversion: ZRatingNumeric,
		intraversion: ZRatingNumeric,
		sensing: ZRatingNumeric,
		intuition: ZRatingNumeric,
		thinking: ZRatingNumeric,
		feeling: ZRatingNumeric,
		judging: ZRatingNumeric,
		perceiving: ZRatingNumeric,
	}),
	physical: z.object({
		height: z.number(),
		weight: z.number(),
	}),
});

export const ZPerson = z.object({
	birthdate: ZRegexDate,
	birthplaceId: ZRegexSlugCity,
	firstName: z.string(),
	id: ZRegexSlug,
	genderCis: ZEGenderCis,
	genderIdentity: ZEGenderIdentity,
	injuryProneness: z
		.number()
		.int()
		.min(MIN_BASEBALL_RATING)
		.max(MAX_BASEBALL_RATING),
	lastName: z.string().optional(),
	middleNames: z.array(z.string()).nullish(),
	nicknames: z.array(ZNickname).nullish(),
	ratings: ZPersonRatings,
	slug: ZRegexSlug,
});
export const ZPersons = z.array(ZPerson);
export type TPersons = z.infer<typeof ZPersons>;
export type TPerson = z.infer<typeof ZPerson>;
