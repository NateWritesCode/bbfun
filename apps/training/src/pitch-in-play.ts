import tf from "@tensorflow/tfjs-node";
import { z } from "zod";

import { PATH_MODEL_ROOT, PATH_OUTPUT_ROOT } from "@bbfun/utils";
import { TRowOotp, TRowPitchFx, ZRowOotp, ZRowPitchFx } from "@bbfun/utils";
import { createFolderPathIfNeeded, getJsonData } from "@bbfun/utils";

const battingData = getJsonData<TRowPitchFx[]>({
	path: `${PATH_OUTPUT_ROOT}/historical/pitchfx/2011/batting.json`,
	zodParser: z.array(ZRowPitchFx),
});

const ootp = getJsonData<TRowOotp[]>({
	path: `${PATH_OUTPUT_ROOT}/ootp/2011/players.json`,
	zodParser: z.array(ZRowOotp),
});

const MODEL_NAME = "pitch-in-play";
const PATH_OUTPUT = `${PATH_MODEL_ROOT}/${MODEL_NAME}`;

createFolderPathIfNeeded(PATH_OUTPUT);

const PITCH_OUTCOMES_LIST = [
	"FIELD_OUT",
	"HOME_RUN",
	"WALK",
	"SINGLE",
	"STRIKEOUT",
	"GROUNDED_INTO_DOUBLE_PLAY",
	"FIELD_ERROR",
	"HIT_BY_PITCH",
	"DOUBLE",
	"SAC_BUNT",
	"FORCE_OUT",
	"TRIPLE",
	"INTENTIONAL_WALK",
	"CAUGHT_STEALING_2B",
	"SAC_FLY",
	"FIELDERS_CHOICE_OUT",
	"PICKOFF_2B",
	"STRIKEOUT_DOUBLE_PLAY",
	"DOUBLE_PLAY",
	"TRIPLE_PLAY",
	"FIELDERS_CHOICE",
	"PICKOFF_1B",
	"RUNNER_DOUBLE_PLAY",
	"OTHER_OUT",
	"WILD_PITCH",
];

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
			contact: player.contact,
			events: pitch.events,
			gap: player.gap,
			power: player.power,
		};
	});

const wrangledDataLength = wrangledData.length;
const trainingDataLength = Math.floor(wrangledDataLength * 0.8);

const trainingData = wrangledData.slice(0, trainingDataLength);
const testingData = wrangledData.slice(trainingDataLength);

const getXs = (rows: typeof wrangledData) => {
	const pitchInputs: number[][] = [];

	for (const row of rows) {
		const input = [
			row.ax,
			row.ay,
			row.az,
			row.pfxX,
			row.pfxZ,
			row.plateX,
			row.plateZ,
			row.releaseSpeed,
			row.releasePosX,
			row.releasePosY,
			row.releasePosZ,
			row.szBot,
			row.szTop,
			row.vx0,
			row.vy0,
			row.vz0,
			row.contact,
			row.gap,
			row.power,
		];

		pitchInputs.push(input);
	}

	const xs = tf.tensor2d(pitchInputs);

	return xs;
};

const getYs = (rows: typeof wrangledData) => {
	const pitchOutcomes: number[] = [];

	for (const row of rows) {
		pitchOutcomes.push(PITCH_OUTCOMES_LIST.indexOf(row.events));
	}

	const pitchOutcomesTensor = tf.tensor1d(pitchOutcomes, "int32");

	const ys = tf.oneHot(pitchOutcomesTensor, PITCH_OUTCOMES_LIST.length);

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
		units: PITCH_OUTCOMES_LIST.length,
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
				row.ax,
				row.ay,
				row.az,
				row.pfxX,
				row.pfxZ,
				row.plateX,
				row.plateZ,
				row.releaseSpeed,
				row.releasePosX,
				row.releasePosY,
				row.releasePosZ,
				row.szBot,
				row.szTop,
				row.vx0,
				row.vy0,
				row.vz0,
				row.contact,
				row.gap,
				row.power,
			],
		]);

		const predictResult = model.predict(tensor) as tf.Tensor;
		predictResult.print();

		const maxIndex = predictResult.argMax(1).dataSync()[0];

		const predictedOutcome = PITCH_OUTCOMES_LIST[maxIndex];
		const actualOutcome = row.events;

		if (predictedOutcome === actualOutcome) {
			numRight++;
		}
	}

	console.info("numRight", numRight);
	console.info("accuracy", numRight / testingData.length);
	await model.save(`file://${PATH_OUTPUT}`);
})();