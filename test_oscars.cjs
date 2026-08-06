const fs = require('fs');
const content = fs.readFileSync('context/GameContext.tsx', 'utf-8');
const oscarsCat = content.match(/const categories: OscarCategory\["name"\]\[\] = \[([^\]]+)\];/)[1];
console.log("Oscar cats:", oscarsCat);
const ggCat = content.match(/const categories: GoldenGlobeAward\["category"\]\[\] = \[([^\]]+)\];/)[1];
console.log("GG cats:", ggCat);
