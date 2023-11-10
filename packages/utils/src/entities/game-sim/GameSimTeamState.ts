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

type TBattingStatistics = {
	bb: number;
	doubles: number;
	h: number;
	hr: number;
	k: number;
	lob: number;
	outs: number;
	rbi: number;
	runs: number;
	singles: number;
	triples: number;
};

type TPitchingStatistics = {
	battersFaced: number;
	bb: number;
	doublesAllowed: number;
	k: number;
	pitchesThrown: number;
	pitchesThrownBalls: number;
	pitchesThrownInPlay: number;
	pitchesThrownStrikes: number;
	hitsAllowed: number;
	hrsAllowed: number;
	lob: number;
	outs: number;
	runsAllowed: number;
	runsEarned: number;
	singlesAllowed: number;
	triplesAllowed: number;
};

type TStatistics = {
	batting: TBattingStatistics;
	pitching: TPitchingStatistics;
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
			batting: {
				bb: 0,
				doubles: 0,
				h: 0,
				hr: 0,
				k: 0,
				lob: 0,
				outs: 0,
				rbi: 0,
				runs: 0,
				singles: 0,
				triples: 0,
			},
			pitching: {
				battersFaced: 0,
				bb: 0,
				doublesAllowed: 0,
				hitsAllowed: 0,
				hrsAllowed: 0,
				k: 0,
				lob: 0,
				outs: 0,
				pitchesThrown: 0,
				pitchesThrownBalls: 0,
				pitchesThrownInPlay: 0,
				pitchesThrownStrikes: 0,
				runsAllowed: 0,
				runsEarned: 0,
				singlesAllowed: 0,
				triplesAllowed: 0,
			},
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
				const {
					teamDefense,
					teamOffense,
					playerRunner1,
					playerRunner2,
					playerRunner3,
				} = input.data;

				if (teamOffense.id === this.id) {
					this.statistics.batting.hr++;
				}

				if (teamDefense.id === this.id) {
					this.statistics.pitching.hrsAllowed++;
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
				const { teamDefense, teamOffense } = input.data;

				if (teamOffense.id === this.id) {
					this.statistics.batting.runs++;
				}

				if (teamDefense.id === this.id) {
					this.statistics.pitching.runsAllowed++;
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
