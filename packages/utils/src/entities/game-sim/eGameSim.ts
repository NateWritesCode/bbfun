import {
   GameSimEventStore,
   GameSimLog,
   GameSimPlayerState,
   GameSimTeamState,
   ModelClient,
   TGamePark,
   TInputGameSimHandleRun,
   TInputGameSimHandleRunnersAdvanceXBases,
   ZInputGameSimHandleRun,
   ZInputGameSimHandleRunnersAdvanceXBases,
} from "@bbfun/utils";
import {
   OGameSimObserver,
   TConstructorGameSim,
   TGameSimEvent,
   TGameSimPlayerStates,
   TGameSimTeamStates,
   TGameTeam,
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
   numTeamDefense: 0 | 1;
   modelClient: ModelClient;
   numTeamOffense: 0 | 1;
   inning: 1;
   isNeutralVenue: boolean;
   isTopHalfInning: boolean;
   numInningsInGame = 9;
   observers: OGameSimObserver[];
   outs: number;
   park: TGamePark;
   playerStates: TGameSimPlayerStates = {};
   results: {
      statsBattingPlayer: { runs: number; id: string; teamId: string }[];
      statsBattingTeam: { runs: number; id: string }[];
      statsPitchingPlayer: { runs: number; id: string; teamId: string }[];
      statsPitchingTeam: { runs: number; id: string }[];
   } = {
      statsBattingPlayer: [],
      statsBattingTeam: [],
      statsPitchingPlayer: [],
      statsPitchingTeam: [],
   };

   strikes: number;
   teams: [TGameTeam, TGameTeam];
   teamStates: TGameSimTeamStates = {};

   // Offense and Defense Player States

   // Offense
   playerRunner1: GameSimPlayerState | null;
   playerRunner2: GameSimPlayerState | null;
   playerRunner3: GameSimPlayerState | null;

   // Defense
   // defense: TDefense = {};

   constructor(input: TConstructorGameSim) {
      ZConstructorGameSim.parse(input);

      this.modelClient = input.modelClient;
      this.teams = input.teams;
      this.park = input.park;

      // Defaults
      this.balls = 0;
      this.inning = 1;
      this.isNeutralVenue = false;
      this.isTopHalfInning = true;
      this.observers = [];
      this.outs = 0;
      this.playerRunner1 = null;
      this.playerRunner2 = null;
      this.playerRunner3 = null;
      this.strikes = 0;
      this.numTeamOffense = 1;
      this.numTeamDefense = 0;

      // Manipulation
      for (const team of this.teams) {
         const teamState = new GameSimTeamState({
            id: team.id,
            name: team.name,
            nickname: team.nickname,
            players: team.players.map((player) => {
               const playerState = new GameSimPlayerState({
                  firstName: player.firstName,
                  id: player.id,
                  lastName: player.lastName,
                  position: player.position,
                  ratings: player.ratings,
                  teamId: team.id,
               });

               this.playerStates[playerState.id] = playerState;
               this.observers.push(playerState);

               return playerState;
            }),
         });
         this.teamStates[team.id] = teamState;
         this.observers.push(teamState);
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
      const team0Runs = this.teamStates[team0.id].statistics.batting.runs;
      const team1Runs = this.teamStates[team1.id].statistics.batting.runs;

      if (this.inning > this.numInningsInGame && team0Runs !== team1Runs) {
         return true;
      }

      return false;
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
               teamIndex: this.numTeamOffense,
            })
         ];
      teamStateOffense.advanceLineupIndex();

      this.balls = 0;
      this.strikes = 0;
   };

   private _endHalfInning = () => {
      //Swap offense/defense team with the Bitwise XOR Operator: https://dmitripavlutin.com/swap-variables-javascript/#4-bitwise-xor-operator
      this.numTeamOffense = (this.numTeamOffense ^ this.numTeamDefense) as
         | 0
         | 1;
      this.numTeamDefense = (this.numTeamOffense ^ this.numTeamDefense) as
         | 0
         | 1;
      this.numTeamOffense = (this.numTeamOffense ^ this.numTeamDefense) as
         | 0
         | 1;

      const isBottomHalfOfInning = !this.isTopHalfInning;

      if (isBottomHalfOfInning) {
         this.inning++;
      }

      this.isTopHalfInning = !this.isTopHalfInning;

      this.outs = 0;
      this.playerRunner1 = null;
      this.playerRunner2 = null;
      this.playerRunner3 = null;
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

   private _getTeamDefense = () => {
      const teamDefense = this.teamStates[this.teams[this.numTeamDefense].id];
      return teamDefense;
   };

   private _getTeamOffense = () => {
      const teamOffense = this.teamStates[this.teams[this.numTeamOffense].id];
      return teamOffense;
   };

   _simulateAtBat = () => {
      this.notifyObservers({
         gameEvent: "atBatStart",
      });

      let isAtBatOver = false;

      while (!isAtBatOver) {
         const _isAtBatOver = this._simulatePitch();
         isAtBatOver = _isAtBatOver;
      }

      this._endAtBat();

      this.notifyObservers({
         gameEvent: "atBatEnd",
      });
   };

   _handleRunnerAdvanceAutomatic = () => {
      const playerRunner1Current = this.playerRunner1;
      const playerRunner2Current = this.playerRunner2;
      const playerRunner3Current = this.playerRunner3;

      if (
         playerRunner1Current &&
         playerRunner2Current &&
         playerRunner3Current
      ) {
         this.playerRunner3 = playerRunner2Current;
         this.playerRunner2 = playerRunner1Current;
         this._handleRun({
            playerRunner: playerRunner3Current,
         });
         // Bases loaded
      } else if (playerRunner1Current && playerRunner2Current) {
         // Runners on first and second
         this.playerRunner3 = playerRunner2Current;
         this.playerRunner2 = playerRunner1Current;
      } else if (playerRunner1Current) {
         this.playerRunner2 = playerRunner1Current;
      }
   };

   _handleRunnerAdvanceAutomaticIncludingHitter = () => {
      this._handleRunnerAdvanceAutomatic();

      this.playerRunner1 = this._getCurrentHitter({
         teamIndex: this.numTeamOffense,
      });
   };

   _handleOut = () => {
      const playerHitter = this._getCurrentHitter({
         teamIndex: this.numTeamOffense,
      });
      const playerPitcher = this._getCurrentPitcher({
         teamIndex: this.numTeamDefense,
      });
      const teamDefense = this._getTeamDefense();
      const teamOffense = this._getTeamOffense();
      const playerRunner1 = this.playerRunner1;
      const playerRunner2 = this.playerRunner2;
      const playerRunner3 = this.playerRunner3;

      this.outs++;

      this.notifyObservers({
         gameEvent: "out",
         data: {
            playerHitter,
            playerPitcher,
            teamDefense,
            teamOffense,
            playerRunner1,
            playerRunner2,
            playerRunner3,
         },
      });
   };

   _handleRunnersAdvanceXBases = (
      input: TInputGameSimHandleRunnersAdvanceXBases,
   ) => {
      const { numBases } = ZInputGameSimHandleRunnersAdvanceXBases.parse(input);

      const playerRunner1Current = this.playerRunner1;
      const playerRunner2Current = this.playerRunner2;
      const playerRunner3Current = this.playerRunner3;

      switch (numBases) {
         case 1: {
            if (playerRunner3Current) {
               this._handleRun({
                  playerRunner: playerRunner3Current,
               });
            }

            if (playerRunner2Current) {
               this.playerRunner3 = playerRunner2Current;
            }

            if (playerRunner1Current) {
               this.playerRunner2 = playerRunner1Current;
            }

            break;
         }
         case 2: {
            if (playerRunner3Current) {
               this._handleRun({
                  playerRunner: playerRunner3Current,
               });
            }

            if (playerRunner2Current) {
               this._handleRun({
                  playerRunner: playerRunner2Current,
               });
            }

            if (playerRunner1Current) {
               this.playerRunner3 = playerRunner1Current;
            }

            break;
         }
         case 3: {
            if (playerRunner3Current) {
               this._handleRun({
                  playerRunner: playerRunner3Current,
               });
            }

            if (playerRunner2Current) {
               this._handleRun({
                  playerRunner: playerRunner2Current,
               });
            }

            if (playerRunner1Current) {
               this._handleRun({
                  playerRunner: playerRunner1Current,
               });
            }

            break;
         }
         default: {
            const exhaustiveCheck: never = numBases;
            throw new Error(exhaustiveCheck);
         }
      }
   };

   _handleRun = (input: TInputGameSimHandleRun) => {
      const parsedInput = ZInputGameSimHandleRun.parse(input);

      const playerHitter = this._getCurrentHitter({
         teamIndex: this.numTeamOffense,
      });
      const playerPitcher = this._getCurrentPitcher({
         teamIndex: this.numTeamDefense,
      });
      const teamDefense = this._getTeamDefense();
      const teamOffense = this._getTeamOffense();

      this.notifyObservers({
         gameEvent: "run",
         data: {
            playerHitter,
            playerPitcher,
            playerRunner: parsedInput.playerRunner,
            teamDefense,
            teamOffense,
         },
      });
   };

   _handleSingle = () => {
      const playerHitter = this._getCurrentHitter({
         teamIndex: this.numTeamOffense,
      });
      const playerPitcher = this._getCurrentPitcher({
         teamIndex: this.numTeamDefense,
      });
      const playerRunner1 = this.playerRunner1;
      const playerRunner2 = this.playerRunner2;
      const playerRunner3 = this.playerRunner3;
      const teamDefense = this._getTeamDefense();
      const teamOffense = this._getTeamOffense();
      this._handleRunnersAdvanceXBases({
         numBases: 1,
      });

      this.playerRunner1 = playerHitter;

      this.notifyObservers({
         data: {
            playerHitter,
            playerPitcher,
            teamDefense,
            teamOffense,
            playerRunner1,
            playerRunner2,
            playerRunner3,
         },
         gameEvent: "single",
      });
   };

   _handleDouble = () => {
      const playerHitter = this._getCurrentHitter({
         teamIndex: this.numTeamOffense,
      });
      const playerPitcher = this._getCurrentPitcher({
         teamIndex: this.numTeamDefense,
      });
      const playerRunner1 = this.playerRunner1;
      const playerRunner2 = this.playerRunner2;
      const playerRunner3 = this.playerRunner3;
      const teamDefense = this._getTeamDefense();
      const teamOffense = this._getTeamOffense();
      this._handleRunnersAdvanceXBases({
         numBases: 2,
      });

      this.playerRunner1 = playerHitter;

      this.notifyObservers({
         data: {
            playerHitter,
            playerPitcher,
            teamDefense,
            teamOffense,
            playerRunner1,
            playerRunner2,
            playerRunner3,
         },
         gameEvent: "double",
      });
   };

   _handleTriple = () => {
      const playerHitter = this._getCurrentHitter({
         teamIndex: this.numTeamOffense,
      });
      const playerPitcher = this._getCurrentPitcher({
         teamIndex: this.numTeamDefense,
      });
      const playerRunner1 = this.playerRunner1;
      const playerRunner2 = this.playerRunner2;
      const playerRunner3 = this.playerRunner3;
      const teamDefense = this._getTeamDefense();
      const teamOffense = this._getTeamOffense();
      this._handleRunnersAdvanceXBases({
         numBases: 3,
      });

      this.playerRunner1 = playerHitter;

      this.notifyObservers({
         data: {
            playerHitter,
            playerPitcher,
            teamDefense,
            teamOffense,
            playerRunner1,
            playerRunner2,
            playerRunner3,
         },
         gameEvent: "triple",
      });
   };

   _handleHomeRun = () => {
      const playerHitter = this._getCurrentHitter({
         teamIndex: this.numTeamOffense,
      });
      const playerPitcher = this._getCurrentPitcher({
         teamIndex: this.numTeamDefense,
      });
      const playerRunner1 = this.playerRunner1;
      const playerRunner2 = this.playerRunner2;
      const playerRunner3 = this.playerRunner3;
      const teamDefense = this._getTeamDefense();
      const teamOffense = this._getTeamOffense();
      this._handleRunnersAdvanceXBases({
         numBases: 3,
      });

      this.playerRunner1 = playerHitter;

      this.notifyObservers({
         data: {
            playerHitter,
            playerPitcher,
            teamDefense,
            teamOffense,
            playerRunner1,
            playerRunner2,
            playerRunner3,
         },
         gameEvent: "homeRun",
      });

      this._handleRun({
         playerRunner: playerHitter,
      });
   };

   _handleHitByPitch = () => {
      this._handleRunnerAdvanceAutomaticIncludingHitter();
   };

   _handleStrikeout = () => {
      const playerHitter = this._getCurrentHitter({
         teamIndex: this.numTeamOffense,
      });
      const playerPitcher = this._getCurrentPitcher({
         teamIndex: this.numTeamDefense,
      });
      const teamDefense = this._getTeamDefense();
      const teamOffense = this._getTeamOffense();
      this.notifyObservers({
         gameEvent: "strikeout",
         data: {
            playerHitter,
            playerPitcher,
            teamDefense,
            teamOffense,
         },
      });

      this.outs++;
   };

   _handleWalk = () => {
      const playerHitter = this._getCurrentHitter({
         teamIndex: this.numTeamOffense,
      });
      const playerPitcher = this._getCurrentPitcher({
         teamIndex: this.numTeamDefense,
      });
      const teamDefense = this._getTeamDefense();
      const teamOffense = this._getTeamOffense();
      this.notifyObservers({
         gameEvent: "walk",
         data: {
            playerHitter,
            playerPitcher,
            teamDefense,
            teamOffense,
         },
      });
      this._handleRunnerAdvanceAutomaticIncludingHitter();
   };

   private _simulateHalfInning = () => {
      const teamDefense = this._getTeamDefense();
      const teamOffense = this._getTeamOffense();

      this.notifyObservers({
         data: {
            teamDefense,
            teamOffense,
         },
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
            playerRunner1: this.playerRunner1,
            playerRunner2: this.playerRunner2,
            playerRunner3: this.playerRunner3,
         },
         gameEvent: "halfInningEnd",
      });
   };

   private _simulatePitch = () => {
      let isAtBatOver = false;
      const pitcher = this._getCurrentPitcher({
         teamIndex: this.numTeamDefense,
      });
      const hitter = this._getCurrentHitter({
         teamIndex: this.numTeamOffense,
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
         pitchNumber: pitcher.statistics.pitching.pitchesThrown,
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

      this.notifyObservers({
         data: {
            playerHitter: hitter,
            pitchLocation,
            pitchName,
            pitchOutcome,
            playerPitcher: pitcher,
            teamDefense: this.teamStates[this.numTeamDefense],
            teamOffense: this.teamStates[this.numTeamOffense],
         },
         gameEvent: "pitch",
      });

      switch (pitchOutcome) {
         case "B": {
            this.balls++;

            if (this.balls === 4) {
               this._handleWalk();
               isAtBatOver = true;
            }

            break;
         }
         case "S": {
            this.strikes++;

            if (this.strikes === 3) {
               this._handleStrikeout();

               isAtBatOver = true;
            }

            break;
         }
         case "X": {
            const eventsWeCanHandleNow = [
               "double",
               "doublePlay",
               "fieldOut",
               "forceOut",
               "groundedIntoDoublePlay",
               "hitByPitch",
               "homeRun",
               "otherOut",
               "single",
               "triple",
            ] as const;

            let pitchInPlayEvent: typeof eventsWeCanHandleNow[number] | null =
               null;

            while (!pitchInPlayEvent) {
               const _pitchInPlayEvent = this.modelClient.predictPitchInPlay({
                  ...pitchLocation,
                  contact: hitter.ratings.batting.contact,
                  gap: hitter.ratings.batting.gap,
                  power: hitter.ratings.batting.power,
               });

               if (
                  eventsWeCanHandleNow.includes(
                     _pitchInPlayEvent as typeof eventsWeCanHandleNow[number],
                  )
               ) {
                  pitchInPlayEvent =
                     _pitchInPlayEvent as typeof eventsWeCanHandleNow[number];
               }
            }

            if (!pitchInPlayEvent) {
               throw new Error("pitchInPlayEvent is null");
            }

            switch (pitchInPlayEvent) {
               case "double": {
                  this._handleDouble();
                  break;
               }

               case "forceOut":
               case "fieldOut":
               case "groundedIntoDoublePlay":
               case "otherOut":
               case "doublePlay": {
                  this._handleOut();
                  break;
               }

               case "hitByPitch": {
                  this._handleHitByPitch();
                  break;
               }
               case "homeRun": {
                  this._handleHomeRun();
                  break;
               }
               case "single": {
                  this._handleSingle();
                  break;
               }
               case "triple": {
                  this._handleTriple();
                  break;
               }

               default: {
                  const exhaustiveCheck: never = pitchInPlayEvent;
                  throw new Error(exhaustiveCheck);
               }
            }

            isAtBatOver = true;

            break;
         }
         default: {
            const exhaustiveCheck: never = pitchOutcome;
            throw new Error(exhaustiveCheck);
         }
      }

      return isAtBatOver;
   };

   public simulate() {
      this.notifyObservers({
         gameEvent: "gameStart",
      });

      let isGameOver = false;

      while (!isGameOver) {
         this._simulateHalfInning();

         const _isGameOver = this._checkIsGameOver();
         isGameOver = _isGameOver;
      }

      const playerStates = Object.values(this.playerStates);
      const teamStates = Object.values(this.teamStates);

      for (const playerState of playerStates) {
         const teamId = playerState.teamId;
         const { batting, id, pitching } = playerState.close();
         this.results.statsBattingPlayer.push({ id, teamId, ...batting });
         this.results.statsPitchingPlayer.push({ id, teamId, ...pitching });
      }

      for (const teamState of teamStates) {
         const { batting, id, pitching } = teamState.close();
         this.results.statsBattingTeam.push({ id, ...batting });
         this.results.statsPitchingTeam.push({ id, ...pitching });
      }

      this.notifyObservers({
         gameEvent: "gameEnd",
      });

      return this.results;
   }
}
