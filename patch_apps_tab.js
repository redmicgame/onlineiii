import fs from 'fs';
let code = fs.readFileSync('components/AppsTab.tsx', 'utf8');

code = code.replace(
    "{ name: 'YouTube', description: 'Watch and share videos', icon: <YouTubeIcon className=\"w-8 h-8\"/>, view: 'youtube', bgColor: '#FF0000' },",
    "{ name: 'MTV', description: 'Music Television', icon: <span className=\"font-black text-2xl italic\">MTV</span>, view: 'youtube', bgColor: '#FF0000' },\n            { name: 'YouTube', description: 'Watch and share videos', icon: <YouTubeIcon className=\"w-8 h-8\"/>, view: 'youtube', bgColor: '#FF0000' },"
);

code = code.replace(
    "if (appName === 'YouTube' || appName === 'YT Studio') return eraConfig.youtubeAvailable;",
    "if (appName === 'YouTube' || appName === 'YT Studio') return eraConfig.youtubeAvailable;\n        if (appName === 'MTV') return gameState.date.year >= 1975 && gameState.date.year <= 2007;"
);

fs.writeFileSync('components/AppsTab.tsx', code);
