import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """            const rawSingleSales = release.songIds.reduce((sum, songId) => {
              const song = artistData.songs.find((s) => s.id === songId);
              return sum + (song?.sales || 0);
            }, 0);
            const trackEquivalentAlbumSales = Math.floor(Math.max(0, rawSingleSales - (release.preReleaseSales || 0)) * 0.1);
            const units = Math.floor(totalStreams / 1500) + trackEquivalentAlbumSales + (release.sales || 0);"""

new_code = """            const rawSingleSales = release.songIds.reduce((sum, songId) => {
              const song = artistData.songs.find((s) => s.id === songId);
              return sum + (song?.sales || 0);
            }, 0);
            const trackEquivalentAlbumSales = Math.floor(Math.max(0, rawSingleSales) * 0.1);
            const units = Math.floor(totalStreams / 1500) + trackEquivalentAlbumSales + (release.sales || 0);"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
