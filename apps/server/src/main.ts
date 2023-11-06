import { POSITIONS } from "@bbfun/utils";
import { Db } from "@bbfun/data";
import { FakeClient, GameSim } from "@bbfun/utils";
import dayjs from "dayjs";

const fakeClient = new FakeClient();

const db = new Db();

Bun.serve({
	port: 3000,
	async fetch(req) {
		const filePath = `./src${new URL(req.url).pathname}`;
		const file = Bun.file(filePath).stream();
		return new Response(file);
	},
	error() {
		return new Response(null, { status: 404 });
	},
});

console.info("Starting script...");

const personsTeam0 = new Array(9)
	.fill(0)
	.map((_, i) => fakeClient.createPerson());
const personsTeam1 = new Array(9)
	.fill(0)
	.map((_, i) => fakeClient.createPerson());
const playersTeam0 = personsTeam0.map((person, i) =>
	fakeClient.createPlayer({ personId: person.id }),
);
const playersTeam1 = personsTeam1.map((person, i) =>
	fakeClient.createPlayer({ personId: person.id }),
);

db.seedPersons({ persons: [...personsTeam0, ...personsTeam1] });
db.seedPlayers({ players: [...playersTeam0, ...playersTeam1] });

const venues = new Array(2).fill(0).map((_, i) => fakeClient.createVenue());
db.seedVenues({ venues });

const teams = new Array(2).fill(0).map((_, i) =>
	fakeClient.createTeam({
		cityId: venues[i].cityId,
		venueId: venues[i].slug,
	}),
);

db.seedTeams({ teams });

const today = dayjs();

const game = new GameSim({
	id: `${teams[0].id}-${teams[1].id}-${today.format("YYYY-MM-DD")}-0`,
	teams: [
		{
			id: teams[0].id,
			players: new Array(9).fill(0).map((_, i) => ({
				id: playersTeam0[i].personId,
				ratings: playersTeam0[i].ratings,
				person: personsTeam0[i],
				position: POSITIONS[i],
			})),
		},
		{
			id: teams[1].id,
			players: new Array(9).fill(0).map((_, i) => ({
				id: playersTeam1[i].personId,
				ratings: playersTeam1[i].ratings,
				person: personsTeam1[i],
				position: POSITIONS[i],
			})),
		},
	],

	venue: venues[0],
});

console.info("Starting game...");

game.start();

console.info("Finished script!");
