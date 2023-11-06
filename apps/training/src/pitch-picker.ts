import { PATH_OUTPUT_ROOT, PITCH_TYPES } from "@bbfun/utils";
import { TRowOotp, TRowPitchFx, ZRowOotp, ZRowPitchFx } from "@bbfun/utils";
import { createFolderPathIfNeeded, getJsonData } from "@bbfun/utils";
import tf from "@tensorflow/tfjs-node";
import { z } from "zod";

const MODEL_NAME = "pitch-picker";
const PATH_OUTPUT = `../server/src/models/${MODEL_NAME}`;

createFolderPathIfNeeded(PATH_OUTPUT);

const pitchingData = getJsonData<TRowPitchFx[]>({
	path: `${PATH_OUTPUT_ROOT}/historical/pitchfx/2011/pitching.json`,
	zodParser: z.array(ZRowPitchFx),
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
			balls: pitch.balls,
			outs: pitch.outs,
			pitchName: pitch.pitchName,
			strikes: pitch.strikes,
			...player.pitches,
		};
	});

const wrangledDataLength = wrangledData.length;
const trainingDataLength = Math.floor(wrangledDataLength * 0.8);
const trainingData = wrangledData.slice(0, trainingDataLength);
const testingData = wrangledData.slice(trainingDataLength);

const getXs = (rows: typeof wrangledData) => {
	const pitchInputs: number[][] = [];

	for (const row of rows) {
		pitchInputs.push([
			row.balls,
			row.changeup,
			row.circlechange,
			row.cutter,
			row.curveball,
			row.fastball,
			row.forkball,
			row.knuckleball,
			row.knucklecurve,
			row.outs,
			row.screwball,
			row.sinker,
			row.slider,
			row.splitter,
			row.strikes,
		]);
	}

	const xs = tf.tensor2d(pitchInputs);

	return xs;
};

const getYs = (rows: typeof wrangledData) => {
	const pitchTypes: number[] = [];

	for (const row of rows) {
		pitchTypes.push(
			PITCH_TYPES.indexOf(row.pitchName as typeof PITCH_TYPES[number]),
		);
	}

	const pitchTypesTensor = tf.tensor1d(pitchTypes, "int32");

	const ys = tf.oneHot(pitchTypesTensor, PITCH_TYPES.length);

	return ys;
};

const model = tf.sequential();
model.add(
	tf.layers.dense({
		inputShape: [15],
		units: 250,
		activation: "relu",
	}),
);
model.add(tf.layers.dense({ units: 175, activation: "relu" }));
model.add(tf.layers.dense({ units: 150, activation: "relu" }));
model.add(
	tf.layers.dense({
		units: PITCH_TYPES.length,
		activation: "softmax",
	}),
);
model.compile({
	loss: "categoricalCrossentropy",
	optimizer: tf.train.adam(),
	metrics: ["accuracy"],
});

(async () => {
	await model.fit(getXs(trainingData), getYs(trainingData), {
		epochs: 100,
		validationSplit: 0.1,
	});

	let numRight = 0;

	for (const row of testingData) {
		const tensor = tf.tensor2d([
			[
				row.balls,
				row.changeup,
				row.circlechange,
				row.cutter,
				row.curveball,
				row.fastball,
				row.forkball,
				row.knuckleball,
				row.knucklecurve,
				row.outs,
				row.screwball,
				row.sinker,
				row.slider,
				row.splitter,
				row.strikes,
			],
		]);

		const predictResult = model.predict(tensor) as tf.Tensor;
		predictResult.print();

		const maxIndex = predictResult.argMax(1).dataSync()[0];

		const predictedPitchType = PITCH_TYPES[maxIndex];
		const actualPitchType = row.pitchName;

		if (predictedPitchType === actualPitchType) {
			numRight++;
		}
	}

	console.info("numRight", numRight);
	console.info("accuracy", numRight / testingData.length);
	await model.save(`file://${PATH_OUTPUT}`);
})();
