import fs from 'fs';
let code = fs.readFileSync('types.ts', 'utf8');

const youtubeViewType = `  | "youtube"`;
const mtvViewType = `  | "youtube"\n  | "mtv"`;

code = code.replace(youtubeViewType, mtvViewType);
fs.writeFileSync('types.ts', code);
