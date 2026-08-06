const fs = require('fs');
const content = fs.readFileSync('context/GameContext.tsx', 'utf8');
if (content.includes('case "EDIT_TOUR_SETLIST":')) {
  console.log('Action is present');
} else {
  console.log('Action is MISSING');
}
