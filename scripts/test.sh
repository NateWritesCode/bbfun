initial_dir=$(pwd)

# Apps

cd apps/server; bun test
cd $initial_dir
cd apps/training; bun test
# cd $initial_dir
# cd apps/webapp; bun test
cd $initial_dir
cd apps/wrangler; bun test

# Packages

cd $initial_dir
cd apps/data; bun test
cd $initial_dir
cd apps/utils; bun test
