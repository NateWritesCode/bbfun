// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
	schema: "./schema.ts",
	out: "./migrations",
	driver: "libsql",
	dbCredentials: {
		url: "file:./db.sqlite",
	},
	verbose: true,
	strict: true,
} satisfies Config;
