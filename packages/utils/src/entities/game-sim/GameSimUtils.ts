import {
	TInputGetNumRunnersOnBase,
	ZInputGetNumRunnersOnBase,
} from "@bbfun/utils";

export default class GameSimUtils {
	protected getNumRunnersOnBase(input: TInputGetNumRunnersOnBase): number {
		const { r1, r2, r3 } = ZInputGetNumRunnersOnBase.parse(input);

		let counter = 0;

		if (r1) {
			counter++;
		}

		if (r2) {
			counter++;
		}

		if (r3) {
			counter++;
		}

		return counter;
	}
}
