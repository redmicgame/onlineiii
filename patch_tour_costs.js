import fs from 'fs';
let code = fs.readFileSync('components/CreateTourView.tsx', 'utf8');

let target1 = `const openerCost = opener ? opener.basePopularity * 2000 * chosenVenuesList.length : 0;`;
let repl1 = `const openerCost = opener ? Math.floor(opener.basePopularity / 50) * chosenVenuesList.length : 0;`;
code = code.replace(target1, repl1);

let target2 = `if (guest) guestsCost += guest.basePopularity * 1000 * chosenVenuesList.length;`;
let repl2 = `if (guest) guestsCost += Math.floor(guest.basePopularity / 100) * chosenVenuesList.length;`;
code = code.replace(target2, repl2);

let target3 = `{npc.artist} (\\$\\{formatNumber(npc.basePopularity * 2000 * chosenVenuesList.length)}) total cost)`;
let repl3 = `{npc.artist} (\\$\\{formatNumber(Math.floor(npc.basePopularity / 50) * chosenVenuesList.length)} total cost)`;
code = code.replace(target3, repl3);

let target4 = `Cost: \\$\\{formatNumber(npc.basePopularity * 1000 * chosenVenuesList.length)}`;
let repl4 = `Cost: \\$\\{formatNumber(Math.floor(npc.basePopularity / 100) * chosenVenuesList.length)}`;
code = code.replace(target4, repl4);

fs.writeFileSync('components/CreateTourView.tsx', code);
