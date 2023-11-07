import { ModelClient } from "@bbfun/utils";

export const modelClient: ModelClient = new ModelClient();

export default async () => {
	await modelClient.init();

	return {
		modelClient,
	};
};
