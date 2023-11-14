import { PITCH_NAMES } from "@bbfun/utils";
import {
	TInputWrangleXPitchLocater,
	ZInputWrangleXPitchLocater,
	ZResponseWrangleXPitchLocater,
} from "@bbfun/utils";
import tf from "@tensorflow/tfjs";

export default (input: TInputWrangleXPitchLocater) => {
	const parsedInput = ZInputWrangleXPitchLocater.parse(input);

	const pitchName = tf
		.oneHot(
			PITCH_NAMES.indexOf(parsedInput.pitchName as typeof PITCH_NAMES[0]),
			PITCH_NAMES.length,
		)
		.dataSync();

	const response = [
		parsedInput.control,
		parsedInput.movement,
		parsedInput.pitchRating,
		parsedInput.pitchNumber,
		parsedInput.stuff,
		...pitchName,
	];

	return ZResponseWrangleXPitchLocater.parse(response);
};
