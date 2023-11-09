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

class GameSimPlayerState implements OGameSimObserver {
	id: string;
	position: string;
	ratings: TPlayerRatings;
	statistics: TStatistics;
	// Stats

	constructor(input: TConstructorGameSimPlayerState) {
		const parsedInput = ZConstructorGameSimPlayerState.parse(input);
		this.position = parsedInput.position;
		this.ratings = parsedInput.ratings;
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

		this.id = parsedInput.id;
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
					this.statistics.outs++;
					if (playerRunner1) {
						this.statistics.lob++;
					}

					if (playerRunner2) {
						this.statistics.lob++;
					}

					if (playerRunner3) {
						this.statistics.lob++;
					}
				}

				break;
			}
			case "pitch": {
				const { playerPitcher, pitchOutcome } = input.data;

				if (playerPitcher.id === this.id) {
					this.statistics.pitchesThrown++;

					switch (pitchOutcome) {
						case "B": {
							this.statistics.pitchesThrownBalls++;
							break;
						}
						case "S": {
							this.statistics.pitchesThrownStrikes++;
							break;
						}
						case "X": {
							this.statistics.pitchesThrownInPlay++;
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

export default GameSimPlayerState;
