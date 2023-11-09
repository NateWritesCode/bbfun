import {
	OGameSimObserver,
	TConstructorGameSimPlayerState,
	TGameSimEvent,
	TPlayerRatings,
	ZConstructorGameSimPlayerState,
} from "@bbfun/utils";
import { assertExhaustive } from "@bbfun/utils";

type TStatistics = {
	hr: number;
	lob: number;
	pitchesThrown: number;
	pitchesThrownBalls: number;
	pitchesThrownInPlay: number;
	pitchesThrownStrikes: number;
	outs: number;
	runs: number;
};

class GamePlayerState implements OGameSimObserver {
	id: string;
	ratings: TPlayerRatings;
	statistics: TStatistics;
	// Stats

	constructor(input: TConstructorGameSimPlayerState) {
		ZConstructorGameSimPlayerState.parse(input);
		this.ratings = input.ratings;
		this.statistics = {
			hr: 0,
			lob: 0,
			pitchesThrown: 0,
			pitchesThrownBalls: 0,
			pitchesThrownInPlay: 0,
			pitchesThrownStrikes: 0,
			outs: 0,
			runs: 0,
		};

		this.id = input.id;
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
				const { playerHitter, playerRunner1, playerRunner2, playerRunner3 } =
					input.data;

				if (playerHitter.id === this.id) {
					this.statistics.runs++;
				} else {
					if (playerRunner1?.id === this.id) {
						this.statistics.runs++;
					}

					if (playerRunner2?.id === this.id) {
						this.statistics.runs++;
					}

					if (playerRunner3?.id === this.id) {
						this.statistics.runs++;
					}
				}

				break;
			}
			case "out": {
				const { playerHitter, playerRunner1, playerRunner2, playerRunner3 } =
					input.data;

				if (playerHitter.id === this.id) {
					this.outs++;
					if (playerRunner1) {
						this.lob++;
					}

					if (playerRunner2) {
						this.lob++;
					}

					if (playerRunner3) {
						this.lob++;
					}
				}

				break;
			}
			case "pitch": {
				const { playerPitcher, pitchOutcome } = input.data;

				if (playerPitcher.id === this.id) {
					this.pitchesThrown++;

					switch (pitchOutcome) {
						case "B": {
							this.pitchesThrownBalls++;
							break;
						}
						case "S": {
							this.pitchesThrownStrikes++;
							break;
						}
						case "X": {
							this.pitchesThrownInPlay++;
							break;
						}
						default: {
							const exhaustiveCheck: never = pitchOutcome;
							throw new Error(exhaustiveCheck);
						}
					}
				}

				break;
			}
			case "run": {
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

export default GamePlayerState;
