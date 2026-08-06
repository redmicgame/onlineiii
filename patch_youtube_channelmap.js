import fs from 'fs';
let code = fs.readFileSync('components/YouTubeView.tsx', 'utf8');

code = code.replace(
  "return map;",
  "map.set('mtv', { name: 'MTV', avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/MTV_Logo.svg/1200px-MTV_Logo.svg.png' });\n        return map;"
);

fs.writeFileSync('components/YouTubeView.tsx', code);
