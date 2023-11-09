import {
	OGameSimObserver,
	TConstructorGameSimTeamState,
	TEGamePositions,
	TGameSimEvent,
	ZConstructorGameSimTeamState,
} from "@bbfun/utils";
import { assertExhaustive } from "@bbfun/utils";
import GamePlayerState from "./GameSimPlayerState";
import GameSimUtils from "./GameSimUtils";

type TStatistics = {
	hr: number;
	lob: number;
	runs: number;
};

export default class GameTeamState
	extends GameSimUtils
	implements OGameSimObserver
{
	id: string;
	lineupIndex: number;
	lineup: string[];
	players: GamePlayerState[];
	positions: {
		p: string;
		c: string;
		"1b": string;
		"2b": string;
		"3b": string;
		ss: string;
		lf: string;
		cf: string;
		rf: string;
	};

	// Stats
	statistics: TStatistics;

	constructor(input: TConstructorGameSimTeamState) {
		super();
		ZConstructorGameSimTeamState.parse(input);
		this.id = input.id;
		this.players = input.players;
		this.lineupIndex = 0;
		this.lineup = this.players.map((player) => player.id);

		const p = this.players.find((player) => player.position === "p");
		const c = this.players.find((player) => player.position === "c");
		const _1b = this.players.find((player) => player.position === "1b");
		const _2b = this.players.find((player) => player.position === "2b");
		const _3b = this.players.find((player) => player.position === "3b");
		const ss = this.players.find((player) => player.position === "ss");
		const lf = this.players.find((player) => player.position === "lf");
		const cf = this.players.find((player) => player.position === "cf");
		const rf = this.players.find((player) => player.position === "rf");

		if (!p || !c || !_1b || !_2b || !_3b || !ss || !lf || !cf || !rf) {
			throw new Error("Missing player");
		}

		this.positions = {
			p: p.id,
			c: c.id,
			"1b": _1b.id,
			"2b": _2b.id,
			"3b": _3b.id,
			ss: ss.id,
			lf: lf.id,
			cf: cf.id,
			rf: rf.id,
		};

		// Stats
		this.statistics = {
			hr: 0,
			lob: 0,
			runs: 0,
		};
	}

	advanceLineupIndex(): void {
		this.lineupIndex = (this.lineupIndex + 1) % this.lineup.length;
	}

	getCurrentHitterId() {
		return this.lineup[this.lineupIndex];
	}

	getPositionId({ position }: { position: TEGamePositions }) {
		return this.positions[position];
	}

	notifyGameEvent(input: TGameSimEvent): void {
		switch (input.gameEvent) {
			case "atBatEnd": {
				break;
			}
			case "atBatStart": {
				break;
			}
			case "double": {
				break;
			}
			case "gameEnd": {
				break;
			}
			case "gameStart": {
				break;
			}
			case "halfInningEnd": {
				break;
			}
			case "halfInningStart": {
				break;
			}
			case "homeRun": {
				const { teamOffense, playerRunner1, playerRunner2, playerRunner3 } =
					input.data;

				if (teamOffense.id === this.id) {
					this.statistics.hr++;
				}

				break;
			}
			case "out": {
				break;
			}
			case "pitch": {
				break;
			}
			case "run": {
				const { teamOffense } = input.data;

				if (teamOffense.id === this.id) {
					this.statistics.runs++;
				}
				break;
			}
			case "single": {
				break;
			}
			case "strikeout": {
				break;
			}
			case "triple": {
				break;
			}
			case "walk": {
				break;
			}
			default:
				assertExhaustive(input);
		}
	}
}
