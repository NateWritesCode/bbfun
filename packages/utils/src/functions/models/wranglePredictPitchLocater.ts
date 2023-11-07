import {
	TInputWrangleYPitchLocater,
	TResponseWrangleYPitchLocater,
	ZInputWrangleYPitchLocater,
} from "src";
import getZodObjKeysInAlphabeticOrder from "../general/getZodObjKeysInAlphabeticOrder";

export default (input: TResponseWrangleYPitchLocater) => {
	const keys = getZodObjKeysInAlphabeticOrder(
		ZInputWrangleYPitchLocater,
	) as Array<keyof TInputWrangleYPitchLocater>;

	const buildObj: { [key: string]: number } = {};

	for (const [i, key] of keys.entries()) {
		buildObj[key] = input[i];
	}

	return ZInputWrangleYPitchLocater.parse(buildObj);
};
