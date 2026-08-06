import fs from 'fs';
let code = fs.readFileSync('components/AchievementsView.tsx', 'utf8');

const titleRemoved = `<AchievementCard title="Top Fraudulent Streams" accentColorClass="text-red-500">
                    <ExpandableList 
                        items={topFraudulentSongs} 
                        getValue={(item) => item.removedStreams ?? 0}`;
const titleRemovedNew = `<AchievementCard title={gameState.date.year >= 2008 ? "Top Fraudulent Streams" : "Top Fraudulent Sales"} accentColorClass="text-red-500">
                    <ExpandableList 
                        items={topFraudulentSongs} 
                        getValue={(item) => gameState.date.year >= 2008 ? (item.removedStreams ?? 0) : Math.floor((item.removedStreams ?? 0) / 150)}`;

code = code.replace(titleRemoved, titleRemovedNew);

fs.writeFileSync('components/AchievementsView.tsx', code);
