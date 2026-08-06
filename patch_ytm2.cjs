const fs = require('fs');
let content = fs.readFileSync('components/YouTubeMusicView.tsx', 'utf8');

content = content.replace(
    /const artist = gameState\.soloArtist \|\| gameState\.group;/,
    "const allPlayerArtists = [gameState.soloArtist, gameState.group, ...(gameState.extraPlayableArtists || [])].filter(Boolean) as any[];\n    const artist = allPlayerArtists.find(a => a.id === gameState.activeArtistId);"
);

fs.writeFileSync('components/YouTubeMusicView.tsx', content);
