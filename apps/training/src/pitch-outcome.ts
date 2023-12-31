import {
   PATH_MODEL_ROOT,
   PATH_OUTPUT_ROOT,
   PITCH_OUTCOMES,
   wrangleXPitchOutcome,
} from "@bbfun/utils";
import {
   TRowOotpPlayer,
   TRowOutputPitchFx,
   ZRowOotpPlayer,
   ZRowOutputPitchFx,
} from "@bbfun/utils";
import { createFolderPathIfNeeded, getJsonData } from "@bbfun/utils";
import * as tf from "@tensorflow/tfjs-node";
import invariant from "tiny-invariant";
import { z } from "zod";

const epochs = Bun.env.NUM_EPOCHS && Number(Bun.env.NUM_EPOCHS);
invariant(epochs, "epochs is undefined");
console.info("epochs", epochs);

const MODEL_NAME = "pitch-outcome";
const PATH_OUTPUT = `${PATH_MODEL_ROOT}/${MODEL_NAME}`;

createFolderPathIfNeeded(PATH_OUTPUT);

const battingData = getJsonData<TRowOutputPitchFx[]>({
   path: `${PATH_OUTPUT_ROOT}/historical/pitchfx/2011/batting.json`,
   zodParser: z.array(ZRowOutputPitchFx),
});

const ootp = getJsonData<TRowOotpPlayer[]>({
   path: `${PATH_OUTPUT_ROOT}/ootp/2011/players.json`,
   zodParser: z.array(ZRowOotpPlayer),
});

const wrangledData = battingData
   .filter((pitch) => {
      const pitcherId = pitch.pitcherId as keyof typeof ootp;
      const player = ootp.find((player) => player.id === pitcherId);

      if (!player) {
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
         avoidKs: player.ratings.batting.avoidKs,
         contact: player.ratings.batting.contact,
         eye: player.ratings.batting.eye,
         gap: player.ratings.batting.gap,
         power: player.ratings.batting.power,
         pitchOutcome: pitch.pitchOutcome as typeof PITCH_OUTCOMES[number],
      };
   });

const wrangledDataLength = wrangledData.length;
const trainingDataLength = Math.floor(wrangledDataLength * 0.8);
const trainingData = wrangledData.slice(0, trainingDataLength);
const testingData = wrangledData.slice(trainingDataLength);

const getXs = (rows: typeof wrangledData) => {
   const pitchInputs: number[][] = [];

   for (const row of rows) {
      const input = wrangleXPitchOutcome(row);

      pitchInputs.push(input);
   }

   const xs = tf.tensor2d(pitchInputs);

   return xs;
};

const getYs = (rows: typeof wrangledData) => {
   const pitchTypes: number[] = [];

   for (const row of rows) {
      pitchTypes.push(PITCH_OUTCOMES.indexOf(row.pitchOutcome));
   }

   const pitchTypesTensor = tf.tensor1d(pitchTypes, "int32");

   const ys = tf.oneHot(pitchTypesTensor, PITCH_OUTCOMES.length);

   return ys;
};

const model = tf.sequential();
model.add(
   tf.layers.dense({
      inputShape: [21],
      units: 250,
      activation: "relu",
   }),
);
model.add(tf.layers.dense({ units: 175, activation: "relu" }));
model.add(tf.layers.dense({ units: 150, activation: "relu" }));
model.add(
   tf.layers.dense({
      units: PITCH_OUTCOMES.length,
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
      const tensor = tf.tensor2d([wrangleXPitchOutcome(row)]);

      const predictResult = model.predict(tensor) as tf.Tensor;

      const maxIndex = predictResult.argMax(1).dataSync()[0];

      const predictedPitchType = PITCH_OUTCOMES[maxIndex];
      const actualPitchType = row.pitchOutcome;

      if (predictedPitchType === actualPitchType) {
         numRight++;
      }
   }

   console.info("numRight", numRight);
   console.info("accuracy", numRight / testingData.length);
   await model.save(`file://${PATH_MODEL_ROOT}/${MODEL_NAME}`);
})();
