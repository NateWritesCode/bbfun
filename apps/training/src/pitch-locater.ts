import {
	PATH_MODEL_ROOT,
	PATH_OUTPUT_ROOT,
	PITCH_NAMES,
	wrangleYPitchLocater,
} from "@bbfun/utils";
import {
	TRowOotp,
	TRowOutputPitchFx,
	ZRowOotp,
	ZRowOutputPitchFx,
} from "@bbfun/utils";
import { createFolderPathIfNeeded, getJsonData } from "@bbfun/utils";
import tf from "@tensorflow/tfjs";
import { z } from "zod";

const MODEL_NAME = "pitch-locater";
const PATH_OUTPUT = `${PATH_MODEL_ROOT}/${MODEL_NAME}`;

createFolderPathIfNeeded(PATH_OUTPUT);

const pitchingData = getJsonData<TRowOutputPitchFx[]>({
	path: `${PATH_OUTPUT_ROOT}/historical/pitchfx/2011/pitching.json`,
	zodParser: z.array(ZRowOutputPitchFx),
});

const ootp = getJsonData<TRowOotp[]>({
	path: `${PATH_OUTPUT_ROOT}/ootp/2011/players.json`,
	zodParser: z.array(ZRowOotp),
});

const wrangledData = pitchingData
	.filter((pitch) => {
		const pitcherId = pitch.pitcherId as keyof typeof ootp;
		const player = ootp.find((player) => player.id === pitcherId);

		if (!player) {
			return false;
		}

		if (
			!player.pitches ||
			!player.pitches[pitch.pitchName as keyof typeof player.pitches]
		) {
			return false;
		}

		return true;
	})
	.map((pitch) => {
		const pitcherId = pitch.pitcherId as keyof typeof ootp;
		const player = ootp.find((player) => player.id === pitcherId);

		if (!player) {
			throw new Error("player is undefined");
		}

		return {
			ax: pitch.ax,
			ay: pitch.ay,
			az: pitch.az,
			pfxX: pitch.pfxX,
			pfxZ: pitch.pfxZ,
			plateX: pitch.plateX,
			plateZ: pitch.plateZ,
			releaseSpeed: pitch.releaseSpeed,
			releasePosX: pitch.releasePosX,
			releasePosY: pitch.releasePosY,
			releasePosZ: pitch.releasePosZ,
			szBot: pitch.szBot,
			szTop: pitch.szTop,
			vx0: pitch.vx0,
			vy0: pitch.vy0,
			vz0: pitch.vz0,
			control: player.control,
			movement: player.movement,
			pitchName: pitch.pitchName,
			pitchNumber: pitch.pitchNumber,
			pitchRating:
				player.pitches[pitch.pitchName as keyof typeof player.pitches],
			stuff: player.stuff,
		};
	});

const wrangledDataLength = wrangledData.length;
const trainingDataLength = Math.floor(wrangledDataLength * 0.8);

const trainingData = wrangledData.slice(0, trainingDataLength);
// const testingData = wrangledData.slice(trainingDataLength);

const getXs = (rows: typeof wrangledData) => {
	const pitchInputs: number[][] = [];

	for (const row of rows) {
		const pitchName = tf
			.oneHot(
				PITCH_NAMES.indexOf(row.pitchName as typeof PITCH_NAMES[0]),
				PITCH_NAMES.length,
			)
			.dataSync();

		const input = [
			row.control,
			row.movement,
			row.pitchRating,
			row.pitchNumber,
			row.stuff,
			...pitchName,
		];

		pitchInputs.push(input);
	}

	const xs = tf.tensor2d(pitchInputs);

	return xs;
};

const getYs = (rows: typeof wrangledData) => {
	const pitchOutputs: number[][] = [];

	for (const row of rows) {
		const output = wrangleYPitchLocater(row);

		pitchOutputs.push(output);
	}

	const ys = tf.tensor2d(pitchOutputs);

	return ys;
};

const model = tf.sequential();
model.add(tf.layers.layerNormalization({ inputShape: [16] }));
model.add(tf.layers.dense({ units: 250, activation: "relu" }));
model.add(tf.layers.dense({ units: 175, activation: "relu" }));
model.add(tf.layers.dense({ units: 150, activation: "relu" }));
model.add(tf.layers.dense({ units: 16, activation: "linear" }));

model.compile({
	loss: tf.losses.meanSquaredError,
	optimizer: tf.train.sgd(0.0001),
});

(async () => {
	console.info(`Fitting model ${MODEL_NAME}...`);
	await model.fit(getXs(trainingData), getYs(trainingData), {
		epochs: 1,
		validationSplit: 0.1,
	});
	console.info(`Finished fitting model ${MODEL_NAME}...`);

	await model.save(`http://localhost:3000/uploadModel/${MODEL_NAME}`);
})();
