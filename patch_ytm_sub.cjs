const fs = require('fs');
let content = fs.readFileSync('components/YouTubeMusicView.tsx', 'utf8');
content = content.replace(
    /activeArtistData\.followers \* 0\.6/,
    "activeArtistData.youtubeSubscribers"
);
fs.writeFileSync('components/YouTubeMusicView.tsx', content);
