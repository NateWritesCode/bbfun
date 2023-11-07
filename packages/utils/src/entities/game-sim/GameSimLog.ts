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
			case "atBatEnd": {
				console.info("atBatEnd");
				break;
			}
			case "atBatStart": {
				console.info("atBatStart");
				break;
			}
			case "gameEnd": {
				console.info("gameEnd");
				break;
			}
			case "gameStart": {
				console.info("gameStart");
				break;
			}
			case "halfInningEnd": {
				console.info("halfInningEnd");
				break;
			}
			case "halfInningStart": {
				console.info("halfInningStart");
				break;
			}
			case "homeRun": {
				console.info("homeRun");
				break;
			}
			case "out": {
				console.info("out");
				break;
			}
			default:
				assertExhaustive(input);
		}
	}
}
