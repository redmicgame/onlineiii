import fs from 'fs';
let code = fs.readFileSync('components/AppsTab.tsx', 'utf8');
code = code.replace(
  "view: 'youtube', bgColor: '#FF0000' },\\n            { name: 'YouTube'",
  "view: 'mtv', bgColor: '#000000' },\\n            { name: 'YouTube'"
);
fs.writeFileSync('components/AppsTab.tsx', code);
