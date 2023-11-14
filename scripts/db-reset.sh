cd packages/data/src/db;

sudo rm -rf ./migrations && bunx drizzle-kit generate:sqlite;   