import { PITCH_TYPES } from "@bbfun/utils";
import {
	TInputWrangleXPitchLocater,
	ZInputWrangleXPitchLocater,
	ZResponseWrangleXPitchLocater,
} from "@bbfun/utils";
import tf from "@tensorflow/tfjs";

export default (input: TInputWrangleXPitchLocater) => {
	ZInputWrangleXPitchLocater.parse(input);

	const pitchName = tf
		.oneHot(
			PITCH_TYPES.indexOf(input.pitchName as typeof PITCH_TYPES[0]),
			PITCH_TYPES.length,
		)
		.dataSync();

	const response = [
		input.control,
		input.movement,
		input.pitchRating,
		input.pitchNumber,
		input.stuff,
		...pitchName,
	];

	return ZResponseWrangleXPitchLocater.parse(response);
};
