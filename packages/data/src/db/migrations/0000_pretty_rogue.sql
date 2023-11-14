CREATE TABLE `divisions` (
	`id` text PRIMARY KEY NOT NULL,
	`leagueId` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`subLeagueId` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `leagues` (
	`abbrev` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
