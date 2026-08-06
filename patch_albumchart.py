import re

with open('components/AlbumSalesChartView.tsx', 'r') as f:
    content = f.read()

old_calc = """                const releaseStreams = release.songIds.reduce((total, songId) => {
                    const song = songs.find(s => s.id === songId);
                    const songStreams = song?.streams || 0;
                    
                    const otherReleases = eligibleReleases.filter(r => r.songIds.includes(songId));
                    const thisRaw = releaseRawStreams.get(release.id) || 0;
                    
                    const bestRelease = otherReleases.reduce((best, r) => {
                        const raw = releaseRawStreams.get(r.id) || 0;
                        if (raw > best.raw) return { id: r.id, raw };
                        return best;
                    }, { id: release.id, raw: thisRaw });

                    if (bestRelease.id !== release.id) {
                        return total;
                    }

                    return total + songStreams;
                }, 0);

                const releaseSales = release.songIds.reduce((total, songId) => {
                    const song = songs.find(s => s.id === songId);
                    return total + (song?.sales || 0);
                }, 0);"""

new_calc = """                const rawTotalStreams = release.songIds.reduce((total, songId) => {
                    const song = songs.find(s => s.id === songId);
                    const songStreams = song?.streams || 0;
                    
                    const otherReleases = eligibleReleases.filter(r => r.songIds.includes(songId));
                    const thisRaw = releaseRawStreams.get(release.id) || 0;
                    
                    const bestRelease = otherReleases.reduce((best, r) => {
                        const raw = releaseRawStreams.get(r.id) || 0;
                        if (raw > best.raw) return { id: r.id, raw };
                        return best;
                    }, { id: release.id, raw: thisRaw });

                    if (bestRelease.id !== release.id) {
                        return total;
                    }

                    return total + songStreams;
                }, 0);
                const releaseStreams = Math.max(0, rawTotalStreams - (release.preReleaseStreams || 0));

                const rawTotalSales = release.songIds.reduce((total, songId) => {
                    const song = songs.find(s => s.id === songId);
                    return total + (song?.sales || 0);
                }, 0);
                const releaseSales = Math.max(0, rawTotalSales - (release.preReleaseSales || 0));"""

content = content.replace(old_calc, new_calc)

with open('components/AlbumSalesChartView.tsx', 'w') as f:
    f.write(content)
