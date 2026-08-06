import fs from 'fs';
let code = fs.readFileSync('components/ToursView.tsx', 'utf8');

const target = `{plannedTours.map(tour => (`;
const repl = `{[...plannedTours, ...activeTours].map(tour => (`;
code = code.replace(target, repl);

fs.writeFileSync('components/ToursView.tsx', code);
