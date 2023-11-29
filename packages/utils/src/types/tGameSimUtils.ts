import { GameSimPlayerState } from "@bbfun/utils";
import { z } from "zod";

export const ZInputGetNumRunnersOnBase = z.object({
   playerRunner1: z.instanceof(GameSimPlayerState).nullable(),
   playerRunner2: z.instanceof(GameSimPlayerState).nullable(),
   playerRunner3: z.instanceof(GameSimPlayerState).nullable(),
});
export type TInputGetNumRunnersOnBase = z.infer<
   typeof ZInputGetNumRunnersOnBase
>;
