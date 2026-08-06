import re

with open('components/RiaaView.tsx', 'r') as f:
    content = f.read()

old_code = """            // Player Albums
            activeArtistData.releases.forEach(release => {
                let totalStreams = 0;
                release.songIds.forEach(id => {
                    const s = activeArtistData.songs.find(x => x.id === id);
                    if (s) totalStreams += s.streams;
                });
                const units = totalStreams / 1500 / 1000000; """

new_code = """            // Player Albums
            const deluxeMap = new Map<string, typeof activeArtistData.releases[0]>();
            activeArtistData.releases.forEach(r => {
                if (r.standardEditionId) deluxeMap.set(r.standardEditionId, r);
            });

            activeArtistData.releases.filter(r => !r.standardEditionId).forEach(release => {
                let totalStreams = 0;
                const deluxeVersion = deluxeMap.get(release.id);
                const songsToCount = deluxeVersion ? deluxeVersion.songIds : release.songIds;
                
                songsToCount.forEach(id => {
                    const s = activeArtistData.songs.find(x => x.id === id);
                    if (s) totalStreams += s.streams;
                });
                
                // Add physical merch sales from both versions
                const merchUnits = activeArtistData.merch
                    .filter(m => m.releaseId === release.id || (deluxeVersion && m.releaseId === deluxeVersion.id))
                    .reduce((sum, m) => sum + (m.unitsSold || 0), 0);
                    
                const units = (totalStreams / 1500 + merchUnits) / 1000000; """

content = content.replace(old_code, new_code)

with open('components/RiaaView.tsx', 'w') as f:
    f.write(content)
