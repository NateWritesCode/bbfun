import fs from "node:fs";
import { PATH_INPUT_ROOT, PATH_STORE_ROOT } from "@bbfun/utils";
import { TPersonHistorical, ZPersonHistorical } from "@bbfun/utils";
import { decode, encode } from "@msgpack/msgpack";
import CSV from "csv-string";

const FILE_KEY = "persons";
const PATH_INPUT = `${PATH_INPUT_ROOT}/historical/persons`;
const PATH_STORE = `${PATH_STORE_ROOT}/historical/persons`;

class PersonHistoricalIdHelper {
   persons: {
      [key: string]: TPersonHistorical;
   } = {};

   initFromCsv = async () => {
      const pathCsv = `${PATH_INPUT}/${FILE_KEY}.csv`;
      const file = Bun.file(pathCsv);
      const text = await file.text();
      const rows = CSV.parse(text, {
         output: "objects",
      });
      rows.shift();
      return rows.map((row) => ZPersonHistorical.parse(row));
   };

   private _initPersons = (persons: TPersonHistorical[]) => {
      this.persons = persons.reduce(
         (
            acc: {
               [key: string]: TPersonHistorical;
            },
            person,
         ) => {
            acc[person.id] = person;
            return acc;
         },
         {},
      );
   };

   private _getDuplicates = (persons: TPersonHistorical[]) => {
      const { duplicates, nonDuplicates } = persons.reduce(
         (
            acc: {
               duplicates: TPersonHistorical[];
               nonDuplicates: TPersonHistorical[];
            },
            obj,
            index,
            arr,
         ) => {
            const isDuplicate = arr.some(
               (otherObj, otherIndex) =>
                  otherIndex !== index && otherObj.id === obj.id,
            );
            if (isDuplicate) {
               acc.duplicates.push(obj);
            } else {
               acc.nonDuplicates.push(obj);
            }
            return acc;
         },
         {
            duplicates: [],
            nonDuplicates: [],
         },
      );

      return { duplicates, nonDuplicates };
   };

   init = async () => {
      const pathMsgpack = `${PATH_STORE}/${FILE_KEY}.msgpack`;

      try {
         const file = Bun.file(pathMsgpack);
         const buffer = await file.arrayBuffer();
         const persons = decode(buffer);
         console.info("LOADING HISTORICAL DATA FROM MSGPACK");

         if (persons && Array.isArray(persons)) {
            this._initPersons(
               persons.map((person) => ZPersonHistorical.parse(person)),
            );
         } else {
            throw new Error("Invalid persons data");
         }

         this._initPersons(persons as TPersonHistorical[]);
      } catch (err) {
         const _persons = await this.initFromCsv();

         let { duplicates: duplicates1, nonDuplicates: nonDuplicates1 } =
            this._getDuplicates(_persons);

         duplicates1 = duplicates1.map((person) => {
            let { id, ...rest } = person;
            id = `${id}-${rest.birthdate}`;
            return {
               id,
               ...rest,
            };
         });

         const { duplicates: duplicates2, nonDuplicates: nonDuplicates2 } =
            this._getDuplicates(duplicates1);

         if (duplicates2.length > 0) {
            console.error(duplicates2);
            throw new Error(`Duplicate persons: ${duplicates2.length}`);
         }

         const persons = [...nonDuplicates1, ...nonDuplicates2];

         this._initPersons(persons);

         const buffer = encode(this.persons);
         fs.writeFileSync(pathMsgpack, buffer);
      }
   };

   getPersonIdFromBbRefId = (bbRefId: string) => {
      const person = Object.values(this.persons).find(
         (person) => person.bbRefId === bbRefId,
      );

      if (!person) {
         // throw new Error(`Missing player for bbRefId: ${bbRefId}`);

         return null;
      }

      return person.id;
   };

   getPersonIdFromMlbId = (mlbId: string) => {
      const person = Object.values(this.persons).find(
         (person) => person.mlbId === mlbId,
      );

      if (!person) {
         throw new Error(`Missing player for mlbId: ${mlbId}`);
      }

      return person.id;
   };

   getPersonIdFromRetrosheetId = (retrosheetId: string) => {
      const person = Object.values(this.persons).find(
         (person) => person.retrosheetId === retrosheetId,
      );

      if (!person) {
         throw new Error(`Missing person for retrosheetId: ${retrosheetId}`);
      }

      return person.id;
   };
}

export default PersonHistoricalIdHelper;
