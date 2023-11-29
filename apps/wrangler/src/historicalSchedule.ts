import { PATH_INPUT_ROOT, PATH_OUTPUT_ROOT } from "@bbfun/utils";
import { createFolderPathIfNeeded } from "@bbfun/utils";

const FIRST_YEAR = 1877;
const LAST_YEAR = 2023;

const PATH_INPUT = `${PATH_INPUT_ROOT}/historical/schedule`;
const PATH_OUTPUT = `${PATH_OUTPUT_ROOT}/historical/schedule`;

createFolderPathIfNeeded(PATH_OUTPUT);

let iterYear = FIRST_YEAR;

// 1          Date in the form "yyyymmdd"
// 2          Number of game:
//                   "0" - a single game
//                   "1" - the first game of a double header including separate admission doubleheaders
//                   "2" - the second game of a double header including separate admission doubleheaders
// 3          Day of week("Sun","Mon","Tue","Wed","Thu","Fri","Sat")
// 4-5        Visiting team and league
// 6          Season game number for visiting team
// 7-8        Home team and league
// 9          Season game number for home team
// 10         Day (D), Night (N), Afternoon (A), Evening (E for twinight)
// 11         Postponement/cancellation indicator (more detail below)
// 12         Date of makeup if played in the form "yyyymmdd" (more detail below)

while (iterYear <= LAST_YEAR) {
   let filename = `${iterYear.toString()}SKED`;

   const is2020 = iterYear === 2020;
   if (is2020) {
      filename = `${iterYear.toString()}ORIG`;
   }

   const filepath = `${PATH_INPUT}/${filename}.TXT`;
   const foo = Bun.file(filepath);
   const text = await foo.text();
   const lines = text.trim().split("\n");
   const holder = lines.map((line) => {
      const [
         date,
         numOfGame,
         dayOfWeek,
         visitingTeamId,
         visitingLeagueId,
         visitingGameNumber,
         homeTeamId,
         homeLeagueId,
         homeGameNumber,
         timeOfDay,
         scheduleChangeReason,
         dateOfMakeup,
      ] = line
         .split(",")
         .map((x) => x.trim())
         .map((x) => x.replace(/"/g, ""));

      return {
         date: formatDate(date),
         homeGameNumber: parseInt(homeGameNumber),
         homeTeamId,
         homeLeagueId,
         numOfGame: parseInt(numOfGame),
         visitingGameNumber: parseInt(visitingGameNumber),
         visitingTeamId,
         visitingLeagueId,
      };
   });

   createFolderPathIfNeeded(PATH_OUTPUT);
   await Bun.write(
      `${PATH_OUTPUT}/${iterYear}.json`,
      JSON.stringify(holder, null, 2),
   );

   iterYear += 1;
}

function formatDate(dateString: string) {
   const year = dateString.slice(0, 4);
   const month = dateString.slice(4, 6);
   const day = dateString.slice(6, 8);
   return `${year}-${month}-${day}`;
}
