import { z } from "zod";
import { ZRegexSlug, ZRegexSlugCity } from "./tRegex";

export const ZTeam = z.object({
   cityId: ZRegexSlugCity,
   colors: z.object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string(),
   }),
   id: ZRegexSlug,
   nickname: z.string(),
   slug: ZRegexSlug,
   venueId: ZRegexSlug,
});
export type TTeam = z.infer<typeof ZTeam>;
export const ZTeams = z.array(ZTeam);
export type TTeams = z.infer<typeof ZTeams>;
