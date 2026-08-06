import fs from 'fs';
let code = fs.readFileSync('context/GameContext.tsx', 'utf8');

const instaGainOld = `          const instagramPassiveGain =
            Math.floor((totalWeeklyStreams / 12000) * tikTokPopMult) +
            Math.floor(Math.random() * 60);`;
const instaGainNew = `          const instagramPassiveGain =
            Math.floor((totalWeeklyStreams / 8000) * tikTokPopMult) +
            Math.floor(Math.random() * 90);`;

const ytSubOld = `        const newSubscribersGained = Math.floor(
          totalWeeklyViews /
            (450 - Math.min(350, artistData.youtubeSubscribers / 4000)),
        );`;
const ytSubNew = `        const newSubscribersGained = Math.floor(
          (totalWeeklyViews /
            (450 - Math.min(350, artistData.youtubeSubscribers / 4000))) * 0.85,
        );`;

code = code.replace(instaGainOld, instaGainNew);
code = code.replace(ytSubOld, ytSubNew);
fs.writeFileSync('context/GameContext.tsx', code);
