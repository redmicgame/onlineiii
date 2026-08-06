import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """                      const rawAlbumSales = albumTracks.reduce((sum, s) => sum + (s.sales || 0), 0);
                      const albumEffectiveStreams = Math.max(0, rawAlbumStreams - (release.preReleaseStreams || 0));
                      const albumEffectiveSales = Math.max(0, rawAlbumSales - (release.preReleaseSales || 0)) + (release.sales || 0);
                      const albumTotalUnits = Math.floor(albumEffectiveStreams / 1500) + albumEffectiveSales;"""

new_code = """                      const rawAlbumSales = albumTracks.reduce((sum, s) => sum + (s.sales || 0), 0);
                      const albumEffectiveStreams = Math.max(0, rawAlbumStreams - (release.preReleaseStreams || 0));
                      const trackEquivalentAlbumSales = Math.floor(Math.max(0, rawAlbumSales - (release.preReleaseSales || 0)) * 0.1);
                      const albumEffectiveSales = trackEquivalentAlbumSales + (release.sales || 0);
                      const albumTotalUnits = Math.floor(albumEffectiveStreams / 1500) + albumEffectiveSales;"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
