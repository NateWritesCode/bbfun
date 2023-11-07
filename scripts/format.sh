initial_dir=$(pwd)

# Apps

cd apps/server; bunx @biomejs/biome format --write ./src
cd $initial_dir
cd apps/training; bunx @biomejs/biome format --write ./src
cd $initial_dir
cd apps/webapp; bunx @biomejs/biome format --write ./src
cd $initial_dir
cd apps/wrangler; bunx @biomejs/biome format --write ./src

# Packages

cd $initial_dir
cd packages/data; bunx @biomejs/biome format --write ./src
cd $initial_dir
cd packages/utils; bunx @biomejs/biome format --write ./src