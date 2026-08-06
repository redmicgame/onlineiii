const fs = require('fs');
let content = fs.readFileSync('components/YouTubeMusicView.tsx', 'utf8');

content = content.replace(
    /const artist = activeArtistData\.soloArtist \|\| activeArtistData\.group;/,
    "const artist = gameState.soloArtist || gameState.group;"
);
content = content.replace(/artist\.profilePic/g, 'artist.image');

fs.writeFileSync('components/YouTubeMusicView.tsx', content);
