import fs from 'fs';
let code = fs.readFileSync('components/ToursView.tsx', 'utf8');

const target = `{plannedTours.length === 0 && <p className="text-gray-400 text-sm">No active tours.</p>}`;
const repl = `{(plannedTours.length + activeTours.length) === 0 && <p className="text-gray-400 text-sm">No active tours.</p>}`;
code = code.replace(target, repl);

fs.writeFileSync('components/ToursView.tsx', code);
