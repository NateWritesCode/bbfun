import { POSITIONS } from "src";
import { z } from "zod";
import { ZRegexColor, ZRegexDate, ZRegexSlug } from ".";

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

const ZRowOotpPlayerRatingsFieldingCatcher = z.object({
   ability: z.number(),
   arm: z.number(),
});

const ZRowOotpPlayerRatingsFieldingInfield = z.object({
   arm: z.number(),
   doublePlay: z.number(),
   error: z.number(),
   range: z.number(),
});

const ZRowOotpPlayerRatingsFieldingOutfield = z.object({
   arm: z.number(),
   error: z.number(),
   range: z.number(),
});

const ZRowOotpPlayerRatingsFieldingPositionRating = z.object({
   experience: z.number(),
   rating: z.number(),
});

const ZRowOotpPlayerRatingsFieldingPosition = z.object({
   p: ZRowOotpPlayerRatingsFieldingPositionRating,
   c: ZRowOotpPlayerRatingsFieldingPositionRating,
   "1b": ZRowOotpPlayerRatingsFieldingPositionRating,
   "2b": ZRowOotpPlayerRatingsFieldingPositionRating,
   "3b": ZRowOotpPlayerRatingsFieldingPositionRating,
   ss: ZRowOotpPlayerRatingsFieldingPositionRating,
   lf: ZRowOotpPlayerRatingsFieldingPositionRating,
   cf: ZRowOotpPlayerRatingsFieldingPositionRating,
   rf: ZRowOotpPlayerRatingsFieldingPositionRating,
});

const ZRowOotpPlayerRatingsFielding = z.object({
   catcher: ZRowOotpPlayerRatingsFieldingCatcher,
   infield: ZRowOotpPlayerRatingsFieldingInfield,
   outfield: ZRowOotpPlayerRatingsFieldingOutfield,
   position: ZRowOotpPlayerRatingsFieldingPosition,
});

const ZRowOotpPlayerRatings = z.object({
   batting: ZRowOotpPlayerRatingsBatting,
   fielding: ZRowOotpPlayerRatingsFielding,
   pitching: ZRowOotpPlayerRatingsPitching,
   running: ZRowOotpPlayerRatingsRunning,
});

export const ZRowOotpPlayer = z.object({
   bbRefId: z.string(),
   dateOfBirth: ZRegexDate,
   firstName: z.string(),
   id: ZRegexSlug,
   lastName: z.string(),
   nickname: z.string().nullable(),
   ootpId: z.string(),
   position: z.enum([...POSITIONS]),
   ratings: ZRowOotpPlayerRatings,
   slug: ZRegexSlug,
   teamId: ZRegexSlug.nullable(),
});
export type TRowOotpPlayer = z.infer<typeof ZRowOotpPlayer>;

export const ZRowOotpLeague = z.object({
   abbrev: z.string(),
   id: ZRegexSlug,
   name: z.string(),
   ootpId: z.string(),
   slug: ZRegexSlug,
});
export type TRowOotpLeague = z.infer<typeof ZRowOotpLeague>;

export const ZRowOotpSubLeague = z.object({
   abbrev: z.string(),
   id: ZRegexSlug,
   leagueId: ZRegexSlug,
   name: z.string(),
   ootpId: z.string(),
   slug: ZRegexSlug,
});
export type TRowOotpSubLeague = z.infer<typeof ZRowOotpSubLeague>;

export const ZRowOotpDivision = z.object({
   id: ZRegexSlug,
   leagueId: ZRegexSlug,
   name: z.string(),
   ootpId: z.string(),
   slug: ZRegexSlug,
   subLeagueId: ZRegexSlug,
});
export type TRowOotpDivision = z.infer<typeof ZRowOotpDivision>;

export const ZRowOotpPark = z.object({
   avg: z.number(),
   avgL: z.number(),
   avgR: z.number(),
   basesX0: z.number(),
   basesX1: z.number(),
   basesX2: z.number(),
   basesY0: z.number(),
   basesY1: z.number(),
   basesY2: z.number(),
   batterLeftX: z.number(),
   batterLeftY: z.number(),
   batterRightX: z.number(),
   batterRightY: z.number(),
   capacity: z.number(),
   d: z.number(),
   dimensionsX: z.number(),
   dimensionsY: z.number(),
   distances0: z.number(),
   distances1: z.number(),
   distances2: z.number(),
   distances3: z.number(),
   distances4: z.number(),
   distances5: z.number(),
   distances6: z.number(),
   foulGround: z.number(),
   hr: z.number(),
   hrL: z.number(),
   hrR: z.number(),
   id: ZRegexSlug,
   isHomeTeamDugoutAtFirstBase: z.boolean(),
   name: z.string(),
   ootpId: ZRegexSlug,
   positionsX0: z.number(),
   positionsX1: z.number(),
   positionsX2: z.number(),
   positionsX3: z.number(),
   positionsX4: z.number(),
   positionsX5: z.number(),
   positionsX6: z.number(),
   positionsX7: z.number(),
   positionsX8: z.number(),
   positionsX9: z.number(),
   positionsY0: z.number(),
   positionsY1: z.number(),
   positionsY2: z.number(),
   positionsY3: z.number(),
   positionsY4: z.number(),
   positionsY5: z.number(),
   positionsY6: z.number(),
   positionsY7: z.number(),
   positionsY8: z.number(),
   positionsY9: z.number(),
   rain0: z.number(),
   rain1: z.number(),
   rain2: z.number(),
   rain3: z.number(),
   rain4: z.number(),
   rain5: z.number(),
   rain6: z.number(),
   rain7: z.number(),
   rain8: z.number(),
   rain9: z.number(),
   rain10: z.number(),
   rain11: z.number(),
   slug: ZRegexSlug,
   t: z.number(),
   temperature0: z.number(),
   temperature1: z.number(),
   temperature2: z.number(),
   temperature3: z.number(),
   temperature4: z.number(),
   temperature5: z.number(),
   temperature6: z.number(),
   temperature7: z.number(),
   temperature8: z.number(),
   temperature9: z.number(),
   temperature10: z.number(),
   temperature11: z.number(),
   turf: z.number(),
   type: z.number(),
   wallHeights0: z.number(),
   wallHeights1: z.number(),
   wallHeights2: z.number(),
   wallHeights3: z.number(),
   wallHeights4: z.number(),
   wallHeights5: z.number(),
   wallHeights6: z.number(),
   wind: z.number(),
   windDirection: z.number(),
});
export type TRowOotpPark = z.infer<typeof ZRowOotpPark>;

export const ZRowOotpTeam = z.object({
   abbrev: z.string(),
   backgroundColor: ZRegexColor,
   divisionId: ZRegexSlug,
   hatMainColor: ZRegexColor,
   hatVisorColor: ZRegexColor,
   historicalId: z.string(),
   id: ZRegexSlug,
   jerseyAwayColor: ZRegexColor,
   jerseyMainColor: ZRegexColor,
   jerseyPinStripeColor: ZRegexColor,
   jerseySecondaryColor: ZRegexColor,
   leagueId: ZRegexSlug,
   name: z.string(),
   nickname: z.string(),
   ootpId: z.string(),
   parkId: ZRegexSlug.nullable(),
   slug: ZRegexSlug,
   subLeagueId: ZRegexSlug,
   textColor: ZRegexColor,
});
export type TRowOotpTeam = z.infer<typeof ZRowOotpTeam>;

export const ZRowOotpGame = z.object({
   date: ZRegexDate,
   id: ZRegexSlug,
   leagueId: ZRegexSlug,
   teamIdAway: ZRegexSlug,
   teamIdHome: ZRegexSlug,
   ootpId: z.string(),
   time: z.number().max(2359),
});

export type TRowOotpGame = z.infer<typeof ZRowOotpGame>;
