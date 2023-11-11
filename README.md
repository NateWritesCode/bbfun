# Baseball Fun  (bbfun, for short)

## About

Baseball Fun is an open-source baseball simulator.

🚧 This simulator is under active development 🚧

## Goals currently working on (in order)

- Simulate a simplistic baseball game (`packages/utils/src/entities/game-sim/GameSim.ts` is where this lives)
- Save the simulated game results 
- Build a view to show the statistics/logs of a game
- Train data from the 2011 MLB season to build models for simulation (2011, because Cardinals!)
- Website to simulate 2011 MLB season and display league leaders, standings, etc.

## How to run

- Install packages with `bun install` at the root folder
- In VSCode, run tasks by pressing `Ctrl+Shift+P` and typing `Tasks: Run Task`
- Run task `dev-server` to start the dev server

## General Project goals

- Use the [Bun runtime](https://bun.sh/) because it's awesome.
- Use Typescript/Javascript as much as possible
- Use R language for any data science/analysis not possible in the Javascript ecosystem
- Use a Bun workspace

## Personal goals

- Learn machine learning to build models for simulation
- Make fully typed (no Typescript `any`!)

## Libraries currently used

- [biomejs](https://biomejs.dev) for linting and formatting code
- [Bun runtime](https://bun.sh/) to run Typescript code
- [csv-string](https://github.com/Inist-CNRS/node-csv-string) to parse CSV files
- [dayjs](https://github.com/Inist-CNRS/node-csv-string) to parse CSV files
- [faker](https://fakerjs.dev/) to generate fake data
- [MessagePack](https://msgpack.org/index.html) to serialize data
- [lodash](https://lodash.com/) for utility functions
- [TensorFlowJS](https://www.tensorflow.org/js) for machine learning
- [zod](https://zod.dev/) for validating data


## Data used

- [baseballr](https://billpetti.github.io/baseballr/) for historical ID player mappings
- [Out of the Park Baseball](https://www.ootpdevelopments.com/out-of-the-park-baseball-home/) for player ratings
- [PitchFx](https://baseballsavant.mlb.com/statcast_search) for pitch data

## Current Bun limitations

- Haven't been able to find a Node.js machine learning library that works in Bun. I'm currently using TensorFlowJS, but it's not ideal. Training is slow and need to save/access the models via upload and download the models to/from the server.

## Feedback

The main reason I'm creating this simulator is to learn.  If you have any feedback, comments, or questions please reach out.  I'm open to any suggestions and ideas.

Click the `Discussions` at the top of this repo to reach out.




