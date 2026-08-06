import fs from 'fs';
let code = fs.readFileSync('components/AchievementsView.tsx', 'utf8');

const isStreamingEra = "gameState.date.year >= 2008";

const topSongsBlock = `<AchievementCard title={gameState.date.year >= 2008 ? "Top First Week Streams" : "Top First Week Sales"} accentColorClass="text-green-400">
                    <ExpandableList 
                        items={topSongsFirstWeek} 
                        getValue={(item) => item.firstWeekStreams ?? 0}`;
const topSongsBlockNew = `<AchievementCard title={gameState.date.year >= 2008 ? "Top First Week Streams" : "Top First Week Sales"} accentColorClass="text-green-400">
                    <ExpandableList 
                        items={topSongsFirstWeek} 
                        getValue={(item) => gameState.date.year >= 2008 ? (item.firstWeekStreams ?? 0) : Math.floor((item.firstWeekStreams ?? 0) / 150)}`;

code = code.replace(topSongsBlock, topSongsBlockNew);

const topAlbumsBlock = `<AchievementCard title={gameState.date.year >= 2008 ? "Top First Week Album/EP Streams" : "Top First Week Album/EP Sales"} accentColorClass="text-green-400">
                    <ExpandableList 
                        items={topAlbumsFirstWeek} 
                        getValue={(item) => item.firstWeekStreams ?? 0}`;
const topAlbumsBlockNew = `<AchievementCard title={gameState.date.year >= 2008 ? "Top First Week Album/EP Streams" : "Top First Week Album/EP Sales"} accentColorClass="text-green-400">
                    <ExpandableList 
                        items={topAlbumsFirstWeek} 
                        getValue={(item) => gameState.date.year >= 2008 ? (item.firstWeekStreams ?? 0) : Math.floor((item.firstWeekStreams ?? 0) / 1500)}`;

code = code.replace(topAlbumsBlock, topAlbumsBlockNew);

const topStreamedProjectsBlock = `<AchievementCard title={gameState.date.year >= 2008 ? "Most Streamed Projects" : "Highest Selling Projects"} accentColorClass="text-green-500">
                    <ExpandableList 
                        items={topStreamedProjects as any} 
                        getValue={(item) => item.totalStreams ?? 0}`;
const topStreamedProjectsBlockNew = `<AchievementCard title={gameState.date.year >= 2008 ? "Most Streamed Projects" : "Highest Selling Projects"} accentColorClass="text-green-500">
                    <ExpandableList 
                        items={topStreamedProjects as any} 
                        getValue={(item) => gameState.date.year >= 2008 ? (item.totalStreams ?? 0) : Math.floor((item.totalStreams ?? 0) / 1500)}`;

code = code.replace(topStreamedProjectsBlock, topStreamedProjectsBlockNew);

fs.writeFileSync('components/AchievementsView.tsx', code);
