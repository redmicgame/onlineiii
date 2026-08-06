import fs from 'fs';
let code = fs.readFileSync('components/GameUI.tsx', 'utf8');

code = code.replace(
    '<main className="flex-grow overflow-y-auto pb-24 h-full">',
    '<main className="flex-1 overflow-y-auto pb-24 -webkit-overflow-scrolling-touch">'
);

fs.writeFileSync('components/GameUI.tsx', code);
