import { Database } from "bun:sqlite";
import {
	PATH_OUTPUT_ROOT,
	TRowOotpDivision,
	TRowOotpGame,
	TRowOotpLeague,
	TRowOotpPark,
	TRowOotpPlayer,
	TRowOotpSubLeague,
	TRowOotpTeam,
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
import { alias } from "drizzle-orm/sqlite-core";
import { z } from "zod";
import {
	schemaDivisions,
	schemaGames,
	schemaInsertManyDivisions,
	schemaInsertManyGames,
	schemaInsertManyLeagues,
	schemaInsertManyParks,
	schemaInsertManyPlayers,
	schemaInsertManySubLeagues,
	schemaInsertManyTeams,
	schemaLeagues,
	schemaParks,
	schemaPlayers,
	schemaSubLeagues,
	schemaTeams,
} from "./schema";

const db = new Database(`${PATH_DB_ROOT}/db.sqlite`);

class Db {
	db = drizzle(db);

	constructor() {
		migrate(this.db, { migrationsFolder: `${PATH_DB_ROOT}/migrations` });
	}

	public getGamesForDay = (date: string) => {
		const statement = sql`
			select 	
				*
			from 
				games
			where
				${eq(schemaGames.date, new Date(date))}
			;
		`;

		console.log("statement", statement);

		const res: unknown[] = this.db.all(statement);

		console.log("res", res);

		// const games = this.db
		// 	.select()
		// 	.from(schemaGames)
		// 	.where(eq(schemaGames.date, new Date(date)))
		// 	.leftJoin(aliasTeamAway, eq(aliasTeamAway.id, schemaGames.teamIdAway))
		// 	.leftJoin(aliasTeamHome, eq(aliasTeamHome.id, schemaGames.teamIdHome))
		// 	.all();

		// console.log("games", games);
	};

	public seed() {
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

		const games = getJsonData<TRowOotpGame[]>({
			path: `${PATH_OUTPUT_ROOT}/ootp/2011/games.json`,
			zodParser: z.array(ZRowOotpGame),
		}).map((game) => ({
			...game,
			date: new Date(game.date),
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

		let players = getJsonData<TRowOotpPlayer[]>({
			path: `${PATH_OUTPUT_ROOT}/ootp/2011/players.json`,
			zodParser: z.array(ZRowOotpPlayer),
		});

		// TODO: Remove duplicates check
		players = players.filter(
			(player, index, self) => index === self.findIndex((p) => p.id === player.id),
		);

		const parsedPlayers = schemaInsertManyPlayers.parse(players);

		this.db.insert(schemaPlayers).values(parsedPlayers).execute();
	}

	// private dbRoot = open({ name: "db", path: "./src/db" });
	// private dbPerson = this.dbRoot.openDB({ name: "person" });
	// private dbPlayer = this.dbRoot.openDB({ name: "player" });
	// private dbPlayerRating = this.dbRoot.openDB({
	// 	name: "playerRating",
	// });
	// private dbTeam = this.dbRoot.openDB({ name: "team" });
	// private dbVenue = this.dbRoot.openDB({ name: "venue" });
	// constructor() {
	// 	this.dbRoot.dropSync();
	// }
	// public seedPersons = ({ persons }: { persons: TPersons }) => {
	// 	ZPersons.parse(persons);
	// 	this.dbRoot.transactionSync(() => {
	// 		for (const person of persons) {
	// 			this.dbPerson.put(person.id, person);
	// 		}
	// 	});
	// };
	// public seedPlayers = ({ players }: { players: TPlayers }) => {
	// 	ZPlayers.parse(players);
	// 	this.dbRoot.transactionSync(() => {
	// 		for (const player of players) {
	// 			this.dbPlayer.put(player.personId, player);
	// 		}
	// 	});
	// };
	// public seedPlayerRatings = () => {};
	// public seedTeams = ({ teams }: { teams: TTeams }) => {
	// 	ZTeams.parse(teams);
	// 	this.dbRoot.transactionSync(() => {
	// 		for (const team of teams) {
	// 			this.dbTeam.put(team.id, team);
	// 		}
	// 	});
	// };
	// public seedVenues = ({ venues }: { venues: TVenues }) => {
	// 	ZVenues.parse(venues);
	// 	this.dbRoot.transactionSync(() => {
	// 		for (const venue of venues) {
	// 			this.dbVenue.put(venue.id, venue);
	// 		}
	// 	});
	// };
}

export default Db;
