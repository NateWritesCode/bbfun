import {
   OGameSimObserver,
   TConstructorGameSimPlayerState,
   TGameSimEvent,
   TRowOotpPlayer,
   ZConstructorGameSimPlayerState,
} from "@bbfun/utils";
import { assertExhaustive } from "@bbfun/utils";

type TBattingStatistics = {
   bb: number;
   doubles: number;
   h: number;
   hr: number;
   k: number;
   lob: number;
   outs: number;
   rbi: number;
   runs: number;
   singles: number;
   triples: number;
};

type TPitchingStatistics = {
   battersFaced: number;
   bb: number;
   doublesAllowed: number;
   k: number;
   pitchesThrown: number;
   pitchesThrownBalls: number;
   pitchesThrownInPlay: number;
   pitchesThrownStrikes: number;
   hitsAllowed: number;
   hrsAllowed: number;
   lob: number;
   outs: number;
   runs: number;
   runsEarned: number;
   singlesAllowed: number;
   triplesAllowed: number;
};

type TStatistics = {
   batting: TBattingStatistics;
   pitching: TPitchingStatistics;
};

class GameSimPlayerState implements OGameSimObserver {
   firstName: string;
   lastName: string;
   id: string;
   name: string;
   position: string;
   ratings: TRowOotpPlayer["ratings"];
   statistics: TStatistics;
   teamId: string;

   constructor(input: TConstructorGameSimPlayerState) {
      const parsedInput = ZConstructorGameSimPlayerState.parse(input);
      this.firstName = parsedInput.firstName;
      this.lastName = parsedInput.lastName;
      this.name = `${this.firstName} ${this.lastName}`;
      this.position = parsedInput.position;
      this.ratings = parsedInput.ratings;
      this.teamId = parsedInput.teamId;
      this.statistics = {
         batting: {
            bb: 0,
            doubles: 0,
            h: 0,
            hr: 0,
            k: 0,
            lob: 0,
            outs: 0,
            rbi: 0,
            runs: 0,
            singles: 0,
            triples: 0,
         },
         pitching: {
            battersFaced: 0,
            bb: 0,
            doublesAllowed: 0,
            hitsAllowed: 0,
            hrsAllowed: 0,
            k: 0,
            lob: 0,
            outs: 0,
            pitchesThrown: 0,
            pitchesThrownBalls: 0,
            pitchesThrownInPlay: 0,
            pitchesThrownStrikes: 0,
            runs: 0,
            runsEarned: 0,
            singlesAllowed: 0,
            triplesAllowed: 0,
         },
      };

      this.id = parsedInput.id;
   }

   close() {
      return {
         batting: {
            runs: this.statistics.batting.runs,
         },
         id: this.id,
         pitching: {
            runs: this.statistics.pitching.runs,
         },
      };
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
            const { playerHitter, playerPitcher } = input.data;

            if (playerHitter.id === this.id) {
               this.statistics.batting.h++;
               this.statistics.batting.doubles++;
            }

            if (playerPitcher.id === this.id) {
               this.statistics.pitching.hitsAllowed++;
               this.statistics.pitching.doublesAllowed++;
            }

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
            const { playerHitter } = input.data;

            if (playerHitter.id === this.id) {
               this.statistics.batting.h++;
               this.statistics.batting.hr++;
            }
            break;
         }
         case "out": {
            const {
               playerHitter,
               playerPitcher,
               playerRunner1,
               playerRunner2,
               playerRunner3,
            } = input.data;

            if (playerHitter.id === this.id) {
               this.statistics.batting.outs++;
               if (playerRunner1) {
                  this.statistics.batting.lob++;
               }

               if (playerRunner2) {
                  this.statistics.batting.lob++;
               }

               if (playerRunner3) {
                  this.statistics.batting.lob++;
               }
            }

            if (playerPitcher.id === this.id) {
               this.statistics.pitching.outs++;

               if (playerRunner1) {
                  this.statistics.pitching.lob++;
               }

               if (playerRunner2) {
                  this.statistics.pitching.lob++;
               }

               if (playerRunner3) {
                  this.statistics.pitching.lob++;
               }
            }

            break;
         }
         case "pitch": {
            const { playerPitcher, pitchOutcome } = input.data;

            if (playerPitcher.id === this.id) {
               this.statistics.pitching.pitchesThrown++;

               switch (pitchOutcome) {
                  case "B": {
                     this.statistics.pitching.pitchesThrownBalls++;
                     break;
                  }
                  case "S": {
                     this.statistics.pitching.pitchesThrownStrikes++;
                     break;
                  }
                  case "X": {
                     this.statistics.pitching.pitchesThrownInPlay++;
                     break;
                  }
                  default: {
                     const exhaustiveCheck: never = pitchOutcome;
                     throw new Error(exhaustiveCheck);
                  }
               }
            }

            break;
         }
         case "run": {
            const { playerHitter, playerPitcher, playerRunner } = input.data;

            if (playerHitter.id === this.id) {
               this.statistics.batting.rbi++;
            }

            if (playerPitcher.id === this.id) {
               this.statistics.pitching.runs++;
               this.statistics.pitching.runsEarned++;
            }

            if (playerRunner.id === this.id) {
               this.statistics.batting.runs++;
            }

            break;
         }
         case "single": {
            const { playerHitter, playerPitcher } = input.data;

            if (playerHitter.id === this.id) {
               this.statistics.batting.h++;
               this.statistics.batting.singles++;
            }

            if (playerPitcher.id === this.id) {
               this.statistics.pitching.hitsAllowed++;
               this.statistics.pitching.singlesAllowed++;
            }

            break;
         }

         case "strikeout": {
            const { playerHitter, playerPitcher } = input.data;

            if (playerHitter.id === this.id) {
               this.statistics.batting.k++;
            }

            if (playerPitcher.id === this.id) {
               this.statistics.pitching.k++;
            }

            break;
         }
         case "triple": {
            const { playerHitter, playerPitcher } = input.data;

            if (playerHitter.id === this.id) {
               this.statistics.batting.h++;
               this.statistics.batting.triples++;
            }

            if (playerPitcher.id === this.id) {
               this.statistics.pitching.hitsAllowed++;
               this.statistics.pitching.triplesAllowed++;
            }

            break;
         }
         case "walk": {
            const { playerHitter, playerPitcher } = input.data;

            if (playerHitter.id === this.id) {
               this.statistics.batting.bb++;
            }

            if (playerPitcher.id === this.id) {
               this.statistics.pitching.bb++;
            }

            break;
         }
         default:
            assertExhaustive(input);
      }
   }
}

export default GameSimPlayerState;
