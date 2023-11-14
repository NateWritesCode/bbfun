import { Database } from "bun:sqlite";
import {
	PATH_OUTPUT_ROOT,
	TRowOotpDivision,
	TRowOotpLeague,
	ZRowOotpDivision,
	ZRowOotpLeague,
	getJsonData,
} from "@bbfun/utils";
import { PATH_DB_ROOT } from "@bbfun/utils";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { z } from "zod";
import {
	schemaDivisions,
	schemaInsertManyDivision,
	schemaInsertManyLeague,
	schemaLeagues,
} from "./schema";

const db = new Database(`${PATH_DB_ROOT}/db.sqlite`);

class Db {
	db = drizzle(db);

	constructor() {
		migrate(this.db, { migrationsFolder: `${PATH_DB_ROOT}/migrations` });
	}

	public seed() {
		try {
			const leagues = getJsonData<TRowOotpLeague[]>({
				path: `${PATH_OUTPUT_ROOT}/ootp/2011/leagues.json`,
				zodParser: z.array(ZRowOotpLeague),
			});

			const parsedLeagues = schemaInsertManyLeague.parse(leagues);

			this.db.insert(schemaLeagues).values(parsedLeagues).execute();

			const divisions = getJsonData<TRowOotpDivision[]>({
				path: `${PATH_OUTPUT_ROOT}/ootp/2011/divisions.json`,
				zodParser: z.array(ZRowOotpDivision),
			});

			const parsedDivisions = schemaInsertManyDivision.parse(divisions);

			this.db.insert(schemaDivisions).values(parsedDivisions).execute();
		} catch (_error) {
			console.info("Database already seeded");
		}
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
