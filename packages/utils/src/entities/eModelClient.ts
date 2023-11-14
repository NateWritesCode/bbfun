import {
	PITCH_IN_PLAY_EVENTS,
	PITCH_NAMES,
	PITCH_OUTCOMES,
	TInputWrangleXPitchInPlay,
	TInputWrangleXPitchLocater,
	TInputWrangleXPitchOutcome,
	TInputWrangleXPitchPicker,
	ZInputWrangleXPitchInPlay,
	ZInputWrangleXPitchLocater,
	ZInputWrangleXPitchOutcome,
	ZInputWrangleXPitchPicker,
	wranglePredictPitchLocater,
	wrangleXPitchInPlay,
	wrangleXPitchOutcome,
} from "@bbfun/utils";
import { wrangleXPitchLocater, wrangleXPitchPicker } from "@bbfun/utils";
import tf from "@tensorflow/tfjs";

class ModelClient {
	pitchInPlay: tf.LayersModel | null = null;
	pitchOutcome: tf.LayersModel | null = null;
	pitchPicker: tf.LayersModel | null = null;
	pitchLocater: tf.LayersModel | null = null;

	init = async () => {
		this.pitchInPlay = await tf.loadLayersModel(
			"http://localhost:3000/models/pitch-in-play/model.json",
		);
		this.pitchLocater = await tf.loadLayersModel(
			"http://localhost:3000/models/pitch-locater/model.json",
		);
		this.pitchOutcome = await tf.loadLayersModel(
			"http://localhost:3000/models/pitch-outcome/model.json",
		);
		this.pitchPicker = await tf.loadLayersModel(
			"http://localhost:3000/models/pitch-picker/model.json",
		);

		console.info("Models loaded");
	};

	public predictPitchInPlay = (input: TInputWrangleXPitchInPlay) => {
		if (!this.pitchInPlay) {
			throw new Error("Model not loaded");
		}
		const parsedInput = ZInputWrangleXPitchInPlay.parse(input);

		const tensor = tf.tensor2d([wrangleXPitchInPlay(parsedInput)]);

		const predictResult = this.pitchInPlay.predict(tensor) as tf.Tensor;

		const arr = predictResult.arraySync();

		if (Array.isArray(arr) && arr.length === 1) {
			const values = arr[0] as number[];
			const tensor = tf.tensor2d([values]);

			const sampledIndexTensor = tf.multinomial(tensor, 1);
			const sampledIndex = sampledIndexTensor.dataSync()[0];

			const predictedInPlayEvent = PITCH_IN_PLAY_EVENTS[sampledIndex];

			return predictedInPlayEvent;
		}

		throw new Error("Predict result should be an array of length 2");
	};
	public predictPitchOutcome = (input: TInputWrangleXPitchOutcome) => {
		if (!this.pitchOutcome) {
			throw new Error("Model not loaded");
		}

		const parsedInput = ZInputWrangleXPitchOutcome.parse(input);

		const tensor = tf.tensor2d([wrangleXPitchOutcome(parsedInput)]);

		const predictResult = this.pitchOutcome.predict(tensor) as tf.Tensor;

		const maxIndex = predictResult.argMax(1).dataSync()[0];

		const predictedPitchType = PITCH_OUTCOMES[maxIndex];

		return predictedPitchType;
	};
	public predictPitchPicker = (input: TInputWrangleXPitchPicker) => {
		if (!this.pitchPicker) {
			throw new Error("Model not loaded");
		}
		const parsedInput = ZInputWrangleXPitchPicker.parse(input);

		const tensor = tf.tensor2d([wrangleXPitchPicker(parsedInput)]);

		const predictResult = this.pitchPicker.predict(tensor) as tf.Tensor;

		const maxIndex = predictResult.argMax(1).dataSync()[0];

		const predictedPitchType = PITCH_NAMES[maxIndex];

		return predictedPitchType;
	};
	public predictPitchLocater = (input: TInputWrangleXPitchLocater) => {
		if (!this.pitchLocater) {
			throw new Error("Model not loaded");
		}

		const parsedInput = ZInputWrangleXPitchLocater.parse(input);

		const tensor = tf.tensor2d([wrangleXPitchLocater(parsedInput)]);
		const predictResult = this.pitchLocater.predict(tensor) as tf.Tensor;
		const predictResultArray = predictResult.arraySync() as number[];

		if (predictResultArray.length !== 1) {
			throw new Error("Predict result should be an array of length 2");
		}

		const result = predictResultArray[0] as unknown as number[];

		const response = wranglePredictPitchLocater(result);

		return response;
	};
}

export default ModelClient;
