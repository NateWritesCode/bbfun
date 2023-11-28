import {
   OGameSimObserver,
   POSITIONS,
   TConstructorGameSimTeamState,
   TEGamePositions,
   TGameSimEvent,
   ZConstructorGameSimTeamState,
} from "@bbfun/utils";
import { assertExhaustive } from "@bbfun/utils";
import GamePlayerState from "./eGameSimPlayerState";
import GameSimUtils from "./eGameSimUtils";

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
   runsAllowed: number;
   runsEarned: number;
   singlesAllowed: number;
   triplesAllowed: number;
};

type TStatistics = {
   batting: TBattingStatistics;
   pitching: TPitchingStatistics;
};

export default class GameTeamState
   extends GameSimUtils
   implements OGameSimObserver
{
   id: string;
   lineupIndex: number;
   lineup: string[];
   name: string;
   nameFull: string;
   nickname: string;
   players: {
      [key: string]: GamePlayerState;
   };
   positions: {
      p: string;
      c: string;
      "1b": string;
      "2b": string;
      "3b": string;
      ss: string;
      lf: string;
      cf: string;
      rf: string;
   };

   // Stats
   statistics: TStatistics;

   constructor(input: TConstructorGameSimTeamState) {
      super();
      ZConstructorGameSimTeamState.parse(input);
      this.id = input.id;
      this.name = input.name;
      this.nickname = input.nickname;
      this.nameFull = `${input.name} ${input.nickname}`;
      this.players = input.players.reduce((acc, player) => {
         acc[player.id] = player;
         return acc;
      }, {} as { [key: string]: GamePlayerState });

      this.positions = {
         p: this._setPlayerPosition("p"),
         c: this._setPlayerPosition("c"),
         "1b": this._setPlayerPosition("1b"),
         "2b": this._setPlayerPosition("2b"),
         "3b": this._setPlayerPosition("3b"),
         ss: this._setPlayerPosition("ss"),
         lf: this._setPlayerPosition("lf"),
         cf: this._setPlayerPosition("cf"),
         rf: this._setPlayerPosition("rf"),
      };

      this.lineupIndex = 0;
      this.lineup = this._setLineup();

      // Stats
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
            runsAllowed: 0,
            runsEarned: 0,
            singlesAllowed: 0,
            triplesAllowed: 0,
         },
      };
   }

   advanceLineupIndex(): void {
      this.lineupIndex = (this.lineupIndex + 1) % this.lineup.length;
   }

   close() {
      return {
         batting: {
            runs: this.statistics.batting.runs,
         },
         id: this.id,
         pitching: {
            runs: this.statistics.pitching.runsAllowed,
         },
      };
   }

   private _getArrayOfAllPlayerStates() {
      return Object.values(this.players || {});
   }

   private _getArrayOfAllPlayerStatesBench() {
      const playersPositionIds = Object.values(this.positions || {});

      return this._getArrayOfAllPlayerStates().filter(
         (player) => !playersPositionIds.includes(player.id),
      );
   }

   private _getArrayOfAllPlayerStatesActive() {
      const playersPositionIds = Object.values(this.positions || {});

      return this._getArrayOfAllPlayerStates().filter((player) =>
         playersPositionIds.includes(player.id),
      );
   }

   getCurrentHitterId() {
      return this.lineup[this.lineupIndex];
   }

   getPositionId({ position }: { position: TEGamePositions }) {
      return this.positions[position];
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
            const {
               teamDefense,
               teamOffense,
               playerRunner1,
               playerRunner2,
               playerRunner3,
            } = input.data;

            if (teamOffense.id === this.id) {
               this.statistics.batting.hr++;
            }

            if (teamDefense.id === this.id) {
               this.statistics.pitching.hrsAllowed++;
            }

            break;
         }
         case "out": {
            break;
         }
         case "pitch": {
            break;
         }
         case "run": {
            const { teamDefense, teamOffense } = input.data;

            if (teamOffense.id === this.id) {
               this.statistics.batting.runs++;
            }

            if (teamDefense.id === this.id) {
               this.statistics.pitching.runsAllowed++;
            }
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
         default:
            assertExhaustive(input);
      }
   }

   _setLineup() {
      return this._getArrayOfAllPlayerStatesActive()
         .toSorted((a, b) => {
            const aRating =
               a.ratings.batting.contact +
               a.ratings.batting.power +
               a.ratings.batting.eye +
               a.ratings.batting.gap +
               a.ratings.batting.avoidKs;
            const bRating =
               b.ratings.batting.contact +
               b.ratings.batting.power +
               b.ratings.batting.eye +
               b.ratings.batting.gap +
               b.ratings.batting.avoidKs;

            return bRating - aRating;
         })
         .map((player) => player.id);
   }

   _setPositionPitcher() {
      const pitchers = this._getArrayOfAllPlayerStatesBench()
         .filter((player) => player.position === "p")
         .toSorted((a, b) => {
            const aRating =
               a.ratings.pitching.stuff +
               a.ratings.pitching.movement +
               a.ratings.pitching.control;
            const bRating =
               b.ratings.pitching.stuff +
               b.ratings.pitching.movement +
               b.ratings.pitching.control;
            return bRating - aRating;
         });

      if (!pitchers.length) {
         throw new Error("No pitchers found");
      }

      return pitchers[0].id;
   }

   _setPositionNonPitcher(position: Exclude<typeof POSITIONS[number], "p">) {
      const players = this._getArrayOfAllPlayerStatesBench()
         .filter((player) => player.position === position)
         .toSorted((a, b) => {
            const aRating =
               a.ratings.fielding.position[position].rating +
               a.ratings.fielding.position[position].experience +
               a.ratings.batting.contact +
               a.ratings.batting.power +
               a.ratings.batting.eye +
               a.ratings.batting.gap +
               a.ratings.batting.avoidKs;

            const bRating =
               b.ratings.fielding.position[position].rating +
               b.ratings.fielding.position[position].experience +
               b.ratings.batting.contact +
               b.ratings.batting.power +
               b.ratings.batting.eye +
               b.ratings.batting.gap +
               b.ratings.batting.avoidKs;

            return bRating - aRating;
         });

      if (!players.length) {
         throw new Error(`No ${position} found`);
      }

      return players[0].id;
   }

   private _setPlayerPosition(position: typeof POSITIONS[number]) {
      switch (position) {
         case "p": {
            return this._setPositionPitcher();
         }
         case "c":
         case "1b":
         case "2b":
         case "3b":
         case "ss":
         case "lf":
         case "cf":
         case "rf": {
            return this._setPositionNonPitcher(position);
         }
         default: {
            const exhaustiveCheck: never = position;
            throw new Error(exhaustiveCheck);
         }
      }
   }

   private _setPlayerBattingOrder() {}
}
