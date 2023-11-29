import { ZodTypeAny } from "zod";

const getJsonData = <T>({
   path,
   zodParser,
}: { path: string; zodParser: ZodTypeAny }): T => {
   const data = require(path);

   return zodParser.parse(data);
};

export default getJsonData;
