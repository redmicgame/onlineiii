const { readFileSync } = require('fs');

const contextContent = readFileSync('./context/GameContext.tsx', 'utf8');
const lines = contextContent.split('\n');

const startIndex = lines.findIndex(l => l.includes('case "EDIT_TOUR_SETLIST": {'));
let braces = 0;
let code = '';
for (let i = startIndex; i < lines.length; i++) {
  code += lines[i] + '\n';
  if (lines[i].includes('{')) braces += (lines[i].match(/\{/g) || []).length;
  if (lines[i].includes('}')) braces -= (lines[i].match(/\}/g) || []).length;
  if (braces === 0) break;
}
console.log(code);
