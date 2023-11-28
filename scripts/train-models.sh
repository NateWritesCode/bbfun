start=$(date +%s)
training_dir=$(pwd)/apps/training
export NUM_EPOCHS=100

cd $training_dir;
bun run src/pitch-picker.ts;
bun run src/pitch-locater.ts;
bun run src/pitch-outcome.ts;
bun run src/pitch-in-play.ts;

end=$(date +%s)

runtime=$((end-start))

echo "Total execution time for traing all models: $runtime seconds"