import { ZRegexDate, ZRegexSlug } from "./tRegex";
import { ZRowOotpPark, ZRowOotpPlayer } from "./tOotp";
import { z } from "zod";
import dayjs from "dayjs";

export const ZResponseGetGamesForDay = z.object({
   date: z.preprocess(
      (v) => v && dayjs(v as string).format("YYYY-MM-DD"),
      ZRegexDate,
   ),
   id: ZRegexSlug,
   time: z.number(),
   park: z.preprocess(
      // biome-ignore lint/suspicious/noExplicitAny: We're doing a zod parse here, so okay to not know the type
      (v: any) =>
         v && {
            ...v,
            isHomeTeamDugoutAtFirstBase: v?.isHomeTeamDugoutAtFirstBase === 1,
         },
      ZRowOotpPark.omit({ ootpId: true }),
   ),
   teamAway: z.object({
      id: ZRegexSlug,
      name: z.string(),
      nickname: z.string(),
      players: z.array(
         z.preprocess(
            // biome-ignore lint/suspicious/noExplicitAny: We're doing a zod parse here, so okay to not know the type
            (v: any) => {
               if (v) {
                  return {
                     ...v,
                     ratings: JSON.parse(v.ratings),
                  };
               }

               return v;
            },
            ZRowOotpPlayer.pick({
               id: true,
               firstName: true,
               lastName: true,
               position: true,
               ratings: true,
            }),
         ),
      ),
   }),
   teamHome: z.object({
      id: ZRegexSlug,
      name: z.string(),
      nickname: z.string(),
      players: z.array(
         z.preprocess(
            // biome-ignore lint/suspicious/noExplicitAny: We're doing a zod parse here, so okay to not know the type
            (v: any) => {
               if (v) {
                  return {
                     ...v,
                     ratings: JSON.parse(v.ratings),
                  };
               }

               return v;
            },
            ZRowOotpPlayer.pick({
               id: true,
               firstName: true,
               lastName: true,
               position: true,
               ratings: true,
            }),
         ),
      ),
   }),
});
export type TResponseGetGamesForDay = z.infer<typeof ZResponseGetGamesForDay>;
