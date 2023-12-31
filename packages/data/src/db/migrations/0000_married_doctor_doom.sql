CREATE TABLE `divisions` (
	`id` text PRIMARY KEY NOT NULL,
	`leagueId` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`subLeagueId` text NOT NULL,
	FOREIGN KEY (`leagueId`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subLeagueId`) REFERENCES `subLeagues`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `gameGroups` (
	`endDate` integer NOT NULL,
	`hasPlayoffs` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`leagueId` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`startDate` integer NOT NULL,
	FOREIGN KEY (`leagueId`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `games` (
	`date` integer NOT NULL,
	`gameGroupId` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`leagueId` text NOT NULL,
	`teamIdAway` text NOT NULL,
	`teamIdHome` text NOT NULL,
	`time` integer NOT NULL,
	FOREIGN KEY (`gameGroupId`) REFERENCES `gameGroups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`leagueId`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teamIdAway`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teamIdHome`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `leagues` (
	`abbrev` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `parks` (
	`avg` real NOT NULL,
	`avgL` real NOT NULL,
	`avgR` real NOT NULL,
	`basesX0` integer NOT NULL,
	`basesX1` integer NOT NULL,
	`basesX2` integer NOT NULL,
	`basesY0` integer NOT NULL,
	`basesY1` integer NOT NULL,
	`basesY2` integer NOT NULL,
	`batterLeftX` integer NOT NULL,
	`batterLeftY` integer NOT NULL,
	`batterRightX` integer NOT NULL,
	`batterRightY` integer NOT NULL,
	`capacity` integer NOT NULL,
	`d` real NOT NULL,
	`dimensionsX` integer NOT NULL,
	`dimensionsY` integer NOT NULL,
	`distances0` integer NOT NULL,
	`distances1` integer NOT NULL,
	`distances2` integer NOT NULL,
	`distances3` integer NOT NULL,
	`distances4` integer NOT NULL,
	`distances5` integer NOT NULL,
	`distances6` integer NOT NULL,
	`foulGround` integer NOT NULL,
	`hr` real NOT NULL,
	`hrL` real NOT NULL,
	`hrR` real NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`isHomeTeamDugoutAtFirstBase` integer NOT NULL,
	`name` text NOT NULL,
	`positionsX0` integer NOT NULL,
	`positionsX1` integer NOT NULL,
	`positionsX2` integer NOT NULL,
	`positionsX3` integer NOT NULL,
	`positionsX4` integer NOT NULL,
	`positionsX5` integer NOT NULL,
	`positionsX6` integer NOT NULL,
	`positionsX7` integer NOT NULL,
	`positionsX8` integer NOT NULL,
	`positionsX9` integer NOT NULL,
	`positionsY0` integer NOT NULL,
	`positionsY1` integer NOT NULL,
	`positionsY2` integer NOT NULL,
	`positionsY3` integer NOT NULL,
	`positionsY4` integer NOT NULL,
	`positionsY5` integer NOT NULL,
	`positionsY6` integer NOT NULL,
	`positionsY7` integer NOT NULL,
	`positionsY8` integer NOT NULL,
	`positionsY9` integer NOT NULL,
	`rain0` integer NOT NULL,
	`rain1` integer NOT NULL,
	`rain2` integer NOT NULL,
	`rain3` integer NOT NULL,
	`rain4` integer NOT NULL,
	`rain5` integer NOT NULL,
	`rain6` integer NOT NULL,
	`rain7` integer NOT NULL,
	`rain8` integer NOT NULL,
	`rain9` integer NOT NULL,
	`rain10` integer NOT NULL,
	`rain11` integer NOT NULL,
	`slug` text NOT NULL,
	`t` real NOT NULL,
	`temperature0` integer NOT NULL,
	`temperature1` integer NOT NULL,
	`temperature2` integer NOT NULL,
	`temperature3` integer NOT NULL,
	`temperature4` integer NOT NULL,
	`temperature5` integer NOT NULL,
	`temperature6` integer NOT NULL,
	`temperature7` integer NOT NULL,
	`temperature8` integer NOT NULL,
	`temperature9` integer NOT NULL,
	`temperature10` integer NOT NULL,
	`temperature11` integer NOT NULL,
	`turf` integer NOT NULL,
	`type` integer NOT NULL,
	`wallHeights0` integer NOT NULL,
	`wallHeights1` integer NOT NULL,
	`wallHeights2` integer NOT NULL,
	`wallHeights3` integer NOT NULL,
	`wallHeights4` integer NOT NULL,
	`wallHeights5` integer NOT NULL,
	`wallHeights6` integer NOT NULL,
	`wind` integer NOT NULL,
	`windDirection` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `players` (
	`bbRefId` text NOT NULL,
	`date` integer NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`nickname` text,
	`position` text NOT NULL,
	`ratings` text NOT NULL,
	`slug` text NOT NULL,
	`teamId` text NOT NULL,
	FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `statsBattingPlayerGame` (
	`gameGroupId` text NOT NULL,
	`gameId` text NOT NULL,
	`leagueId` text NOT NULL,
	`playerId` text NOT NULL,
	`teamId` text NOT NULL,
	`runs` integer NOT NULL,
	PRIMARY KEY(`gameGroupId`, `gameId`, `playerId`),
	FOREIGN KEY (`gameGroupId`) REFERENCES `gameGroups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`leagueId`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`playerId`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `statsBattingPlayerGameGroup` (
	`gameGroupId` text NOT NULL,
	`leagueId` text NOT NULL,
	`playerId` text NOT NULL,
	`teamId` text NOT NULL,
	`runs` integer NOT NULL,
	PRIMARY KEY(`gameGroupId`, `teamId`),
	FOREIGN KEY (`leagueId`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`playerId`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `statsBattingTeamGame` (
	`gameGroupId` text NOT NULL,
	`gameId` text NOT NULL,
	`leagueId` text NOT NULL,
	`teamId` text NOT NULL,
	`runs` integer NOT NULL,
	PRIMARY KEY(`gameGroupId`, `gameId`, `teamId`),
	FOREIGN KEY (`gameGroupId`) REFERENCES `gameGroups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`leagueId`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `statsBattingTeamGameGroup` (
	`gameGroupId` text NOT NULL,
	`leagueId` text NOT NULL,
	`teamId` text NOT NULL,
	`runs` integer NOT NULL,
	PRIMARY KEY(`gameGroupId`, `teamId`),
	FOREIGN KEY (`leagueId`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `statsPitchingPlayerGame` (
	`gameGroupId` text NOT NULL,
	`gameId` text NOT NULL,
	`leagueId` text NOT NULL,
	`playerId` text NOT NULL,
	`teamId` text NOT NULL,
	`runs` integer NOT NULL,
	PRIMARY KEY(`gameGroupId`, `gameId`, `playerId`),
	FOREIGN KEY (`gameGroupId`) REFERENCES `gameGroups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`leagueId`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`playerId`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `statsPitchingPlayerGameGroup` (
	`gameGroupId` text NOT NULL,
	`leagueId` text NOT NULL,
	`playerId` text NOT NULL,
	`teamId` text NOT NULL,
	`runs` integer NOT NULL,
	PRIMARY KEY(`gameGroupId`, `teamId`),
	FOREIGN KEY (`leagueId`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`playerId`) REFERENCES `players`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `statsPitchingTeamGame` (
	`gameGroupId` text NOT NULL,
	`gameId` text NOT NULL,
	`leagueId` text NOT NULL,
	`teamId` text NOT NULL,
	`runs` integer NOT NULL,
	PRIMARY KEY(`gameGroupId`, `gameId`, `teamId`),
	FOREIGN KEY (`gameGroupId`) REFERENCES `gameGroups`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`leagueId`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `statsPitchingTeamGameGroup` (
	`gameGroupId` text NOT NULL,
	`leagueId` text NOT NULL,
	`teamId` text NOT NULL,
	`runs` integer NOT NULL,
	PRIMARY KEY(`gameGroupId`, `teamId`),
	FOREIGN KEY (`leagueId`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`teamId`) REFERENCES `teams`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `subLeagues` (
	`id` text PRIMARY KEY NOT NULL,
	`leagueId` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	FOREIGN KEY (`leagueId`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`abbrev` text NOT NULL,
	`backgroundColor` text NOT NULL,
	`divisionId` text NOT NULL,
	`hatMainColor` text NOT NULL,
	`hatVisorColor` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`jerseyAwayColor` text NOT NULL,
	`jerseyMainColor` text NOT NULL,
	`leagueId` text NOT NULL,
	`name` text NOT NULL,
	`nickname` text NOT NULL,
	`slug` text NOT NULL,
	`subLeagueId` text NOT NULL,
	`textColor` text NOT NULL,
	`parkId` text NOT NULL,
	FOREIGN KEY (`divisionId`) REFERENCES `divisions`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`leagueId`) REFERENCES `leagues`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subLeagueId`) REFERENCES `subLeagues`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`parkId`) REFERENCES `parks`(`id`) ON UPDATE no action ON DELETE no action
);
