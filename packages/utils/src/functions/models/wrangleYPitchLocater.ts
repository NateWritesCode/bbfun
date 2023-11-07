import {
	TInputWrangleYPitchLocater,
	ZInputWrangleYPitchLocater,
	ZResponseWrangleYPitchLocater,
} from "src";

export default (input: TInputWrangleYPitchLocater) => {
	ZInputWrangleYPitchLocater.parse(input);
	const keys = Object.keys(input);

	const response = [
		input.ax,
		input.ay,
		input.az,
		input.pfxX,
		input.pfxZ,
		input.plateX,
		input.plateZ,
		input.releaseSpeed,
		input.releasePosX,
		input.releasePosY,
		input.releasePosZ,
		input.szBot,
		input.szTop,
		input.vx0,
		input.vy0,
		input.vz0,
	];

	return ZResponseWrangleYPitchLocater.parse(response);
};
