import {
	TInputWrangleXPitchInPlay,
	ZInputWrangleXPitchInPlay,
	ZResponseWrangleXPitchInPlay,
	getObjKeysInAlphabeticOrder,
} from "src";

export default (input: TInputWrangleXPitchInPlay) => {
	const parsedInput = ZInputWrangleXPitchInPlay.parse(input);

	const keys = getObjKeysInAlphabeticOrder(parsedInput) as Array<
		keyof TInputWrangleXPitchInPlay
	>;

	const response: number[] = [];

	for (const key of keys) {
		response.push(parsedInput[key]);
	}

	return ZResponseWrangleXPitchInPlay.parse(response);
};
