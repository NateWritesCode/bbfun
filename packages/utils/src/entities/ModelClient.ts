import { PITCH_TYPES } from "@bbfun/utils";
import { TInputPitchLocater, TInputPitchPicker } from "@bbfun/utils";
import {
	prepareInputPitchLocater,
	prepareInputPitchPicker,
} from "@bbfun/utils";
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

	public predictPitchInPlay = async () => {
		if (!this.pitchInPlay) {
			throw new Error("Model not loaded");
		}
	};
	public predictPitchOutcome = async () => {
		if (!this.pitchOutcome) {
			throw new Error("Model not loaded");
		}
	};
	public predictPitchPicker = async (input: TInputPitchPicker) => {
		if (!this.pitchPicker) {
			throw new Error("Model not loaded");
		}

		const tensor = tf.tensor2d([prepareInputPitchPicker(input)]);

		const predictResult = this.pitchPicker.predict(tensor) as tf.Tensor;
		predictResult.print();

		const maxIndex = predictResult.argMax(1).dataSync()[0];

		const predictedPitchType = PITCH_TYPES[maxIndex];

		return predictedPitchType;
	};
	public predictPitchLocater = async (input: TInputPitchLocater) => {
		if (!this.pitchLocater) {
			throw new Error("Model not loaded");
		}

		const tensor = tf.tensor2d([prepareInputPitchLocater(input)]);
	};
}

export default ModelClient;
