const fs = require('fs');
let content = fs.readFileSync('components/AppsTab.tsx', 'utf8');

// add YouTube Music right after YT Studio in app Categories
if(!content.includes("name: 'YT Music'")) {
    content = content.replace(
        /\{ name: 'YT Studio', description: 'Analyze your channel performance', icon: <YouTubeIcon className="w-8 h-8"\/>, view: 'youtubeStudio', bgColor: '#282828'\},/,
        `{ name: 'YT Studio', description: 'Analyze your channel performance', icon: <YouTubeIcon className="w-8 h-8"/>, view: 'youtubeStudio', bgColor: '#282828'},
            { name: 'YT Music', description: 'Stream ad-free music', icon: <YouTubeIcon className="w-8 h-8"/>, view: 'youtubeMusic', bgColor: '#000000' },`
    );
}

// update isAppAvailable logic
if(!content.includes("if (appName === 'YT Music')")) {
    content = content.replace(
        /if \(appName === 'YouTube' \|\| appName === 'YT Studio'\) return eraConfig\.youtubeAvailable;/,
        `if (appName === 'YouTube' || appName === 'YT Studio') return eraConfig.youtubeAvailable;
        if (appName === 'YT Music') return eraConfig.youtubeAvailable && gameState.date.year >= 2015 && hasRedMicPro;`
    );
}

fs.writeFileSync('components/AppsTab.tsx', content);
console.log('Patched AppsTab.tsx');
