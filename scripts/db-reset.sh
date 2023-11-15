cd packages/data/src/db;

rm -rf ./migrations && rm db.sqlite && touch db.sqlite && bunx drizzle-kit generate:sqlite;   