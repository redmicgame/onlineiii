import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """            const totalStreams = release.songIds.reduce((sum, songId) => {
              const song = artistData.songs.find((s) => s.id === songId);
              return sum + (song?.streams || 0);
            }, 0);
            const units = Math.floor(totalStreams / 1500);"""

new_code = """            const totalStreams = release.songIds.reduce((sum, songId) => {
              const song = artistData.songs.find((s) => s.id === songId);
              return sum + (song?.streams || 0);
            }, 0);
            const totalSales = release.songIds.reduce((sum, songId) => {
              const song = artistData.songs.find((s) => s.id === songId);
              return sum + Math.floor((song?.sales || 0) * 0.1);
            }, 0);
            const units = Math.floor(totalStreams / 1500) + totalSales + (release.sales || 0);"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
