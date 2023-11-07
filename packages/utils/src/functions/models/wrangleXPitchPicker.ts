import {
	TInputWrangleXPitchPicker,
	ZInputWrangleXPitchPicker,
	ZResponseWrangleXPitchPicker,
} from "@bbfun/utils";

export default (input: TInputWrangleXPitchPicker) => {
	ZInputWrangleXPitchPicker.parse(input);

	const response = [
		input.balls,
		input.changeup,
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

	return ZResponseWrangleXPitchPicker.parse(response);
};
