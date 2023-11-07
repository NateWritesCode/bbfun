import {
	TInputWrangleXPitchOutcome,
	ZInputWrangleXPitchOutcome,
	ZResponseWrangleXPitchOutcome,
	getObjKeysInAlphabeticOrder,
} from "src";

export default (input: TInputWrangleXPitchOutcome) => {
	const parsedInput = ZInputWrangleXPitchOutcome.parse(input);

	const keys = getObjKeysInAlphabeticOrder(parsedInput) as Array<
		keyof TInputWrangleXPitchOutcome
	>;

	const response: number[] = [];

	for (const key of keys) {
		response.push(parsedInput[key]);
	}

	return ZResponseWrangleXPitchOutcome.parse(response);
};
