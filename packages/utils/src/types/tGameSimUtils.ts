import { GameSimPlayerState } from "@bbfun/utils";
import { z } from "zod";

export const ZInputGetNumRunnersOnBase = z.object({
	r1: z.instanceof(GameSimPlayerState).nullable(),
	r2: z.instanceof(GameSimPlayerState).nullable(),
	r3: z.instanceof(GameSimPlayerState).nullable(),
});
export type TInputGetNumRunnersOnBase = z.infer<
	typeof ZInputGetNumRunnersOnBase
>;
