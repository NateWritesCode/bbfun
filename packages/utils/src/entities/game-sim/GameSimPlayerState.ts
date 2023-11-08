import {
	OGameSimObserver,
	TConstructorGameSimPlayerState,
	TGameSimEvent,
	TPlayerRatings,
	ZConstructorGameSimPlayerState,
} from "@bbfun/utils";
import { assertExhaustive } from "@bbfun/utils";

class GamePlayerState implements OGameSimObserver {
	id: string;
	ratings: TPlayerRatings;
	// Stats
	hr: number;
	lob: number;
	pitchesThrown: number;
	pitchesThrownBalls: number;
	pitchesThrownInPlay: number;
	pitchesThrownStrikes: number;
	outs: number;
	runs: number;

	constructor(input: TConstructorGameSimPlayerState) {
		ZConstructorGameSimPlayerState.parse(input);
		this.ratings = input.ratings;

		this.id = input.id;
		this.hr = 0;
		this.lob = 0;
		this.pitchesThrown = 0;
		this.pitchesThrownBalls = 0;
		this.pitchesThrownInPlay = 0;
		this.pitchesThrownStrikes = 0;
		this.outs = 0;
		this.runs = 0;
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
				const { h, r1, r2, r3 } = input.data;

				if (h.id === this.id) {
					this.runs++;
				} else {
					if (r1?.id === this.id) {
						this.runs++;
					}

					if (r2?.id === this.id) {
						this.runs++;
					}

					if (r3?.id === this.id) {
						this.runs++;
					}
				}

				break;
			}
			case "out": {
				const { h, r1, r2, r3 } = input.data;

				if (h.id === this.id) {
					this.outs++;
					if (r1) {
						this.lob++;
					}

					if (r2) {
						this.lob++;
					}

					if (r3) {
						this.lob++;
					}
				}

				break;
			}
			case "pitch": {
				const { p, pitchOutcome } = input.data;

				if (p.id === this.id) {
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
			default:
				assertExhaustive(input);
		}
	}
}

export default GamePlayerState;
