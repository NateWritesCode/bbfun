import { z } from "zod";
import { ZRowOotpPark } from "./tOotp";

export const ZPark = ZRowOotpPark.omit({
   ootpId: true,
}).merge(z.object({}));

export type TPark = z.infer<typeof ZPark>;
