import { MAX_BASEBALL_RATING, MIN_BASEBALL_RATING } from "@bbfun/utils";
import { faker } from "@faker-js/faker";
import { z } from "zod";

export const ZCountry = z.object({});
export type TCountry = z.infer<typeof ZCountry>;
export const ZSubregion = z.object({});
export type TSubregion = z.infer<typeof ZSubregion>;
export const ZRegion = z.object({});
export type TRegion = z.infer<typeof ZRegion>;

export const ZRatingNumeric = z
	.number()
	.int()
	.min(MIN_BASEBALL_RATING)
	.max(MAX_BASEBALL_RATING)
	.default(
		faker.number.int({
			max: MAX_BASEBALL_RATING,
			min: MIN_BASEBALL_RATING,
		}),
	);

export const ZNumberNotNull = z
	.string()
	.transform((x) => (x.length === 0 ? 0 : parseInt(x)));
export const ZNumberAllowNull = z
	.string()
	.transform((x) => (x.length === 0 ? null : parseInt(x)));
