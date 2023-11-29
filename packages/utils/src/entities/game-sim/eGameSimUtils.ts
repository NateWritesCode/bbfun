import {
   TInputGetNumRunnersOnBase,
   ZInputGetNumRunnersOnBase,
} from "@bbfun/utils";

export default class GameSimUtils {
   protected getNumRunnersOnBase(input: TInputGetNumRunnersOnBase): number {
      const { playerRunner1, playerRunner2, playerRunner3 } =
         ZInputGetNumRunnersOnBase.parse(input);

      let counter = 0;

      if (playerRunner1) {
         counter++;
      }

      if (playerRunner2) {
         counter++;
      }

      if (playerRunner3) {
         counter++;
      }

      return counter;
   }
}
