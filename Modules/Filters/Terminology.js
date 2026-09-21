// const getTerminology = (originalString, terminology) => {
//   if (!originalString || !originalString.length || !terminology || !terminology.length) return originalString;

//   const hasTerm = originalString.includes('{#');
//   if (!hasTerm) return originalString;

//   const regex = /({#.*\$})/g; // string that starts with '{#' and ends with '$}'
//   const subString = originalString.match(regex)[0];
//   const containsOnlyOne = (subString.match(/{#/g)).length === 1;
//   if (subString) {
//     if (containsOnlyOne) {
//       const term = terminology.filter(item => item.original === subString)[0] || null;
//       if (term) {
//         return term.replacement === undefined ? originalString : originalString.replace(subString, term.replacement);
//       }
//     }
//     else {
//       const terms = terminology.filter(item => subString.includes(item.original));
//       terms.forEach(term => {
//         originalString = term.replacement === undefined ? originalString : originalString.replace(term.original, term.replacement);
//       });
//       return originalString;
//     }
//   }
// };

//  updated method so multiple instances of the same placeholder can be used -- RC
const getTerminology = (originalString, terminology) => {
  if (!originalString || !originalString.length || !terminology || !terminology.length) return originalString;

  const regex = /({#.*?\$})/g; // Update to use non-greedy matching
  return originalString.replace(regex, (match) => {
    const term = terminology.find(item => item.original === match) || null;
    return term ? (term.replacement === undefined ? match : term.replacement) : match;
  });
};

export default getTerminology;