import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const schemaDivisions = sqliteTable("divisions", {
	id: text("id").primaryKey(),
	leagueId: text("leagueId").notNull(),
	name: text("name").notNull(),
	slug: text("slug").notNull(),
	subLeagueId: text("subLeagueId").notNull(),
});

export const schemaInsertManyDivision = z.array(
	createInsertSchema(schemaDivisions),
);

export const schemaLeagues = sqliteTable("leagues", {
	abbrev: text("abbrev").notNull(),
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	slug: text("slug").notNull(),
});

export const schemaInsertManyLeague = z.array(
	createInsertSchema(schemaLeagues),
);
