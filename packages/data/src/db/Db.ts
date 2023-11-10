// import {
// 	TPersons,
// 	TPlayers,
// 	TTeams,
// 	TVenues,
// 	ZPersons,
// 	ZPlayers,
// 	ZTeams,
// 	ZVenues,
// } from "@bbfun/utils";

class Db {
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
