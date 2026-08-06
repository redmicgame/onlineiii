import re

with open('components/RiaaView.tsx', 'r') as f:
    content = f.read()

old_album = """            const totalStreams = release.songIds.reduce((sum, songId) => {
                const song = activeArtistData.songs.find(s => s.id === songId);
                return sum + (song?.streams || 0);
            }, 0);
            const totalSales = release.songIds.reduce((sum, songId) => {
                const song = activeArtistData.songs.find(s => s.id === songId);
                return sum + (song?.sales || 0);
            }, 0);"""

new_album = """            const rawStreams = release.songIds.reduce((sum, songId) => {
                const song = activeArtistData.songs.find(s => s.id === songId);
                return sum + (song?.streams || 0);
            }, 0);
            const rawSales = release.songIds.reduce((sum, songId) => {
                const song = activeArtistData.songs.find(s => s.id === songId);
                return sum + (song?.sales || 0);
            }, 0);
            const totalStreams = Math.max(0, rawStreams - (release.preReleaseStreams || 0));
            const totalSales = Math.max(0, rawSales - (release.preReleaseSales || 0));"""

content = content.replace(old_album, new_album)

with open('components/RiaaView.tsx', 'w') as f:
    f.write(content)
