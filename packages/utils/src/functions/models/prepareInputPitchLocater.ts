import { PITCH_TYPES } from "@bbfun/utils";
import {
	TInputPitchLocater,
	ZInputPitchLocater,
	ZResponsePitchLocater,
} from "@bbfun/utils";
import tf from "@tensorflow/tfjs";

export default (input: TInputPitchLocater) => {
	ZInputPitchLocater.parse(input);

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

	return ZResponsePitchLocater.parse(response);
};
