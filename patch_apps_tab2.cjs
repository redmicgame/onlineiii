const fs = require('fs');
let content = fs.readFileSync('components/AppsTab.tsx', 'utf8');

content = content.replace(
    /if \(appName === 'YT Music'\) return eraConfig\.youtubeAvailable && gameState\.date\.year >= 2015 && hasRedMicPro;/,
    "if (appName === 'YT Music') return eraConfig.youtubeAvailable && gameState.date.year >= 2015;"
);

fs.writeFileSync('components/AppsTab.tsx', content);
