import re

with open('components/CatalogView.tsx', 'r') as f:
    content = f.read()

old_code = """                const releaseSales = Math.max(0, songsToCount.reduce((total, songId) => {
                    const song = activeArtistData.songs.find(s => s.id === songId);
                    return total + (song?.sales || 0);
                }, 0) - (release.preReleaseSales || 0));"""

new_code = """                const releaseSales = Math.max(0, songsToCount.reduce((total, songId) => {
                    const song = activeArtistData.songs.find(s => s.id === songId);
                    return total + Math.floor((song?.sales || 0) * 0.1);
                }, 0) - (release.preReleaseSales || 0));"""

content = content.replace(old_code, new_code)

with open('components/CatalogView.tsx', 'w') as f:
    f.write(content)

with open('components/AlbumSalesChartView.tsx', 'r') as f:
    content2 = f.read()

old_code2 = """                const releaseSales = release.songIds.reduce((total, songId) => {
                    const song = songs.find(s => s.id === songId);
                    return total + (song?.sales || 0);
                }, 0);"""

new_code2 = """                const releaseSales = release.songIds.reduce((total, songId) => {
                    const song = songs.find(s => s.id === songId);
                    return total + Math.floor((song?.sales || 0) * 0.1);
                }, 0);"""

content2 = content2.replace(old_code2, new_code2)

with open('components/AlbumSalesChartView.tsx', 'w') as f:
    f.write(content2)

