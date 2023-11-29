import { z } from "zod";

const getZodObjKeysInAlphabeticOrder = (schema: z.ZodSchema) => {
   if (!schema) {
      throw new Error("schema is undefined");
   }

   if (schema instanceof z.ZodObject) {
      const entries = Object.entries(schema.shape);

      return entries
         .map(([key, value]) => {
            if (value instanceof z.ZodType) {
               //means has nested zod, don't support as of now
               // Implement this if you want it: https://github.com/colinhacks/zod/discussions/2134#discussioncomment-5199845
               return key;
            }

            return key;
         })
         .sort((a, b) => a.localeCompare(b));
   }

   throw new Error("schema is not an object");
};

export default getZodObjKeysInAlphabeticOrder;
