import {
   Logger,
   OGameSimObserver,
   PATH_GAME_DATA_ROOT,
   TConstructorGameSimLog,
   TGameSimEvent,
   ZConstructorGameSimLog,
   createFolderPathIfNeeded,
} from "@bbfun/utils";
import { assertExhaustive } from "@bbfun/utils";
import fs from "node:fs";

export default class GameSimLog implements OGameSimObserver {
   gameLog: string[][] = [];
   id: string;

   constructor(input: TConstructorGameSimLog) {
      ZConstructorGameSimLog.parse(input);
      this.id = input.id;
   }

   logDanger = (info: string[]) => {
      Logger.danger.apply(null, info);
      this.gameLog.push(info);
   };

   logInfo = (info: string[]) => {
      const shouldLog = true;

      if (shouldLog) {
         Logger.info.apply(null, info);
      }
      this.gameLog.push(info);
   };

   notifyGameEvent(input: TGameSimEvent): void {
      switch (input.gameEvent) {
         case "atBatEnd": {
            break;
         }
         case "atBatStart": {
            break;
         }
         case "double": {
            const { playerHitter } = input.data;
            this.logInfo([`${playerHitter.name} hit a double`]);
            break;
         }
         case "gameEnd": {
            this.logDanger(["Game ended"]);
            const folderPath = `${PATH_GAME_DATA_ROOT}/game-sim-logs`;
            createFolderPathIfNeeded(folderPath);

            const file = `${folderPath}/${this.id}.json`;

            fs.writeFileSync(file, JSON.stringify(this.gameLog, null));

            break;
         }
         case "gameStart": {
            this.logDanger(["Game started"]);
            break;
         }
         case "halfInningEnd": {
            break;
         }
         case "halfInningStart": {
            const { teamDefense, teamOffense } = input.data;

            this.logDanger([
               `Half inning started: ${teamDefense.name} is on defense and ${teamOffense.name} is on offense`,
            ]);

            break;
         }
         case "homeRun": {
            const { playerHitter } = input.data;
            this.logInfo([`${playerHitter.name} hit a home run`]);
            break;
         }
         case "out": {
            const { playerHitter } = input.data;
            this.logInfo([`${playerHitter.name} is out`]);
            break;
         }
         case "pitch": {
            break;
         }
         case "run": {
            const { playerRunner, teamOffense } = input.data;

            this.logInfo([
               `${teamOffense.name} ${playerRunner.name} scored a run`,
            ]);

            break;
         }
         case "single": {
            const { playerHitter } = input.data;
            this.logInfo([`${playerHitter.name} hit a single`]);
            break;
         }
         case "strikeout": {
            const { playerHitter } = input.data;
            this.logInfo([`${playerHitter.name} struck out`]);
            break;
         }
         case "triple": {
            const { playerHitter } = input.data;
            this.logInfo([`${playerHitter.name} hit a triple`]);
            break;
         }
         case "walk": {
            const { playerHitter } = input.data;
            this.logInfo([`${playerHitter.name} walked`]);
            break;
         }
         default:
            assertExhaustive(input);
      }
   }
}
