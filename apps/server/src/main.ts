import { Db } from "@bbfun/data";
import { initServer } from "@bbfun/server/utils";
import { POSITIONS } from "@bbfun/utils";
import { FakeClient, GameSim } from "@bbfun/utils";
import dayjs from "dayjs";

const port = 3000;

Bun.serve({
	port,
	async fetch(req) {
		const url = new URL(req.url);

		if (url.pathname.includes("uploadModel")) {
			const [model] = url.pathname.split("uploadModel/").slice(1);

			const formData = await req.formData();

			const modelJson = formData.get("model.json");
			const weightsBin = formData.get("model.weights.bin");

			if (!modelJson || !weightsBin) {
				return new Response(null, { status: 400 });
			}

			console.info("Uploading model", model);

			await Bun.write(
				`./src/models/${model}/model.json`,
				modelJson as unknown as Blob,
			);
			await Bun.write(
				`./src/models/${model}/model.weights.bin`,
				weightsBin as unknown as Blob,
			);

			console.info("Finished uploading model", model);

			return new Response(null, { status: 200 });
		}

		const filePath = `./src${url.pathname}`;
		const file = Bun.file(filePath).stream();
		return new Response(file);
	},
	error() {
		return new Response(null, { status: 404 });
	},
});

console.info(`Server running at http://localhost:${port}`);

// const { modelClient } = await initServer();

// const fakeClient = new FakeClient();

const db = new Db();

const games = db.getGamesForDay("2011-03-31");

// const personsTeam0 = new Array(9)
// 	.fill(0)
// 	.map((_, i) => fakeClient.createPerson());
// const personsTeam1 = new Array(9)
// 	.fill(0)
// 	.map((_, i) => fakeClient.createPerson());
// const playersTeam0 = personsTeam0.map((person, i) =>
// 	fakeClient.createPlayer({ personId: person.id }),
// );
// const playersTeam1 = personsTeam1.map((person, i) =>
// 	fakeClient.createPlayer({ personId: person.id }),
// );

// db.seedPersons({ persons: [...personsTeam0, ...personsTeam1] });
// db.seedPlayers({ players: [...playersTeam0, ...playersTeam1] });

// const venues = new Array(2).fill(0).map((_, i) => fakeClient.createVenue());
// db.seedVenues({ venues });

// const teams = new Array(2).fill(0).map((_, i) =>
// 	fakeClient.createTeam({
// 		cityId: venues[i].cityId,
// 		venueId: venues[i].slug,
// 	}),
// );

// db.seedTeams({ teams });

// const today = dayjs();

// const game = new GameSim({
// 	id: `${teams[0].id}-${teams[1].id}-${today.format("YYYY-MM-DD")}-0`,
// 	modelClient,
// 	teams: [
// 		{
// 			id: teams[0].id,
// 			players: new Array(9).fill(0).map((_, i) => ({
// 				id: playersTeam0[i].personId,
// 				ratings: playersTeam0[i].ratings,
// 				person: personsTeam0[i],
// 				position: POSITIONS[i],
// 			})),
// 		},
// 		{
// 			id: teams[1].id,
// 			players: new Array(9).fill(0).map((_, i) => ({
// 				id: playersTeam1[i].personId,
// 				ratings: playersTeam1[i].ratings,
// 				person: personsTeam1[i],
// 				position: POSITIONS[i],
// 			})),
// 		},
// 	],

// 	venue: venues[0],
// });

// console.info("Starting game...");

// game.start();
