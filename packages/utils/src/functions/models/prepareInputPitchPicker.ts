import {
	TInputPitchPicker,
	ZInputPitchPicker,
	ZResponsePitchPicker,
} from "@bbfun/utils";

export default (input: TInputPitchPicker) => {
	ZInputPitchPicker.parse(input);

	const response = [
		input.balls,
		input.changeup,
		input.circlechange,
		input.cutter,
		input.curveball,
		input.fastball,
		input.forkball,
		input.knuckleball,
		input.knucklecurve,
		input.outs,
		input.screwball,
		input.sinker,
		input.slider,
		input.splitter,
		input.strikes,
	];

	return ZResponsePitchPicker.parse(response);
};
