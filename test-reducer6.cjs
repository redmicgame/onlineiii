const fs = require('fs');
let code = fs.readFileSync('context/GameContext.tsx', 'utf8');

const startIndex = code.indexOf('case "EDIT_TOUR_SETLIST": {');
const endIndex = code.indexOf('case "CANCEL_TOUR": {');
let reducerCode = code.substring(startIndex, endIndex);

console.log(reducerCode);
