import {
	OGameSimObserver,
	TConstructorGameSimTeamState,
	TEGamePositions,
	TGameSimEvent,
	TGameTeamPlayers,
	ZConstructorGameSimTeamState,
} from "@bbfun/utils";
import { assertExhaustive } from "@bbfun/utils";
import GameSimUtils from "./GameSimUtils";

export default class GameTeamState
	extends GameSimUtils
	implements OGameSimObserver
{
	id: string;
	lineupIndex: number;
	lineup: string[];
	players: TGameTeamPlayers;
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
	hr: number;
	lob: number;
	runs: number;

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
		this.hr = 0;
		this.lob = 0;
		this.runs = 0;
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
				const { o, r1, r2, r3 } = input.data;

				if (o === this.id) {
					this.hr++;

					const numRunners = this.getNumRunnersOnBase({
						r1,
						r2,
						r3,
					});

					this.runs += 1 + numRunners;
				}

				break;
			}
			case "out": {
				break;
			}
			default:
				assertExhaustive(input);
		}
	}
}
