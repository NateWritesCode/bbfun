import { ZodTypeAny } from "zod";

const getJsonData = <T>({
	path,
	zodParser,
}: { path: string; zodParser: ZodTypeAny }): T => {
	const data = require(path);
	const parsedData = zodParser.parse(data);
	return parsedData;
};

export default getJsonData;
