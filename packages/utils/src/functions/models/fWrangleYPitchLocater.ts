import {
   TInputWrangleYPitchLocater,
   ZInputWrangleYPitchLocater,
   ZResponseWrangleYPitchLocater,
   getObjKeysInAlphabeticOrder,
} from "src";

export default (input: TInputWrangleYPitchLocater) => {
   const parsedInput = ZInputWrangleYPitchLocater.parse(input);
   const keys = getObjKeysInAlphabeticOrder(parsedInput) as Array<
      keyof TInputWrangleYPitchLocater
   >;

   const response: number[] = [];

   for (const key of keys) {
      response.push(parsedInput[key]);
   }

   return ZResponseWrangleYPitchLocater.parse(response);
};
