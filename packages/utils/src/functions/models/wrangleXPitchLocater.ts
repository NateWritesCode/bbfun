import { PITCH_TYPES } from "@bbfun/utils";
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
			PITCH_TYPES.indexOf(parsedInput.pitchName as typeof PITCH_TYPES[0]),
			PITCH_TYPES.length,
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
