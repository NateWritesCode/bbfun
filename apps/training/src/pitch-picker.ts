import {
	PATH_MODEL_ROOT,
	PATH_OUTPUT_ROOT,
	PITCH_NAMES,
	TRowOotpPlayer,
	TRowOutputPitchFx,
	ZRowOotpPlayer,
	ZRowOutputPitchFx,
	wrangleXPitchPicker,
} from "@bbfun/utils";
import { createFolderPathIfNeeded, getJsonData } from "@bbfun/utils";
import tf from "@tensorflow/tfjs-node";
import invariant from "tiny-invariant";
import { z } from "zod";

const epochs = Bun.env.NUM_EPOCHS && Number(Bun.env.NUM_EPOCHS);
invariant(epochs, "epochs is undefined");

console.info("epochs", epochs);

const MODEL_NAME = "pitch-picker";
const PATH_OUTPUT = `${PATH_MODEL_ROOT}/${MODEL_NAME}`;

createFolderPathIfNeeded(PATH_OUTPUT);

const pitchingData = getJsonData<TRowOutputPitchFx[]>({
	path: `${PATH_OUTPUT_ROOT}/historical/pitchfx/2011/pitching.json`,
	zodParser: z.array(ZRowOutputPitchFx),
});

const ootp = getJsonData<TRowOotpPlayer[]>({
	path: `${PATH_OUTPUT_ROOT}/ootp/2011/players.json`,
	zodParser: z.array(ZRowOotpPlayer),
});

const wrangledData = pitchingData
	.filter((pitch) => {
		const pitcherId = pitch.pitcherId as keyof typeof ootp;
		const player = ootp.find((player) => player.id === pitcherId);

		if (!player) {
			return false;
		}

		if (
			!player.ratings.pitching.pitches ||
			!player.ratings.pitching.pitches[
				pitch.pitchName as keyof typeof player.ratings.pitching.pitches
			]
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
			balls: pitch.balls,
			outs: pitch.outs,
			pitchName: pitch.pitchName,
			strikes: pitch.strikes,
			...player.ratings.pitching.pitches,
		};
	});

const wrangledDataLength = wrangledData.length;
const trainingDataLength = Math.floor(wrangledDataLength * 0.8);
const trainingData = wrangledData.slice(0, trainingDataLength);
const testingData = wrangledData.slice(trainingDataLength);

const getXs = (rows: typeof wrangledData) => {
	const pitchInputs: number[][] = [];

	for (const row of rows) {
		pitchInputs.push(
			wrangleXPitchPicker({
				...row,
			}),
		);
	}

	const xs = tf.tensor2d(pitchInputs);

	return xs;
};

const getYs = (rows: typeof wrangledData) => {
	const pitchTypes: number[] = [];

	for (const row of rows) {
		pitchTypes.push(
			PITCH_NAMES.indexOf(row.pitchName as typeof PITCH_NAMES[number]),
		);
	}

	const pitchTypesTensor = tf.tensor1d(pitchTypes, "int32");

	const ys = tf.oneHot(pitchTypesTensor, PITCH_NAMES.length);

	return ys;
};

const model = tf.sequential();
model.add(
	tf.layers.dense({
		inputShape: [14],
		units: 250,
		activation: "relu",
	}),
);
model.add(tf.layers.dense({ units: 175, activation: "relu" }));
model.add(tf.layers.dense({ units: 150, activation: "relu" }));
model.add(
	tf.layers.dense({
		units: PITCH_NAMES.length,
		activation: "softmax",
	}),
);
model.compile({
	loss: "categoricalCrossentropy",
	optimizer: tf.train.adam(),
	metrics: ["accuracy"],
});

(async () => {
	console.info(`Fitting model ${MODEL_NAME}...`);
	await model.fit(getXs(trainingData), getYs(trainingData), {
		epochs,
		validationSplit: 0.1,
	});
	console.info(`Finished fitting model ${MODEL_NAME}...`);

	let numRight = 0;

	for (const row of testingData) {
		const tensor = tf.tensor2d([
			wrangleXPitchPicker({
				...row,
			}),
		]);

		const predictResult = model.predict(tensor) as tf.Tensor;

		const maxIndex = predictResult.argMax(1).dataSync()[0];

		const predictedPitchType = PITCH_NAMES[maxIndex];
		const actualPitchType = row.pitchName;

		if (predictedPitchType === actualPitchType) {
			numRight++;
		}
	}

	console.info("numRight", numRight);
	console.info("accuracy", numRight / testingData.length);
	console.info("Saving model");
	await model.save(`http://localhost:3000/uploadModel/${MODEL_NAME}`);
	console.info("Finished saving model");
})();
