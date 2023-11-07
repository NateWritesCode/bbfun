import {
	PITCH_TYPES,
	TInputWrangleXPitchLocater,
	TInputWrangleXPitchPicker,
	ZInputWrangleXPitchPicker,
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

	public predictPitchInPlay = () => {
		if (!this.pitchInPlay) {
			throw new Error("Model not loaded");
		}
	};
	public predictPitchOutcome = () => {
		if (!this.pitchOutcome) {
			throw new Error("Model not loaded");
		}
	};
	public predictPitchPicker = (input: TInputWrangleXPitchPicker) => {
		if (!this.pitchPicker) {
			throw new Error("Model not loaded");
		}
		ZInputWrangleXPitchPicker.parse(input);

		const tensor = tf.tensor2d([wrangleXPitchPicker(input)]);

		const predictResult = this.pitchPicker.predict(tensor) as tf.Tensor;

		const maxIndex = predictResult.argMax(1).dataSync()[0];

		const predictedPitchType = PITCH_TYPES[maxIndex];

		return predictedPitchType;
	};
	public predictPitchLocater = (input: TInputWrangleXPitchLocater) => {
		if (!this.pitchLocater) {
			throw new Error("Model not loaded");
		}

		const tensor = tf.tensor2d([wrangleXPitchLocater(input)]);
		const predictResult = this.pitchLocater.predict(tensor) as tf.Tensor;
	};
}

export default ModelClient;
