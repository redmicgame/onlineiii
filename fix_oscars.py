import re
with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

pattern = r'''          if \(artistData && artistProfile && song\) \{
            const score = song\.quality \* 3 \+ song\.streams \/ 1000000;
            contenders\.push\(\{'''

replacement = '''          if (artistData && artistProfile && song) {
            const score = (song.quality * 50) + (song.streams / 1000000) + 500; // Massive boost for player Oscar chances
            contenders.push({'''

content = re.sub(pattern, replacement, content)

pattern2 = r'''        npcSongsForOscars\.forEach\(\(song\) => \{
          contenders\.push\(\{
            id: song\.uniqueId,
            name: song\.title,
            artistName: song\.artist,
            isPlayer: false,
            score: \(song\.basePopularity \/ 100000\) \* 1\.5,'''

replacement2 = '''        npcSongsForOscars.forEach((song) => {
          contenders.push({
            id: song.uniqueId,
            name: song.title,
            artistName: song.artist,
            isPlayer: false,
            score: (song.basePopularity / 1000000) * 8 + (Math.random() * 200),'''

content = re.sub(pattern2, replacement2, content)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
