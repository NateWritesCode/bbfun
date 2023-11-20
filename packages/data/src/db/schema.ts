import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const schemaLeagues = sqliteTable("leagues", {
	abbrev: text("abbrev").notNull(),
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull(),
});

export const schemaInsertManyLeagues = z.array(
	createInsertSchema(schemaLeagues),
);

export const schemaSubLeagues = sqliteTable("subLeagues", {
	id: text("id").primaryKey(),
	leagueId: text("leagueId")
		.notNull()
		.references(() => schemaLeagues.id),
	name: text("name").notNull(),
	slug: text("slug").notNull(),
});

export const schemaInsertManySubLeagues = z.array(
	createInsertSchema(schemaSubLeagues),
);

export const schemaDivisions = sqliteTable("divisions", {
	id: text("id").primaryKey(),
	leagueId: text("leagueId")
		.notNull()
		.references(() => schemaLeagues.id),
	name: text("name").notNull(),
	slug: text("slug").notNull(),
	subLeagueId: text("subLeagueId")
		.notNull()
		.references(() => schemaSubLeagues.id),
});

export const schemaInsertManyDivisions = z.array(
	createInsertSchema(schemaDivisions),
);

export const schemaParks = sqliteTable("parks", {
	avg: real("avg").notNull(),
	avgL: real("avgL").notNull(),
	avgR: real("avgR").notNull(),
	basesX0: integer("basesX0").notNull(),
	basesX1: integer("basesX1").notNull(),
	basesX2: integer("basesX2").notNull(),
	basesY0: integer("basesY0").notNull(),
	basesY1: integer("basesY1").notNull(),
	basesY2: integer("basesY2").notNull(),
	batterLeftX: integer("batterLeftX").notNull(),
	batterLeftY: integer("batterLeftY").notNull(),
	batterRightX: integer("batterRightX").notNull(),
	batterRightY: integer("batterRightY").notNull(),
	capacity: integer("capacity").notNull(),
	d: real("d").notNull(),
	dimensionsX: integer("dimensionsX").notNull(),
	dimensionsY: integer("dimensionsY").notNull(),
	distances0: integer("distances0").notNull(),
	distances1: integer("distances1").notNull(),
	distances2: integer("distances2").notNull(),
	distances3: integer("distances3").notNull(),
	distances4: integer("distances4").notNull(),
	distances5: integer("distances5").notNull(),
	distances6: integer("distances6").notNull(),
	foulGround: integer("foulGround").notNull(),
	hr: real("hr").notNull(),
	hrL: real("hrL").notNull(),
	hrR: real("hrR").notNull(),
	id: text("id").primaryKey(),
	isHomeTeamDugoutAtFirstBase: integer("isHomeTeamDugoutAtFirstBase", {
		mode: "boolean",
	}).notNull(),
	name: text("name").notNull(),
	positionsX0: integer("positionsX0").notNull(),
	positionsX1: integer("positionsX1").notNull(),
	positionsX2: integer("positionsX2").notNull(),
	positionsX3: integer("positionsX3").notNull(),
	positionsX4: integer("positionsX4").notNull(),
	positionsX5: integer("positionsX5").notNull(),
	positionsX6: integer("positionsX6").notNull(),
	positionsX7: integer("positionsX7").notNull(),
	positionsX8: integer("positionsX8").notNull(),
	positionsX9: integer("positionsX9").notNull(),
	positionsY0: integer("positionsY0").notNull(),
	positionsY1: integer("positionsY1").notNull(),
	positionsY2: integer("positionsY2").notNull(),
	positionsY3: integer("positionsY3").notNull(),
	positionsY4: integer("positionsY4").notNull(),
	positionsY5: integer("positionsY5").notNull(),
	positionsY6: integer("positionsY6").notNull(),
	positionsY7: integer("positionsY7").notNull(),
	positionsY8: integer("positionsY8").notNull(),
	positionsY9: integer("positionsY9").notNull(),
	rain0: integer("rain0").notNull(),
	rain1: integer("rain1").notNull(),
	rain2: integer("rain2").notNull(),
	rain3: integer("rain3").notNull(),
	rain4: integer("rain4").notNull(),
	rain5: integer("rain5").notNull(),
	rain6: integer("rain6").notNull(),
	rain7: integer("rain7").notNull(),
	rain8: integer("rain8").notNull(),
	rain9: integer("rain9").notNull(),
	rain10: integer("rain10").notNull(),
	rain11: integer("rain11").notNull(),
	slug: text("slug").notNull(),
	t: real("t").notNull(),
	temperature0: integer("temperature0").notNull(),
	temperature1: integer("temperature1").notNull(),
	temperature2: integer("temperature2").notNull(),
	temperature3: integer("temperature3").notNull(),
	temperature4: integer("temperature4").notNull(),
	temperature5: integer("temperature5").notNull(),
	temperature6: integer("temperature6").notNull(),
	temperature7: integer("temperature7").notNull(),
	temperature8: integer("temperature8").notNull(),
	temperature9: integer("temperature9").notNull(),
	temperature10: integer("temperature10").notNull(),
	temperature11: integer("temperature11").notNull(),
	turf: integer("turf").notNull(),
	type: integer("type").notNull(),
	wallHeights0: integer("wallHeights0").notNull(),
	wallHeights1: integer("wallHeights1").notNull(),
	wallHeights2: integer("wallHeights2").notNull(),
	wallHeights3: integer("wallHeights3").notNull(),
	wallHeights4: integer("wallHeights4").notNull(),
	wallHeights5: integer("wallHeights5").notNull(),
	wallHeights6: integer("wallHeights6").notNull(),
	wind: integer("wind").notNull(),
	windDirection: integer("windDirection").notNull(),
});

export const schemaInsertManyParks = z.array(createInsertSchema(schemaParks));

export const schemaGames = sqliteTable("games", {
	date: integer("date", { mode: "timestamp" }).notNull(),
	id: text("id").primaryKey(),
	leagueId: text("leagueId")
		.notNull()
		.references(() => schemaLeagues.id),
	teamIdAway: text("teamIdAway")
		.notNull()
		.references(() => schemaTeams.id),
	teamIdHome: text("teamIdHome")
		.notNull()
		.references(() => schemaTeams.id),
	time: integer("time").notNull(),
});

export const schemaInsertManyGames = z.array(createInsertSchema(schemaGames));

export const schemaTeams = sqliteTable("teams", {
	abbrev: text("abbrev").notNull(),
	backgroundColor: text("backgroundColor").notNull(),
	divisionId: text("divisionId")
		.notNull()
		.references(() => schemaDivisions.id),
	hatMainColor: text("hatMainColor").notNull(),
	hatVisorColor: text("hatVisorColor").notNull(),
	id: text("id").primaryKey(),
	jerseyAwayColor: text("jerseyAwayColor").notNull(),
	jerseyMainColor: text("jerseyMainColor").notNull(),
	leagueId: text("leagueId")
		.notNull()
		.references(() => schemaLeagues.id),
	name: text("name").notNull(),
	nickname: text("nickname").notNull(),
	slug: text("slug").notNull(),
	subLeagueId: text("subLeagueId")
		.notNull()
		.references(() => schemaSubLeagues.id),
	textColor: text("textColor").notNull(),
	parkId: text("parkId")
		.notNull()
		.references(() => schemaParks.id),
});

export const schemaInsertManyTeams = z.array(createInsertSchema(schemaTeams));

export const schemaPlayers = sqliteTable("players", {
	bbRefId: text("bbRefId").notNull(),
	id: text("id").primaryKey(),
	position: text("position").notNull(),
	ratings: text("ratings", { mode: "json" }).notNull(),
	slug: text("slug").notNull(),
});

export const schemaInsertManyPlayers = z.array(
	createInsertSchema(schemaPlayers),
);
