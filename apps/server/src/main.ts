import { Db } from "@bbfun/data";
import {
   TSchemaInsertManyStatsBattingPlayerGame,
   TSchemaInsertManyStatsBattingTeamGame,
   TSchemaInsertManyStatsPitchingPlayerGame,
   TSchemaInsertManyStatsPitchingTeamGame,
} from "@bbfun/data/src/db/schema";
import { initServer } from "@bbfun/server/utils";
import { GAME_GROUP, GameSim } from "@bbfun/utils";
import dayjs from "dayjs";

const { modelClient } = await initServer();

const db = new Db();

db.seed();

const startDate = "2011-03-31";
const endDate = "2011-03-31";
let counterDate = startDate;

while (counterDate <= endDate) {
   const rootResults: {
      statsBattingPlayerGame: TSchemaInsertManyStatsBattingPlayerGame;
      statsBattingTeamGame: TSchemaInsertManyStatsBattingTeamGame;
      statsPitchingPlayerGame: TSchemaInsertManyStatsPitchingPlayerGame;
      statsPitchingTeamGame: TSchemaInsertManyStatsPitchingTeamGame;
   } = {
      statsBattingPlayerGame: [],
      statsBattingTeamGame: [],
      statsPitchingPlayerGame: [],
      statsPitchingTeamGame: [],
   };

   const gamesToSim = db.getGamesForDay(counterDate);

   for (const gameToSim of gamesToSim.slice(0, 1)) {
      const game = new GameSim({
         id: gameToSim.id,
         metadata: {
            date: gameToSim.date,
            gameGroupId: GAME_GROUP.id,
            leagueId: GAME_GROUP.leagueId,
            teamHomeId: gameToSim.teamHome.id,
            teamAwayId: gameToSim.teamAway.id,
         },
         modelClient,
         park: gameToSim.park,
         teams: [gameToSim.teamHome, gameToSim.teamAway],
      });
      const results = game.simulate();

      for (const data of results.statsBattingPlayer) {
         const { id: playerId, teamId, ...stats } = data;

         rootResults.statsBattingPlayerGame.push({
            gameId: gameToSim.id,
            gameGroupId: GAME_GROUP.id,
            leagueId: GAME_GROUP.leagueId,
            playerId,
            teamId,
            ...stats,
         });
      }
      for (const data of results.statsPitchingPlayer) {
         const { id: playerId, teamId, ...stats } = data;

         rootResults.statsPitchingPlayerGame.push({
            gameId: gameToSim.id,
            gameGroupId: GAME_GROUP.id,
            leagueId: GAME_GROUP.leagueId,
            playerId,
            teamId,
            ...stats,
         });
      }

      for (const data of results.statsBattingTeam) {
         const { id: teamId, ...stats } = data;

         rootResults.statsBattingTeamGame.push({
            gameId: gameToSim.id,
            gameGroupId: GAME_GROUP.id,
            leagueId: GAME_GROUP.leagueId,
            teamId,
            ...stats,
         });
      }
      for (const data of results.statsPitchingTeam) {
         const { id: teamId, ...stats } = data;

         rootResults.statsPitchingTeamGame.push({
            gameId: gameToSim.id,
            gameGroupId: GAME_GROUP.id,
            leagueId: GAME_GROUP.leagueId,
            teamId,
            ...stats,
         });
      }
   }

   db.saveSimulationResults(rootResults);
   counterDate = dayjs(counterDate).add(1, "day").format("YYYY-MM-DD");
}
