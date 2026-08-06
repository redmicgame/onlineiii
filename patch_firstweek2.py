import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

content = re.sub(
    r'const firstWeekProjectStreams = release\.songIds\.reduce\([\s\S]*?return sum \+ \(song\?\.firstWeekStreams \|\| 0\);[\s\S]*?\},[\s\S]*?0,\n            \);',
    r'''const firstWeekProjectStreams = release.songIds.reduce(
              (sum, songId) => {
                const song = updatedSongs.find((s) => s.id === songId);
                return sum + (song?.lastWeekStreams || 0);
              },
              0,
            );''',
    content
)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
