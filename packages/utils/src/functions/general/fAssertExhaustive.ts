export default (
   value: never,
   message = "Reached unexpected case in exhaustive switch",
): never => {
   throw new Error(message);
};
