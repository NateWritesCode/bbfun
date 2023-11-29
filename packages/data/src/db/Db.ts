import { Database } from "bun:sqlite";
import {
   GAME_GROUP,
   PATH_OUTPUT_ROOT,
   TRowOotpDivision,
   TRowOotpGame,
   TRowOotpLeague,
   TRowOotpPark,
   TRowOotpPlayer,
   TRowOotpSubLeague,
   TRowOotpTeam,
   ZResponseGetGamesForDay,
   ZRowOotpDivision,
   ZRowOotpGame,
   ZRowOotpLeague,
   ZRowOotpPark,
   ZRowOotpPlayer,
   ZRowOotpSubLeague,
   ZRowOotpTeam,
   getJsonData,
} from "@bbfun/utils";
import { PATH_DB_ROOT } from "@bbfun/utils";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { z } from "zod";
import {
   TSchemaInsertManyStatsBattingPlayerGame,
   TSchemaInsertManyStatsBattingTeamGame,
   TSchemaInsertManyStatsPitchingPlayerGame,
   TSchemaInsertManyStatsPitchingTeamGame,
   schemaDivisions,
   schemaGameGroups,
   schemaGames,
   schemaInsertManyDivisions,
   schemaInsertManyGameGroups,
   schemaInsertManyGames,
   schemaInsertManyLeagues,
   schemaInsertManyParks,
   schemaInsertManyPlayers,
   schemaInsertManySubLeagues,
   schemaInsertManyTeams,
   schemaLeagues,
   schemaParks,
   schemaPlayers,
   schemaStatsBattingPlayerGame,
   schemaStatsBattingTeamGame,
   schemaStatsPitchingPlayerGame,
   schemaStatsPitchingTeamGame,
   schemaSubLeagues,
   schemaTeams,
} from "./schema";

const db = new Database(`${PATH_DB_ROOT}/db.sqlite`);

class Db {
   db = drizzle(db);

   constructor() {
      this._deleteSimData();
      migrate(this.db, { migrationsFolder: `${PATH_DB_ROOT}/migrations` });
   }

   private _deleteSimData = () => {
      //   this.db.delete(schemaStatsBattingPlayerGame).execute();
      //   this.db.delete(schemaStatsBattingTeamGame).execute();
      //   this.db.delete(schemaStatsPitchingPlayerGame).execute();
      //   this.db.delete(schemaStatsPitchingTeamGame).execute();
   };

   public getGamesForDay = (date: string) => {
      const statement = sql`
			select 	
				json_object(
					'date', games.date,
					'id', games.id,
					'time', games.time,
					'park', json_patch(
						json_object(
							'avg', parks.avg,
							'avgL', parks.avgL,
							'avgR', parks.avgR,
							'basesX0', parks.basesX0,
							'basesX1', parks.basesX1,
							'basesX2', parks.basesX2,
							'basesY0', parks.basesY0,
							'basesY1', parks.basesY1,
							'basesY2', parks.basesY2,
							'batterLeftX', parks.batterLeftX,
							'batterLeftY', parks.batterLeftY,
							'batterRightX', parks.batterRightX,
							'batterRightY', parks.batterRightY,
							'capacity', parks.capacity,
							'd', parks.d,
							'dimensionsX', parks.dimensionsX,
							'dimensionsY', parks.dimensionsY,
							'distances0', parks.distances0,
							'distances1', parks.distances1,
							'distances2', parks.distances2,
							'distances3', parks.distances3,
							'distances4', parks.distances4,
							'distances5', parks.distances5,
							'distances6', parks.distances6,
							'foulGround', parks.foulGround,
							'hr', parks.hr,
							'hrL', parks.hrL,
							'hrR', parks.hrR,
							'id', parks.id,
							'isHomeTeamDugoutAtFirstBase', parks.isHomeTeamDugoutAtFirstBase,
							'name', parks.name
						),
						json_object(
							'positionsX0', parks.positionsX0,
							'positionsX1', parks.positionsX1,
							'positionsX2', parks.positionsX2,
							'positionsX3', parks.positionsX3,
							'positionsX4', parks.positionsX4,
							'positionsX5', parks.positionsX5,
							'positionsX6', parks.positionsX6,
							'positionsX7', parks.positionsX7,
							'positionsX8', parks.positionsX8,
							'positionsX9', parks.positionsX9,
							'positionsY0', parks.positionsY0,
							'positionsY1', parks.positionsY1,
							'positionsY2', parks.positionsY2,
							'positionsY3', parks.positionsY3,
							'positionsY4', parks.positionsY4,
							'positionsY5', parks.positionsY5,
							'positionsY6', parks.positionsY6,
							'positionsY7', parks.positionsY7,
							'positionsY8', parks.positionsY8,
							'positionsY9', parks.positionsY9,
							'rain0', parks.rain0,
							'rain1', parks.rain1,
							'rain2', parks.rain2,
							'rain3', parks.rain3,
							'rain4', parks.rain4,
							'rain5', parks.rain5,
							'rain6', parks.rain6,
							'rain7', parks.rain7,
							'rain8', parks.rain8,
							'rain9', parks.rain9,
							'rain10', parks.rain10,
							'rain11', parks.rain11,
							'slug', parks.slug,
							't', parks.t,
							'temperature0', parks.temperature0,
							'temperature1', parks.temperature1,
							'temperature2', parks.temperature2,
							'temperature3', parks.temperature3,
							'temperature4', parks.temperature4,
							'temperature5', parks.temperature5,
							'temperature6', parks.temperature6,
							'temperature7', parks.temperature7,
							'temperature8', parks.temperature8,
							'temperature9', parks.temperature9,
							'temperature10', parks.temperature10,
							'temperature11', parks.temperature11,
							'turf', parks.turf,
							'type', parks.type,
							'wallHeights0', parks.wallHeights0,
							'wallHeights1', parks.wallHeights1,
							'wallHeights2', parks.wallHeights2,
							'wallHeights3', parks.wallHeights3,
							'wallHeights4', parks.wallHeights4,
							'wallHeights5', parks.wallHeights5,
							'wallHeights6', parks.wallHeights6,
							'wind', parks.wind,
							'windDirection', parks.windDirection
						)
					),
					'teamAway', json_object(
						'id', teamAway.id,
						'name', teamAway.name,
						'nickname', teamAway.nickname,
						'players', 
							(
								select 
									json_group_array(
										json_object(
											'firstName', players.firstName,
											'id', players.id,
											'lastName', players.lastName,
											'position', players.position,
											'ratings', players.ratings
										)
									) 
								from
									players
								where 
									players.teamId = teamAway.id
							)
					),
					'teamHome', json_object(
						'id', teamHome.id,
						'name', teamHome.name,
						'nickname', teamHome.nickname,
						'players', 
							(
								select 
									json_group_array(
										json_object(
											'firstName', players.firstName,
											'id', players.id,
											'lastName', players.lastName,
											'position', players.position,
											'ratings', players.ratings
										)
									) 
								from
									players
								where 
									players.teamId = teamHome.id
							)
					)
				) as data
			from 
				games
			left join 
            	teams as teamAway on teamAway.id = games.teamIdAway
        	left join 
            	teams as teamHome on teamHome.id = games.teamIdHome
			left join 
				parks on parks.id = teamHome.parkId
			where
				${eq(schemaGames.date, new Date(date))}
			group by
            	games.id,
            	teamAway.id,
            	teamHome.id
        ;
		`;

      const res = this.db
         .all(statement)
         // biome-ignore lint/suspicious/noExplicitAny: Okay as we're doing a zod parse here
         .map((row: any) =>
            ZResponseGetGamesForDay.parse(JSON.parse(row.data)),
         );

      return res;
   };

   public saveSimulationResults = (input: {
      statsBattingPlayerGame: TSchemaInsertManyStatsBattingPlayerGame;
      statsBattingTeamGame: TSchemaInsertManyStatsBattingTeamGame;
      statsPitchingPlayerGame: TSchemaInsertManyStatsPitchingPlayerGame;
      statsPitchingTeamGame: TSchemaInsertManyStatsPitchingTeamGame;
   }) => {
      this.db.transaction((db) => {
         db.insert(schemaStatsBattingPlayerGame)
            .values(input.statsBattingPlayerGame)
            .run();

         //  trx.insert(schemaStatsPitchingPlayerGame)
         //     .values(input.statsPitchingPlayerGame)
         //     .execute();
         //  trx.insert(schemaStatsBattingTeamGame)
         //     .values(input.statsBattingTeamGame)
         //     .execute();
         //  trx.insert(schemaStatsPitchingTeamGame)
         //     .values(input.statsPitchingTeamGame)
         //     .execute();
      });
   };

   public seed() {
      const doesDataExistAlready = this.db.select().from(schemaLeagues).all();

      if (doesDataExistAlready.length > 0) {
         return;
      }

      const leagues = getJsonData<TRowOotpLeague[]>({
         path: `${PATH_OUTPUT_ROOT}/ootp/2011/leagues.json`,
         zodParser: z.array(ZRowOotpLeague),
      });

      const parsedLeagues = schemaInsertManyLeagues.parse(leagues);

      this.db.insert(schemaLeagues).values(parsedLeagues).execute();

      const subLeagues = getJsonData<TRowOotpSubLeague[]>({
         path: `${PATH_OUTPUT_ROOT}/ootp/2011/subLeagues.json`,
         zodParser: z.array(ZRowOotpSubLeague),
      });

      const parsedSubLeagues = schemaInsertManySubLeagues.parse(subLeagues);

      this.db.insert(schemaSubLeagues).values(parsedSubLeagues).execute();

      const divisions = getJsonData<TRowOotpDivision[]>({
         path: `${PATH_OUTPUT_ROOT}/ootp/2011/divisions.json`,
         zodParser: z.array(ZRowOotpDivision),
      });

      const parsedDivisions = schemaInsertManyDivisions.parse(divisions);

      this.db.insert(schemaDivisions).values(parsedDivisions).execute();

      const parsedGameGroups = schemaInsertManyGameGroups.parse([GAME_GROUP]);

      this.db.insert(schemaGameGroups).values(parsedGameGroups).execute();

      const games = getJsonData<TRowOotpGame[]>({
         path: `${PATH_OUTPUT_ROOT}/ootp/2011/games.json`,
         zodParser: z.array(ZRowOotpGame),
      }).map((game) => ({
         ...game,
         date: new Date(game.date),
         gameGroupId: GAME_GROUP.id,
      }));

      const parsedGames = schemaInsertManyGames.parse(games);

      this.db.insert(schemaGames).values(parsedGames).execute();

      const parks = getJsonData<TRowOotpPark[]>({
         path: `${PATH_OUTPUT_ROOT}/ootp/2011/parks.json`,
         zodParser: z.array(ZRowOotpPark),
      });

      const parsedParks = schemaInsertManyParks.parse(parks);

      this.db.insert(schemaParks).values(parsedParks).execute();

      const teams = getJsonData<TRowOotpTeam[]>({
         path: `${PATH_OUTPUT_ROOT}/ootp/2011/teams.json`,
         zodParser: z.array(ZRowOotpTeam),
      });

      const parsedTeams = schemaInsertManyTeams.parse(teams);

      this.db.insert(schemaTeams).values(parsedTeams).execute();

      const players = getJsonData<TRowOotpPlayer[]>({
         path: `${PATH_OUTPUT_ROOT}/ootp/2011/players.json`,
         zodParser: z.array(ZRowOotpPlayer),
      });

      // TODO: Remove duplicates check
      const transformedPlayers = players
         .filter(
            (player, index, self) =>
               index === self.findIndex((p) => p.id === player.id),
         )
         .map((player) => ({
            ...player,
            dateOfBirth: new Date(player.dateOfBirth),
         }));

      const parsedPlayers = schemaInsertManyPlayers.parse(transformedPlayers);

      this.db.insert(schemaPlayers).values(parsedPlayers).execute();
   }
}

export default Db;
