import {
	OGameSimObserver,
	TConstructorGameSimPlayerState,
	TGameSimEvent,
	ZConstructorGameSimPlayerState,
} from "@bbfun/utils";
import { assertExhaustive } from "@bbfun/utils";

class GamePlayerState implements OGameSimObserver {
	id: string;

	// Stats
	hr: number;
	lob: number;
	outs: number;
	runs: number;

	constructor(input: TConstructorGameSimPlayerState) {
		ZConstructorGameSimPlayerState.parse(input);

		this.id = input.id;
		this.hr = 0;
		this.lob = 0;
		this.outs = 0;
		this.runs = 0;
	}

	notifyGameEvent(input: TGameSimEvent): void {
		switch (input.gameEvent) {
			case "AT_BAT_END": {
				break;
			}
			case "AT_BAT_START": {
				break;
			}
			case "GAME_END": {
				break;
			}
			case "GAME_START": {
				break;
			}
			case "HALF_INNING_END": {
				break;
			}
			case "HALF_INNING_START": {
				break;
			}
			case "HOME_RUN": {
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
			case "OUT": {
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
			default:
				assertExhaustive(input);
		}
	}
}

export default GamePlayerState;
