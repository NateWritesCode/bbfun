const rootPath = import.meta.dir.split("utils")[0];
// resolves to /ROOT/bb-fun/packages/
const appPath = `${rootPath.split("packages")[0]}apps/`;
// resolves to /ROOT/bb-fun/apps/

export const PATH_INPUT_ROOT = `${rootPath}data/src/data/input`;
export const PATH_OUTPUT_ROOT = `${rootPath}data/src/data/output`;
export const PATH_STORE_ROOT = `${rootPath}data/src/data/store`;
export const PATH_MODEL_ROOT = `${appPath}server/src/models`;
