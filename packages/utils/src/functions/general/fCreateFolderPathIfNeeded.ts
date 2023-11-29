import fs from "node:fs";

export default (path: string) => {
   const isPathExists = fs.existsSync(path);
   if (!isPathExists) {
      fs.mkdirSync(path, { recursive: true });
   }
};
