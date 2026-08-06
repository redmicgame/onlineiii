import fs from 'fs';
let code = fs.readFileSync('components/AchievementsView.tsx', 'utf8');

const isStreamingEra = "gameState.date.year >= 2008";

code = code.replace(
    /<AchievementCard title="Top First Week Video Views"/g,
    `<AchievementCard title={${isStreamingEra} ? "Top First Week Video Views" : "Top First Week Video Requests"}`
);

fs.writeFileSync('components/AchievementsView.tsx', code);
