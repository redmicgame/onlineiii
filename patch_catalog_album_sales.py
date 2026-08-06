import re

with open('components/CatalogView.tsx', 'r') as f:
    content = f.read()

old_catalog = """                const releaseSales = Math.max(0, songsToCount.reduce((total, songId) => {
                    const song = activeArtistData.songs.find(s => s.id === songId);
                    return total + Math.floor((song?.sales || 0) * 0.1);
                }, 0) - (release.preReleaseSales || 0));

                const merchUnits = activeArtistData.merch
                    .filter(m => m.releaseId === release.id || (deluxeVersion && m.releaseId === deluxeVersion.id))
                    .reduce((sum, m) => sum + (m.unitsSold || 0), 0);

                return { ...release, streams: releaseStreams, sales: releaseSales + merchUnits, hasDeluxe: !!deluxeVersion, deluxeSongIds: deluxeVersion?.songIds };"""

new_catalog = """                const rawSingleSales = songsToCount.reduce((total, songId) => {
                    const song = activeArtistData.songs.find(s => s.id === songId);
                    return total + (song?.sales || 0);
                }, 0);
                const trackEquivalentAlbumSales = Math.floor(Math.max(0, rawSingleSales - (release.preReleaseSales || 0)) * 0.1);

                return { ...release, streams: releaseStreams, sales: (release.sales || 0) + trackEquivalentAlbumSales, hasDeluxe: !!deluxeVersion, deluxeSongIds: deluxeVersion?.songIds };"""

content = content.replace(old_catalog, new_catalog)

with open('components/CatalogView.tsx', 'w') as f:
    f.write(content)

with open('components/AlbumSalesChartView.tsx', 'r') as f:
    content2 = f.read()

old_chart = """                const releaseSales = release.songIds.reduce((total, songId) => {
                    const song = songs.find(s => s.id === songId);
                    return total + Math.floor((song?.sales || 0) * 0.1);
                }, 0);

                const merchUnits = activeArtistData.merch
                    .filter(m => m.releaseId === release.id || (release.standardEditionId && m.releaseId === release.standardEditionId))
                    .reduce((sum, m) => sum + (m.unitsSold || 0), 0);

                const units = Math.floor(releaseStreams / 1500) + releaseSales + merchUnits + (release.preorderSales || 0);"""

new_chart = """                const rawSingleSales = release.songIds.reduce((total, songId) => {
                    const song = songs.find(s => s.id === songId);
                    return total + (song?.sales || 0);
                }, 0);
                const trackEquivalentAlbumSales = Math.floor(Math.max(0, rawSingleSales - (release.preReleaseSales || 0)) * 0.1);
                
                const units = Math.floor(releaseStreams / 1500) + (release.sales || 0) + trackEquivalentAlbumSales;"""

content2 = content2.replace(old_chart, new_chart)

with open('components/AlbumSalesChartView.tsx', 'w') as f:
    f.write(content2)

