export default (input: object) => {
   return Object.keys(input).sort((a, b) => a.localeCompare(b));
};
