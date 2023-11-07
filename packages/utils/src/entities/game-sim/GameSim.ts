import {
	GameSimEventStore,
	GameSimLog,
	GameSimPlayerState,
	GameSimTeamState,
	ModelClient,
} from "@bbfun/utils";
import {
	OGameSimObserver,
	TConstructorGameSim,
	TGameSimEvent,
	TGameSimPlayerStates,
	TGameSimTeamStates,
	TGameTeam,
	TGameVenue,
	TInputGameSimGetCurrentHitter,
	TInputGameSimGetCurrentPitcher,
	TInputGameSimGetTeamId,
	ZConstructorGameSim,
	ZInputGameSimGetCurrentHitter,
	ZInputGameSimGetCurrentPitcher,
	ZInputGameSimGetTeamId,
	ZResponseGameSimGetCurrentHitter,
	ZResponseGameSimGetCurrentPitcher,
} from "@bbfun/utils";

export default class GameSim {
	balls: number;
	d: 0 | 1;
	modelClient: ModelClient;
	o: 0 | 1;
	inning: 1;
	isNeutralVenue: boolean;
	isTopHalfInning: boolean;
	numInningsInGame = 9;
	observers: OGameSimObserver[];
	outs: number;
	playerStates: TGameSimPlayerStates = {};
	strikes: number;
	teams: [TGameTeam, TGameTeam];
	teamStates: TGameSimTeamStates = {};
	venue: TGameVenue;

	// Offense and Defense Player States

	// Offense
	r1: GameSimPlayerState | null;
	r2: GameSimPlayerState | null;
	r3: GameSimPlayerState | null;

	// Defense
	// defense: TDefense = {};

	constructor(input: TConstructorGameSim) {
		ZConstructorGameSim.parse(input);

		this.modelClient = input.modelClient;
		this.teams = input.teams;
		this.venue = input.venue;

		// Defaults
		this.balls = 0;
		this.inning = 1;
		this.isNeutralVenue = false;
		this.isTopHalfInning = true;
		this.observers = [];
		this.outs = 0;
		this.r1 = null;
		this.r2 = null;
		this.r3 = null;
		this.strikes = 0;
		this.o = 1;
		this.d = 0;

		// Manipulation
		for (const team of this.teams) {
			const teamState = new GameSimTeamState({
				id: team.id,
				players: team.players,
			});
			this.teamStates[team.id] = teamState;
			this.observers.push(teamState);
			for (const player of team.players) {
				const playerState = new GameSimPlayerState({
					id: player.id,
					ratings: player.ratings,
				});
				this.playerStates[player.id] = playerState;
				this.observers.push(playerState);
			}
		}

		// Init other observers
		this.observers.push(
			new GameSimLog({
				id: input.id,
			}),
		);
		this.observers.push(
			new GameSimEventStore({
				id: input.id,
			}),
		);
	}

	notifyObservers = (input: TGameSimEvent) => {
		for (const observer of this.observers) {
			observer.notifyGameEvent({
				...input,
			});
		}
	};

	private _checkIsGameOver = () => {
		const team0 = this.teams[0];
		const team1 = this.teams[1];
		const team0Runs = this.teamStates[team0.id].runs;
		const team1Runs = this.teamStates[team1.id].runs;

		if (this.inning > this.numInningsInGame) {
			// if (this.inning > this.numInningsInGame && team0Runs !== team1Runs) {
			return true;
		}

		return false;
	};

	private _checkIsAtBatOver = () => {
		return true;
	};

	private _checkIsHalfInningOver = () => {
		if (this.outs === 3) {
			return true;
		}

		return false;
	};

	private _endAtBat = () => {
		const teamStateOffense =
			this.teamStates[
				this._getTeamId({
					teamIndex: this.o,
				})
			];
		teamStateOffense.advanceLineupIndex();

		this.balls = 0;
		this.strikes = 0;
	};

	private _endHalfInning = () => {
		//Swap offense/defense team with the Bitwise XOR Operator: https://dmitripavlutin.com/swap-variables-javascript/#4-bitwise-xor-operator
		this.o = (this.o ^ this.d) as 0 | 1;
		this.d = (this.o ^ this.d) as 0 | 1;
		this.o = (this.o ^ this.d) as 0 | 1;

		const isBottomHalfOfInning = !this.isTopHalfInning;

		if (isBottomHalfOfInning) {
			this.inning++;
		}

		this.isTopHalfInning = !this.isTopHalfInning;

		this.outs = 0;
		this.r1 = null;
		this.r2 = null;
		this.r3 = null;
	};

	private _getCurrentHitter = (input: TInputGameSimGetCurrentHitter) => {
		const { teamIndex } = ZInputGameSimGetCurrentHitter.parse(input);
		const teamId = this.teams[teamIndex].id;
		const currentHitterId = this.teamStates[teamId].getCurrentHitterId();
		const playerState = this.playerStates[currentHitterId];

		return ZResponseGameSimGetCurrentHitter.parse(playerState);
	};

	private _getCurrentPitcher = (input: TInputGameSimGetCurrentPitcher) => {
		const { teamIndex } = ZInputGameSimGetCurrentPitcher.parse(input);
		const teamId = this.teams[teamIndex].id;
		const currentPitcherId = this.teamStates[teamId].getPositionId({
			position: "p",
		});
		const playerState = this.playerStates[currentPitcherId];

		return ZResponseGameSimGetCurrentPitcher.parse(playerState);
	};

	private _getTeamId = (input: TInputGameSimGetTeamId) => {
		const { teamIndex } = ZInputGameSimGetTeamId.parse(input);

		return this.teams[teamIndex].id;
	};

	_simulateAtBat = () => {
		this.notifyObservers({
			gameEvent: "atBatStart",
		});

		let isAtBatOver = false;

		while (!isAtBatOver) {
			this._simulatePitch();
			this.outs++;

			const _isAtBatOver = this._checkIsAtBatOver();
			isAtBatOver = _isAtBatOver;

			// const isHomeRun = faker.datatype.boolean();

			// if (isHomeRun) {
			//   this.notifyObservers({
			//     data: {
			//       d: this._getTeamId({ teamIndex: this.d }),
			//       h: this._getCurrentHitter({ teamIndex: this.o }),
			//       o: this._getTeamId({ teamIndex: this.d }),
			//       r1: this.r1,
			//       r2: this.r2,
			//       r3: this.r3,
			//     },
			//     gameEvent: "homeRun",
			//   });
			// } else {
			//   this.notifyObservers({
			//     data: {
			//       d: this._getTeamId({ teamIndex: this.d }),
			//       h: this._getCurrentHitter({
			//         teamIndex: this.o,
			//       }),
			//       o: this._getTeamId({ teamIndex: this.d }),
			//       r1: this.r1,
			//       r2: this.r2,
			//       r3: this.r3,
			//     },
			//     gameEvent: "out",
			//   });
			//   this.outs++;
			// }

			// const _isAtBatOver = this._checkIsAtBatOver();
			// isAtBatOver = _isAtBatOver;
		}

		this._endAtBat();

		this.notifyObservers({
			gameEvent: "atBatEnd",
		});
	};

	private _simulateHalfInning = () => {
		this.notifyObservers({
			gameEvent: "halfInningStart",
		});

		let isHalfInningOver = false;

		while (!isHalfInningOver) {
			this._simulateAtBat();

			const _isHalfInningOver = this._checkIsHalfInningOver();
			isHalfInningOver = _isHalfInningOver;
		}

		this._endHalfInning();

		this.notifyObservers({
			data: {
				r1: this.r1,
				r2: this.r2,
				r3: this.r3,
			},
			gameEvent: "halfInningEnd",
		});
	};

	private _simulatePitch = () => {
		const pitcher = this._getCurrentPitcher({
			teamIndex: this.d,
		});
		const hitter = this._getCurrentHitter({
			teamIndex: this.o,
		});

		const pitchName = this.modelClient.predictPitchPicker({
			balls: this.balls,
			outs: this.outs,
			strikes: this.strikes,
			...pitcher.ratings.pitching.pitches,
		});

		const pitchLocation = this.modelClient.predictPitchLocater({
			control: pitcher.ratings.pitching.control,
			movement: pitcher.ratings.pitching.movement,
			pitchName,
			pitchNumber: 1,
			pitchRating: pitcher.ratings.pitching.pitches[pitchName],
			stuff: pitcher.ratings.pitching.stuff,
		});

		const pitchOutcome = this.modelClient.predictPitchOutcome({
			avoidKs: hitter.ratings.batting.avoidKs,
			contact: hitter.ratings.batting.contact,
			eye: hitter.ratings.batting.eye,
			gap: hitter.ratings.batting.gap,
			power: hitter.ratings.batting.power,
			...pitchLocation,
		});

		switch (pitchOutcome) {
			case "B": {
				break;
			}
			case "S": {
				break;
			}
			case "X": {
				break;
			}
			default: {
				const exhaustiveCheck: never = pitchOutcome;
				throw new Error(exhaustiveCheck);
			}
		}

		// const pitchLocation = this.modelClient.predictPitchLocater({
		// 	control: pitcher.ratings.pitching.control,
		// 	movement: pitcher.ratings.pitching.movement,
		// 	pitchName,
		// 	stuff: pitcher.ratings.pitching.stuff,
		// 	pitchRating: pitcher.ratings.pitching.pitches[pitchName],
		// 	pitchNumber: 1,
		// });
	};

	public start() {
		this.notifyObservers({
			gameEvent: "gameStart",
		});

		let isGameOver = false;

		while (!isGameOver) {
			this._simulateHalfInning();

			const _isGameOver = this._checkIsGameOver();
			isGameOver = _isGameOver;
		}

		this.notifyObservers({
			gameEvent: "gameEnd",
		});
	}
}
