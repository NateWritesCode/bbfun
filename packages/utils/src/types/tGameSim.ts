import {
	GameSimPlayerState,
	GameSimTeamState,
	ModelClient,
	PITCH_NAMES,
	PITCH_OUTCOMES,
	ZInputWrangleYPitchLocater,
} from "@bbfun/utils";
import { z } from "zod";
import { ZEGamePositions } from "./tEnums";
import { ZPerson } from "./tPerson";
import { ZPlayer, ZPlayerRatings } from "./tPlayer";
import { ZRegexSlug } from "./tRegex";
import { ZVenue } from "./tVenue";

export const ZGameTeamPlayers = z
	.array(
		z.object({
			id: ZRegexSlug,
			person: ZPerson,
			position: ZEGamePositions,
			ratings: ZPlayer.shape.ratings,
		}),
	)
	.min(9)
	.max(9);
export type TGameTeamPlayers = z.infer<typeof ZGameTeamPlayers>;

export const ZGameTeam = z.object({
	id: ZRegexSlug,
	players: ZGameTeamPlayers,
});
export type TGameTeam = z.infer<typeof ZGameTeam>;

export const ZGameVenue = ZVenue;
export type TGameVenue = z.infer<typeof ZGameVenue>;

export const ZConstructorGameSim = z.object({
	id: z.string(),
	modelClient: z.instanceof(ModelClient),
	teams: z.tuple([ZGameTeam, ZGameTeam]),
	venue: ZGameVenue,
});
export type TConstructorGameSim = z.infer<typeof ZConstructorGameSim>;

export const ZConstructorGameSimTeamState = z.object({
	id: ZRegexSlug,
	players: ZGameTeamPlayers,
});
export type TConstructorGameSimTeamState = z.infer<
	typeof ZConstructorGameSimTeamState
>;

export const ZConstructorGameSimPlayerState = z.object({
	id: ZRegexSlug,
	ratings: ZPlayerRatings,
});
export type TConstructorGameSimPlayerState = z.infer<
	typeof ZConstructorGameSimPlayerState
>;

export const ZConstructorGameSimEventStore = z.object({
	id: ZRegexSlug,
});
export type TConstructorGameSimEventStore = z.infer<
	typeof ZConstructorGameSimEventStore
>;
export const ZConstructorGameSimLog = z.object({ id: ZRegexSlug });
export type TConstructorGameSimLog = z.infer<typeof ZConstructorGameSimLog>;

export const ZGameSimPlayerStates = z.record(z.instanceof(GameSimPlayerState));
export type TGameSimPlayerStates = z.infer<typeof ZGameSimPlayerStates>;

export const ZGameSimTeamStates = z.record(z.instanceof(GameSimTeamState));
export type TGameSimTeamStates = z.infer<typeof ZGameSimTeamStates>;

// GAME SIM EVENTS

const ZGameSimEventGameStart = z.object({
	data: z.null().optional(),
	gameEvent: z.literal("gameStart"),
});
export type TGameSimEventGameStart = z.infer<typeof ZGameSimEventGameStart>;

const ZGameSimEventGameEnd = z.object({
	data: z.null().optional(),
	gameEvent: z.literal("gameEnd"),
});
export type TGameSimEventGameEnd = z.infer<typeof ZGameSimEventGameEnd>;

const ZGameSimEventHalfInningStart = z.object({
	data: z.null().optional(),
	gameEvent: z.literal("halfInningStart"),
});
export type TGameSimEventHalfInningStart = z.infer<
	typeof ZGameSimEventHalfInningStart
>;

const ZGameSimEventHalfInningEnd = z.object({
	data: z.object({
		r1: z.instanceof(GameSimPlayerState).nullable(),
		r2: z.instanceof(GameSimPlayerState).nullable(),
		r3: z.instanceof(GameSimPlayerState).nullable(),
	}),

	gameEvent: z.literal("halfInningEnd"),
});
export type TGameSimEventHalfInningEnd = z.infer<typeof ZGameSimEventGameEnd>;

const ZGameSimEventAtBatStart = z.object({
	data: z.null().optional(),
	gameEvent: z.literal("atBatStart"),
});
export type TGameSimEventAtBatStart = z.infer<typeof ZGameSimEventAtBatStart>;

const ZGameSimEventAtBatEnd = z.object({
	data: z.null().optional(),
	gameEvent: z.literal("atBatEnd"),
});
export type TGameSimEventAtBatEnd = z.infer<typeof ZGameSimEventAtBatEnd>;

const ZGameSimEventHomeRun = z.object({
	data: z.object({
		d: ZRegexSlug,
		h: z.instanceof(GameSimPlayerState),
		o: ZRegexSlug,
		r1: z.instanceof(GameSimPlayerState).nullable(),
		r2: z.instanceof(GameSimPlayerState).nullable(),
		r3: z.instanceof(GameSimPlayerState).nullable(),
	}),
	gameEvent: z.literal("homeRun"),
});
export type TGameSimEventHomeRun = z.infer<typeof ZGameSimEventHomeRun>;

const ZGameSimEventOut = z.object({
	data: z.object({
		d: ZRegexSlug,
		h: z.instanceof(GameSimPlayerState),
		o: ZRegexSlug,
		r1: z.instanceof(GameSimPlayerState).nullable(),
		r2: z.instanceof(GameSimPlayerState).nullable(),
		r3: z.instanceof(GameSimPlayerState).nullable(),
	}),
	gameEvent: z.literal("out"),
});
export type TGameSimEventOut = z.infer<typeof ZGameSimEventOut>;

const ZGameSimEventPitch = z.object({
	data: z.object({
		d: z.instanceof(GameSimTeamState),
		h: z.instanceof(GameSimPlayerState),
		o: z.instanceof(GameSimTeamState),
		p: z.instanceof(GameSimPlayerState),
		pitchLocation: ZInputWrangleYPitchLocater,
		pitchName: z.enum(PITCH_NAMES),
		pitchOutcome: z.enum(PITCH_OUTCOMES),
	}),
	gameEvent: z.literal("pitch"),
});
export type TGameSimEventPitch = z.infer<typeof ZGameSimEventPitch>;

const ZGameSimEvent = z.discriminatedUnion("gameEvent", [
	ZGameSimEventGameEnd,
	ZGameSimEventGameStart,
	ZGameSimEventHalfInningEnd,
	ZGameSimEventHalfInningStart,
	ZGameSimEventAtBatStart,
	ZGameSimEventAtBatEnd,
	ZGameSimEventHomeRun,
	ZGameSimEventOut,
	ZGameSimEventPitch,
]);

export type TGameSimEvent = z.infer<typeof ZGameSimEvent>;
export type TGameEvents = TGameSimEvent["gameEvent"];

export const ZInputNotifyGameEvent = z.object({});

export interface OGameSimObserver {
	notifyGameEvent(input: TGameSimEvent): void;
}

export const ZInputGameSimGetCurrentHitter = z.object({
	teamIndex: z.literal(0).or(z.literal(1)),
});
export type TInputGameSimGetCurrentHitter = z.infer<
	typeof ZInputGameSimGetCurrentHitter
>;
export const ZInputGameSimGetCurrentPitcher = z.object({
	teamIndex: z.literal(0).or(z.literal(1)),
});
export type TInputGameSimGetCurrentPitcher = z.infer<
	typeof ZInputGameSimGetCurrentPitcher
>;
export const ZResponseGameSimGetCurrentHitter =
	z.instanceof(GameSimPlayerState);
export const ZResponseGameSimGetCurrentPitcher =
	z.instanceof(GameSimPlayerState);

export const ZInputGameSimGetTeamId = z.object({
	teamIndex: z.literal(0).or(z.literal(1)),
});
export type TInputGameSimGetTeamId = z.infer<typeof ZInputGameSimGetTeamId>;
