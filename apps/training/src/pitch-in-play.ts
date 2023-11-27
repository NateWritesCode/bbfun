import tf from "@tensorflow/tfjs-node";
import { z } from "zod";

import {
	PATH_MODEL_ROOT,
	PATH_OUTPUT_ROOT,
	PITCH_IN_PLAY_EVENTS,
	wrangleXPitchInPlay,
} from "@bbfun/utils";
import {
	TRowOotpPlayer,
	TRowOutputPitchFx,
	ZRowOotpPlayer,
	ZRowOutputPitchFx,
} from "@bbfun/utils";
import { createFolderPathIfNeeded, getJsonData } from "@bbfun/utils";
import invariant from "tiny-invariant";

const epochs = Bun.env.NUM_EPOCHS && Number(Bun.env.NUM_EPOCHS);
invariant(epochs, "epochs is undefined");

console.info("epochs", epochs);

const battingData = getJsonData<TRowOutputPitchFx[]>({
	path: `${PATH_OUTPUT_ROOT}/historical/pitchfx/2011/batting.json`,
	zodParser: z.array(ZRowOutputPitchFx),
});

const ootp = getJsonData<TRowOotpPlayer[]>({
	path: `${PATH_OUTPUT_ROOT}/ootp/2011/players.json`,
	zodParser: z.array(ZRowOotpPlayer),
});

const MODEL_NAME = "pitch-in-play";
const PATH_OUTPUT = `${PATH_MODEL_ROOT}/${MODEL_NAME}`;

createFolderPathIfNeeded(PATH_OUTPUT);

const wrangledData = battingData
	.filter((pitch) => {
		const pitcherId = pitch.pitcherId as keyof typeof ootp;
		const player = ootp.find((player) => player.id === pitcherId);

		if (!player) {
			return false;
		}

		if (!pitch.events) {
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

		if (!pitch.events) {
			throw new Error("pitch.events is undefined");
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
			contact: player.ratings.batting.contact,
			events: pitch.events,
			gap: player.ratings.batting.gap,
			power: player.ratings.batting.power,
		};
	});

const wrangledDataLength = wrangledData.length;
const trainingDataLength = Math.floor(wrangledDataLength * 0.8);

const trainingData = wrangledData.slice(0, trainingDataLength);
const testingData = wrangledData.slice(trainingDataLength);

const getXs = (rows: typeof wrangledData) => {
	const pitchInputs: number[][] = [];

	for (const row of rows) {
		const input = wrangleXPitchInPlay(row);

		pitchInputs.push(input);
	}

	const xs = tf.tensor2d(pitchInputs);

	return xs;
};

const getYs = (rows: typeof wrangledData) => {
	const pitchOutcomes: number[] = [];

	for (const row of rows) {
		pitchOutcomes.push(PITCH_IN_PLAY_EVENTS.indexOf(row.events));
	}

	const pitchOutcomesTensor = tf.tensor1d(pitchOutcomes, "int32");

	const ys = tf.oneHot(pitchOutcomesTensor, PITCH_IN_PLAY_EVENTS.length);

	return ys;
};

const model = tf.sequential();
model.add(
	tf.layers.dense({
		inputShape: [19],
		units: 250,
		activation: "relu",
	}),
);
model.add(tf.layers.dense({ units: 175, activation: "relu" }));
model.add(tf.layers.dense({ units: 150, activation: "relu" }));
model.add(
	tf.layers.dense({
		units: PITCH_IN_PLAY_EVENTS.length,
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
		const tensor = tf.tensor2d([wrangleXPitchInPlay(row)]);

		const predictResult = model.predict(tensor) as tf.Tensor;

		const maxIndex = predictResult.argMax(1).dataSync()[0];

		const predictedOutcome = PITCH_IN_PLAY_EVENTS[maxIndex];
		const actualOutcome = row.events;

		if (predictedOutcome === actualOutcome) {
			numRight++;
		}
	}

	console.info("numRight", numRight);
	console.info("accuracy", numRight / testingData.length);
	await model.save(`http://localhost:3000/uploadModel/${MODEL_NAME}`);
})();
