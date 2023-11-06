import { z } from "zod";
import { ZRegexSlug, ZRegexSlugCity } from "./tRegex";

export const ZVenue = z.object({
	capacity: z.number(),
	cityId: ZRegexSlugCity,
	id: ZRegexSlug,
	name: z.string(),
	slug: ZRegexSlug,
});
export type TVenue = z.infer<typeof ZVenue>;
export const ZVenues = z.array(ZVenue);
export type TVenues = z.infer<typeof ZVenues>;
