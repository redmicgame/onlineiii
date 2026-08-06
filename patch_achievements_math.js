import fs from 'fs';
let code = fs.readFileSync('components/AchievementsView.tsx', 'utf8');

const isStreamingEra = "gameState.date.year >= 2008";

code = code.replace(
    /getValue=\{\(item\) => \$\{isStreamingEra\} \? \(item\.firstWeekStreams \?\? 0\) : Math\.floor\(\(item\.firstWeekStreams \?\? 0\) \/ 150\)\}/g,
    `getValue={(item) => item.firstWeekStreams ?? 0}`
);

// Restore original first just in case
fs.writeFileSync('components/AchievementsView.tsx', code);
