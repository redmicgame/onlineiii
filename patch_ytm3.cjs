const fs = require('fs');
let content = fs.readFileSync('components/YouTubeMusicView.tsx', 'utf8');

content = content.replace(
    /const \{ gameState, dispatch, activeArtistData \} = useGame\(\);/,
    "const { gameState, dispatch, activeArtistData, activeArtist } = useGame();"
);

content = content.replace(
    /const allPlayerArtists = \[gameState\.soloArtist, gameState\.group, \.\.\.\(gameState\.extraPlayableArtists \|\| \[\]\)\].filter\(Boolean\) as any\[\];\n    const artist = allPlayerArtists\.find\(a => a\.id === gameState\.activeArtistId\);/,
    "const artist = activeArtist;"
);

fs.writeFileSync('components/YouTubeMusicView.tsx', content);
