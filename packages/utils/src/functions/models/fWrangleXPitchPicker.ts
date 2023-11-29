import {
   TInputWrangleXPitchPicker,
   ZInputWrangleXPitchPicker,
   ZResponseWrangleXPitchPicker,
   getObjKeysInAlphabeticOrder,
} from "@bbfun/utils";

export default (input: TInputWrangleXPitchPicker) => {
   const parsedInput = ZInputWrangleXPitchPicker.parse(input);

   const keys = getObjKeysInAlphabeticOrder(parsedInput) as Array<
      keyof TInputWrangleXPitchPicker
   >;

   const response: number[] = [];

   for (const key of keys) {
      response.push(parsedInput[key]);
   }

   return ZResponseWrangleXPitchPicker.parse(response);
};
