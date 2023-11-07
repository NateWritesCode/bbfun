training_dir=$(pwd)/apps/training


cd $training_dir;
bun run src/pitch-picker.ts;
bun run src/pitch-locater.ts;
bun run src/pitch-outcome.ts;
bun run src/pitch-in-play.ts;