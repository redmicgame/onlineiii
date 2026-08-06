import fs from 'fs';
let code = fs.readFileSync('components/MTVView.tsx', 'utf8');

code = code.replace(
  /payload: 'youtube'/g,
  "payload: 'game'"
);

fs.writeFileSync('components/MTVView.tsx', code);
