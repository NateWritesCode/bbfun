server_dir=$(pwd)/apps/server
training_dir=$(pwd)/apps/training
export NUM_EPOCHS=25

cd $server_dir;

pm2 stop pm2.config.cjs;
pm2 start pm2.config.cjs;

cd $training_dir;
bun run src/pitch-picker.ts;
bun run src/pitch-locater.ts;
bun run src/pitch-outcome.ts;
bun run src/pitch-in-play.ts;

cd $server_dir;
pm2 stop pm2.config.cjs;