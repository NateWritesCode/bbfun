initial_dir=$(pwd)

# Apps

cd apps/server; bunx @biomejs/biome lint --apply ./src
cd $initial_dir
cd apps/training; bunx @biomejs/biome lint --apply ./src
cd $initial_dir
cd apps/webapp; bunx @biomejs/biome lint --apply ./src
cd $initial_dir
cd apps/wrangler; bunx @biomejs/biome lint --apply ./src

# Packages

cd $initial_dir
cd packages/data; bunx @biomejs/biome lint --apply ./src/db
cd $initial_dir
cd packages/utils; bunx @biomejs/biome lint --apply ./src