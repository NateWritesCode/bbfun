import { createLogger } from "@lvksh/logger";
import chalk from "chalk";

export default createLogger(
   {
      danger: {
         label: chalk.redBright`[DANGER]`,
         newLine: "",
         newLineEnd: "",
      },
      info: {
         label: chalk.blueBright`[INFO]`,
         newLine: "",
         newLineEnd: "",
      },
      inputData: {
         label: chalk.blueBright`[INPUT DATA]`,
         newLine: "",
         newLineEnd: "",
      },
      serverError: {
         label: chalk.redBright`[SERVER ERROR]`,
         newLine: "",
         newLineEnd: "",
      },
   },
   { padding: "PREPEND" },
   console.log,
);
