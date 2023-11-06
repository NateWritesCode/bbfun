import {
	DATE_FORMAT,
	HANDEDNESS,
	MAX_PERSON_RATING,
	MIN_PERSON_RATING,
} from "@bbfun/utils";
import { TEGenderCis, TEGenderIdentity } from "@bbfun/utils";
import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import { capitalize, kebabCase } from "lodash";

class FakeClient {
	private _getRandomBoxMullerTransform(min: number, max: number, skew: number) {
		// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
		let u = 0;
		let v = 0;
		while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
		while (v === 0) v = Math.random();
		let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

		num = num / 10.0 + 0.5; // Translate to 0 -> 1
		if (num > 1 || num < 0)
			num = this._getRandomBoxMullerTransform(min, max, skew);
		// resample between 0 and 1 if out of range
		else {
			num = num ** skew; // Skew
			num *= max - min; // Stretch to fill range
			num += min; // offset to min
		}

		return Math.round(num);
	}

	private _getRandom0Or1(weight?: number) {
		// Weight goes to likelihood of returning 0, so 0.3 means 30% chance of returning 0
		// If weight is not provided, it defaults to 0.5, which means 50% chance of returning 0
		if (weight && (weight <= 0 || weight >= 1)) {
			throw new Error("Weight must be between 0 and 1");
		}

		return Math.random() < (weight || 0.5) ? 0 : 1;
	}

	private _getMyersBriggsValue = (likelihood: number) => {
		const isFirstTrait = this._getRandom0Or1(likelihood);
		const firstTrait = isFirstTrait
			? this._getRandomBoxMullerTransform(50, 100, 1)
			: this._getRandomBoxMullerTransform(0, 50, 1);
		const secondTrait = 100 - firstTrait;

		return [firstTrait, secondTrait];
	};

	private _getMyersBriggs(genderCis: TEGenderCis) {
		// https://personalitymax.com/personality-types/population-gender/

		// E: Male - 45.9, Female - 52.6
		// I: Male - 54.1, Female - 47.4
		const [extraversion, intraversion] = this._getMyersBriggsValue(
			genderCis === "m" ? 0.459 : 0.526,
		);

		// S: Male - 71.9, Female - 74.9
		// N: Male - 28.1, Female - 25.1
		const [sensing, intuition] = this._getMyersBriggsValue(
			genderCis === "m" ? 0.719 : 0.749,
		);

		// T: Male - 56.5, Female - 24.4
		// F: Male - 43.5, Female - 75.6
		const [thinking, feeling] = this._getMyersBriggsValue(
			genderCis === "m" ? 0.565 : 0.244,
		);

		// J: Male - 52, Female - 56.2
		// P: Male - 48, Female - 43.8
		const [judging, perceiving] = this._getMyersBriggsValue(
			genderCis === "m" ? 0.52 : 0.562,
		);

		return {
			extraversion,
			intraversion,
			sensing,
			intuition,
			thinking,
			feeling,
			judging,
			perceiving,
		};
	}

	private _getAlignNums() {
		// https://math.stackexchange.com/questions/1276206/method-of-generating-random-numbers-that-sum-to-100-is-this-truly-random
		const num1 = faker.number.int({
			min: 0,
			max: MAX_PERSON_RATING,
		});
		const num2 = faker.number.int({
			min: 0,
			max: MAX_PERSON_RATING,
		});
		const num3 = faker.number.int({
			min: 0,
			max: MAX_PERSON_RATING,
		});
		const numArray = [num1, num2, num3].sort((a, b) => a - b);

		const trait1 = numArray[1] - numArray[0];
		const trait2 = numArray[2] - numArray[1];
		const trait3 = 100 + numArray[0] - numArray[2];

		return [trait1, trait2, trait3];
	}

	private _getAlignment() {
		const [chaotic, neutralOrder, lawful] = this._getAlignNums();
		const [good, neutralMorality, evil] = this._getAlignNums();

		return {
			chaotic,
			neutralOrder,
			lawful,
			good,
			neutralMorality,
			evil,
		};
	}

	public getRandomCityId = () => {
		return "new-york";
		// return faker.helpers.arrayElement(cities).id;
	};

	// private _getRandomEyeColor() {
	//   return faker.helpers.arrayElement(
	//     Object.keys(ZEyeColorEnum.Values)
	//   ) as TEyeColorEnum;
	// }

	private _getRandomNickname() {
		return {
			dateOrigin: "2020-01-01",
			nickname: `The ${capitalize(faker.word.noun())}`,
			popularity: this._getRandomNumberBetween({
				min: MIN_PERSON_RATING,
				max: MAX_PERSON_RATING,
			}),
		};
	}

	private _getRandomNumberBetween({ min, max }: { min: number; max: number }) {
		return faker.number.int({
			min,
			max,
		});
	}

	//   private _getRandomRace() {
	//     return faker.helpers.arrayElement(
	//       Object.keys(ZRaceEnum.Values)
	//     ) as TRaceEnum;
	//   }

	private _getRandomTeamNickname() {
		return `${capitalize(faker.animal.type())}s`;
	}

	private _getRandomWeightedChoice<T>(data: [T, number][]): T {
		let total = 0;
		for (let i = 0; i < data.length; ++i) {
			total += data[i][1];
		}
		const threshold =
			faker.number.float({
				min: 0,
				max: 1,
			}) * total;

		total = 0;
		for (let i = 0; i < data.length - 1; ++i) {
			total += data[i][1];

			if (total >= threshold) {
				return data[i][0];
			}
		}

		return data[data.length - 1][0];
	}

	public createPerson() {
		const currentYear = dayjs().year();
		const minBirthYear = currentYear - 40;
		const maxBirthYear = currentYear - 20;

		const charisma = this._getRandomNumberBetween({
			min: MIN_PERSON_RATING,
			max: MAX_PERSON_RATING,
		});
		const constitution = this._getRandomNumberBetween({
			min: MIN_PERSON_RATING,
			max: MAX_PERSON_RATING,
		});
		const dexterity = this._getRandomNumberBetween({
			min: MIN_PERSON_RATING,
			max: MAX_PERSON_RATING,
		});
		const handedness = this._getRandomWeightedChoice([
			[HANDEDNESS[0], 0.15],
			[HANDEDNESS[1], 0.8],
			[HANDEDNESS[2], 0.05],
		]);
		const height = this._getRandomNumberBetween({
			min: 60,
			max: 80,
		});
		const intelligence = this._getRandomNumberBetween({
			min: MIN_PERSON_RATING,
			max: MAX_PERSON_RATING,
		});
		const loyalty = this._getRandomNumberBetween({
			min: MIN_PERSON_RATING,
			max: MAX_PERSON_RATING,
		});
		const strength = this._getRandomNumberBetween({
			min: MIN_PERSON_RATING,
			max: MAX_PERSON_RATING,
		});
		const weight = this._getRandomNumberBetween({
			min: 150,
			max: 300,
		});
		const wisdom = this._getRandomNumberBetween({
			min: MIN_PERSON_RATING,
			max: MAX_PERSON_RATING,
		});
		const workEthic = this._getRandomNumberBetween({
			min: MIN_PERSON_RATING,
			max: MAX_PERSON_RATING,
		});
		const isGenderCisMale = faker.datatype.boolean();
		const alignment = this._getAlignment();

		const ratings = {
			alignment,
			mental: {
				charisma,
				constitution,
				intelligence,
				loyalty,
				wisdom,
				workEthic,
			},
			myersBriggs: this._getMyersBriggs(isGenderCisMale ? "m" : "f"),
			physical: {
				dexterity,
				height,
				strength,
				weight,
			},
		};

		const languagesSpoken = ["english"];
		const middleNames = [
			faker.person.firstName(isGenderCisMale ? "male" : "female"),
		];
		const nicknames = [this._getRandomNickname()];

		const firstName = faker.person.firstName(
			isGenderCisMale ? "male" : "female",
		);
		const lastName = faker.person.lastName();
		const birthdate = dayjs(
			faker.date.birthdate({
				min: minBirthYear,
				max: maxBirthYear,
			}),
		).format(DATE_FORMAT);
		const birthplaceId = this.getRandomCityId();
		// const eyeColor = this._getRandomEyeColor();
		const genderCis = (isGenderCisMale ? "m" : "f") as TEGenderCis;
		const genderIdentity = genderCis as TEGenderIdentity;
		// const race = this._getRandomRace();

		// const face = generate(
		//   {},
		//   {
		//     gender: genderCis === "m" ? "male" : "female",
		//     race: race === "hispanic" || race === "other" ? "brown" : race,
		//   }
		// );

		// const body = {
		//   arms: {
		//     left: MAX_PERSON_BODY,
		//     right: MAX_PERSON_BODY,
		//   },
		//   brain: MAX_PERSON_BODY,
		//   calves: {
		//     left: MAX_PERSON_BODY,
		//     right: MAX_PERSON_BODY,
		//   },
		//   ears: {
		//     left: MAX_PERSON_BODY,
		//     right: MAX_PERSON_BODY,
		//   },
		//   elbows: {
		//     left: MAX_PERSON_BODY,
		//     right: MAX_PERSON_BODY,
		//   },
		//   eyes: {
		//     left: MAX_PERSON_BODY,
		//     right: MAX_PERSON_BODY,
		//   },
		//   fingers: {
		//     left: {
		//       index: MAX_PERSON_BODY,
		//       middle: MAX_PERSON_BODY,
		//       ring: MAX_PERSON_BODY,
		//       pinky: MAX_PERSON_BODY,
		//       thumb: MAX_PERSON_BODY,
		//     },
		//     right: {
		//       index: MAX_PERSON_BODY,
		//       middle: MAX_PERSON_BODY,
		//       ring: MAX_PERSON_BODY,
		//       pinky: MAX_PERSON_BODY,
		//       thumb: MAX_PERSON_BODY,
		//     },
		//   },
		//   hamstrings: {
		//     left: MAX_PERSON_BODY,
		//     right: MAX_PERSON_BODY,
		//   },
		//   hands: {
		//     left: MAX_PERSON_BODY,
		//     right: MAX_PERSON_BODY,
		//   },
		//   head: MAX_PERSON_BODY,
		//   heart: MAX_PERSON_BODY,
		//   intestines: MAX_PERSON_BODY,
		//   kidneys: {
		//     left: MAX_PERSON_BODY,
		//     right: MAX_PERSON_BODY,
		//   },
		//   liver: MAX_PERSON_BODY,
		//   lungs: {
		//     left: MAX_PERSON_BODY,
		//     right: MAX_PERSON_BODY,
		//   },
		//   nose: MAX_PERSON_BODY,
		//   quads: {
		//     left: MAX_PERSON_BODY,
		//     right: MAX_PERSON_BODY,
		//   },
		//   reproductive: MAX_PERSON_BODY,
		//   shoulders: {
		//     left: MAX_PERSON_BODY,
		//     right: MAX_PERSON_BODY,
		//   },
		//   spleen: MAX_PERSON_BODY,
		//   stomach: MAX_PERSON_BODY,
		//   teeth: MAX_PERSON_BODY,
		//   toes: {
		//     left: {
		//       big: MAX_PERSON_BODY,
		//       index: MAX_PERSON_BODY,
		//       middle: MAX_PERSON_BODY,
		//       ring: MAX_PERSON_BODY,
		//       pinky: MAX_PERSON_BODY,
		//     },
		//     right: {
		//       big: MAX_PERSON_BODY,
		//       index: MAX_PERSON_BODY,
		//       middle: MAX_PERSON_BODY,
		//       ring: MAX_PERSON_BODY,
		//       pinky: MAX_PERSON_BODY,
		//     },
		//   },
		//   tongue: MAX_PERSON_BODY,
		// };

		// const isColorBlind = 0;

		// const favoriteFood = faker.helpers.arrayElement([
		//   "pizza",
		//   "tacos",
		//   "sushi",
		// ]);

		// const isBlind = 0;
		// const isDeaf = 0;

		const slug = kebabCase(`${firstName} ${lastName}`);

		return {
			birthdate,
			birthplaceId,
			// body,
			//   eyeColor,
			//   face,
			//   favoriteFood,
			firstName,
			genderCis,
			genderIdentity,
			handedness,
			height,
			id: slug,
			injuryProneness: this._getRandomNumberBetween({
				min: MIN_PERSON_RATING,
				max: MAX_PERSON_RATING,
			}),
			//   isBlind,
			//   isDeaf,
			//   isColorBlind,
			lastName,
			languagesSpoken,
			// legedness,
			middleNames,
			nicknames,
			//   race,
			ratings,
			slug,
			weight,
		};
	}

	public createPlayer({ personId }: { personId: string }) {
		return {
			personId,
			ratings: this.createPlayerRatings(),
		};
	}

	public createPlayerRatings() {
		return {
			batting: {
				avoidKs: this._getRandomNumberBetween({
					min: 1,
					max: 100,
				}),
				contact: this._getRandomNumberBetween({
					min: 1,
					max: 100,
				}),
				eye: this._getRandomNumberBetween({
					min: 1,
					max: 100,
				}),
				gap: this._getRandomNumberBetween({
					min: 1,
					max: 100,
				}),
				power: this._getRandomNumberBetween({
					min: 1,
					max: 100,
				}),
			},
			pitching: {
				control: this._getRandomNumberBetween({
					min: 1,
					max: 100,
				}),
				movement: this._getRandomNumberBetween({
					min: 1,
					max: 100,
				}),
				stuff: this._getRandomNumberBetween({
					min: 1,
					max: 100,
				}),
				pitches: {
					changeup: this._getRandomNumberBetween({
						min: 1,
						max: 100,
					}),
					circlechange: this._getRandomNumberBetween({
						min: 1,
						max: 100,
					}),
					cutter: this._getRandomNumberBetween({
						min: 1,
						max: 100,
					}),
					curveball: this._getRandomNumberBetween({
						min: 1,
						max: 100,
					}),
					fastball: this._getRandomNumberBetween({
						min: 1,
						max: 100,
					}),
					forkball: this._getRandomNumberBetween({
						min: 1,
						max: 100,
					}),
					knuckleball: this._getRandomNumberBetween({
						min: 1,
						max: 100,
					}),
					knucklecurve: this._getRandomNumberBetween({
						min: 1,
						max: 100,
					}),
					screwball: this._getRandomNumberBetween({
						min: 1,
						max: 100,
					}),
					sinker: this._getRandomNumberBetween({
						min: 1,
						max: 100,
					}),
					slider: this._getRandomNumberBetween({
						min: 1,
						max: 100,
					}),
					splitter: this._getRandomNumberBetween({
						min: 1,
						max: 100,
					}),
				},
			},
		};
	}

	public createTeam({ cityId, venueId }: { cityId: string; venueId: string }) {
		const nickname = this._getRandomTeamNickname();
		const slug = kebabCase(`${cityId} ${nickname}`);

		return {
			cityId,
			colors: {
				primary: faker.internet.color(),
				secondary: faker.internet.color(),
				accent: faker.internet.color(),
			},
			id: slug,
			nickname,
			slug,
			venueId,
		};
	}

	public createVenue({ cityId }: { cityId?: string } = {}) {
		const _cityId = cityId || this.getRandomCityId();
		const name = `${faker.company.name()} ${
			faker.datatype.boolean() ? "Arena" : "Stadium"
		}`;
		const slug = kebabCase(`${_cityId} ${name}`);
		return {
			capacity: this._getRandomNumberBetween({
				min: 2000,
				max: 10000,
			}),
			cityId: _cityId,
			id: slug,
			name,
			slug,
		};
	}
}

export default FakeClient;
