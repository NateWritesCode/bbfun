import {
	OGameSimObserver,
	TConstructorGameSimLog,
	TGameSimEvent,
	ZConstructorGameSimLog,
} from "@bbfun/utils";
import { assertExhaustive } from "@bbfun/utils";

export default class GameSimLog implements OGameSimObserver {
	id: string;

	constructor(input: TConstructorGameSimLog) {
		ZConstructorGameSimLog.parse(input);
		this.id = input.id;
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
				break;
			}
			case "OUT": {
				break;
			}
			default:
				assertExhaustive(input);
		}
	}
}
