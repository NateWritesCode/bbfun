import {
   OGameSimObserver,
   TConstructorGameSimEventStore,
   TGameSimEvent,
   ZConstructorGameSimEventStore,
} from "@bbfun/utils";
import { assertExhaustive } from "@bbfun/utils";

export default class GameSimEventStore implements OGameSimObserver {
   id: string;

   constructor(input: TConstructorGameSimEventStore) {
      ZConstructorGameSimEventStore.parse(input);
      this.id = input.id;
   }

   notifyGameEvent(input: TGameSimEvent): void {
      switch (input.gameEvent) {
         case "atBatEnd": {
            break;
         }
         case "atBatStart": {
            break;
         }
         case "double": {
            break;
         }
         case "gameEnd": {
            break;
         }
         case "gameStart": {
            break;
         }
         case "halfInningEnd": {
            break;
         }
         case "halfInningStart": {
            break;
         }
         case "homeRun": {
            break;
         }
         case "out": {
            break;
         }
         case "pitch": {
            break;
         }
         case "run": {
            break;
         }
         case "single": {
            break;
         }
         case "strikeout": {
            break;
         }
         case "triple": {
            break;
         }
         case "walk": {
            break;
         }
         default: {
            assertExhaustive(input);
         }
      }
   }
}
