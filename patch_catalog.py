import re

with open('components/CatalogView.tsx', 'r') as f:
    content = f.read()

# Update releaseStreams calculation
old_calc = """                const releaseStreams = songsToCount.reduce((total, songId) => {
                    const song = activeArtistData.songs.find(s => s.id === songId);
                    return total + (song?.streams || 0);
                }, 0);
                const releaseSales = songsToCount.reduce((total, songId) => {
                    const song = activeArtistData.songs.find(s => s.id === songId);
                    return total + (song?.sales || 0);
                }, 0);"""

new_calc = """                const releaseStreams = Math.max(0, songsToCount.reduce((total, songId) => {
                    const song = activeArtistData.songs.find(s => s.id === songId);
                    return total + (song?.streams || 0);
                }, 0) - (release.preReleaseStreams || 0));
                
                const releaseSales = Math.max(0, songsToCount.reduce((total, songId) => {
                    const song = activeArtistData.songs.find(s => s.id === songId);
                    return total + (song?.sales || 0);
                }, 0) - (release.preReleaseSales || 0));"""

content = content.replace(old_calc, new_calc)

with open('components/CatalogView.tsx', 'w') as f:
    f.write(content)
