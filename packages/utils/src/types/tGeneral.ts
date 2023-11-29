import { MAX_BASEBALL_RATING, MIN_BASEBALL_RATING } from "@bbfun/utils";
import { faker } from "@faker-js/faker";
import { ZodTypeAny, z } from "zod";

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

export const ZNumberNotNull = z.number();
export const ZNumberAllowNull = z.number().nullable();

export const ZStringNumberOrNull = z
   .string()
   .transform((value) => (value === "" ? null : value))
   .nullable()
   .refine((value) => value === null || !Number.isNaN(Number(value)), {
      message: "Invalid number",
   })
   .transform((value) => (value === null ? null : Number(value)));

const ZInputStringPipe = (zodPipe: ZodTypeAny) =>
   z
      .string()
      .transform((value) => (value === "" ? null : value))
      .nullable()
      .refine((value) => value === null || !Number.isNaN(Number(value)), {
         message: "Nombre Invalide",
      })
      .transform((value) => (value === null ? 0 : Number(value)))
      .pipe(zodPipe);

export const ZInputStringNumber = ZInputStringPipe(z.number());

export const ZInputStringNumberNullable = ZInputStringPipe(
   z.number().nullable(),
);
