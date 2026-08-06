import re

with open('components/CatalogView.tsx', 'r') as f:
    content = f.read()

pattern = re.compile(
    r"const releaseSales = Math\.max\(0, songsToCount\.reduce\(\(total, songId\) => {\s*const song = activeArtistData\.songs\.find\(s => s\.id === songId\);\s*return total \+ Math\.floor\(\(song\?\.sales \|\| 0\) \* 0\.1\);\s*}, 0\) - \(release\.preReleaseSales \|\| 0\)\);\s*const merchUnits = activeArtistData\.merch\s*\.filter\(m => m\.releaseId === release\.id \|\| \(deluxeVersion && m\.releaseId === deluxeVersion\.id\)\)\s*\.reduce\(\(sum, m\) => sum \+ \(m\.unitsSold \|\| 0\), 0\);\s*return { \.\.\.release, streams: releaseStreams, sales: releaseSales \+ merchUnits, hasDeluxe: !!deluxeVersion, deluxeSongIds: deluxeVersion\?\.songIds };",
    re.MULTILINE
)

new_catalog = """                const rawSingleSales = songsToCount.reduce((total, songId) => {
                    const song = activeArtistData.songs.find(s => s.id === songId);
                    return total + (song?.sales || 0);
                }, 0);
                const trackEquivalentAlbumSales = Math.floor(Math.max(0, rawSingleSales - (release.preReleaseSales || 0)) * 0.1);

                return { ...release, streams: releaseStreams, sales: (release.sales || 0) + trackEquivalentAlbumSales, hasDeluxe: !!deluxeVersion, deluxeSongIds: deluxeVersion?.songIds };"""

if pattern.search(content):
    content = pattern.sub(new_catalog.strip(), content)
    print("CatalogView patched!")
else:
    print("CatalogView NOT patched - match not found!")

with open('components/CatalogView.tsx', 'w') as f:
    f.write(content)

with open('components/AlbumSalesChartView.tsx', 'r') as f:
    content2 = f.read()

pattern2 = re.compile(
    r"const releaseSales = release\.songIds\.reduce\(\(total, songId\) => {\s*const song = songs\.find\(s => s\.id === songId\);\s*return total \+ Math\.floor\(\(song\?\.sales \|\| 0\) \* 0\.1\);\s*}, 0\);\s*const merchUnits = activeArtistData\.merch\s*\.filter\(m => m\.releaseId === release\.id \|\| \(release\.standardEditionId && m\.releaseId === release\.standardEditionId\)\)\s*\.reduce\(\(sum, m\) => sum \+ \(m\.unitsSold \|\| 0\), 0\);\s*const units = Math\.floor\(releaseStreams \/ 1500\) \+ releaseSales \+ merchUnits \+ \(release\.preorderSales \|\| 0\);",
    re.MULTILINE
)

new_chart = """                const rawSingleSales = release.songIds.reduce((total, songId) => {
                    const song = songs.find(s => s.id === songId);
                    return total + (song?.sales || 0);
                }, 0);
                const trackEquivalentAlbumSales = Math.floor(Math.max(0, rawSingleSales - (release.preReleaseSales || 0)) * 0.1);
                
                const units = Math.floor(releaseStreams / 1500) + (release.sales || 0) + trackEquivalentAlbumSales;"""

if pattern2.search(content2):
    content2 = pattern2.sub(new_chart.strip(), content2)
    print("AlbumSalesChartView patched!")
else:
    print("AlbumSalesChartView NOT patched - match not found!")

with open('components/AlbumSalesChartView.tsx', 'w') as f:
    f.write(content2)

