import { z } from "zod";

export const ZPersonHistorical = z
   .object({
      mlbId: z.string(),
      retrosheetId: z.string(),
      bbRefId: z.string(),
      bbRefMinorsId: z.string(),
      fangraphsId: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      givenName: z.string(),
      suffix: z.string().transform((suffix) => suffix || null),
      matrilineal: z.string().transform((matrilineal) => matrilineal || null),
      nickname: z.string().transform((nickname) => nickname || null),
      birthYear: z.string(),
      birthMonth: z.string(),
      birthDay: z.string(),
   })
   .transform(({ birthDay, birthMonth, birthYear, ...person }) => ({
      ...person,
      birthdate: `${birthYear}-${birthMonth}-${birthDay}`,
      id: `${person.firstName} ${person.lastName}`
         .normalize("NFKD") // split accented characters into their base characters and diacritical marks
         .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
         .trim() // trim leading or trailing whitespace
         .toLowerCase() // convert to lowercase
         .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
         .replace(/\s+/g, "-") // replace spaces with hyphens
         .replace(/-+/g, "-"), // remove consecutive hyphens,
   }));

export type TPersonHistorical = z.infer<typeof ZPersonHistorical>;
