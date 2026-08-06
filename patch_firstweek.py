import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """          if (
            newDate.year * 52 +
              newDate.week -
              (release.releaseDate?.year * 52 + release.releaseDate?.week) ===
          ) {
            const firstWeekProjectStreams = release.songIds.reduce(
              (sum, songId) => {
                const song = updatedSongs.find((s) => s.id === songId);
                return sum + (song?.firstWeekStreams || 0);
              },
              0,
            );
            return { ...release, firstWeekStreams: firstWeekProjectStreams };
          }"""

new_code = """          if (
            newDate.year * 52 +
              newDate.week -
              (release.releaseDate?.year * 52 + release.releaseDate?.week) ===
          ) {
            const firstWeekProjectStreams = release.songIds.reduce(
              (sum, songId) => {
                const song = updatedSongs.find((s) => s.id === songId);
                return sum + (song?.lastWeekStreams || 0);
              },
              0,
            );
            return { ...release, firstWeekStreams: firstWeekProjectStreams };
          }"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
