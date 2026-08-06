import re

with open('components/StudioView.tsx', 'r') as f:
    content = f.read()

old_code = """            const newSong: Song = {
                id: crypto.randomUUID(),
                title: track.title,
                genre,
                subgenre,
                quality: selectedStudio.qualityMultiplier,
                streams: 0,
                sales: 0,
                coverArt: autoWriteData.image || undefined,
                features: [],
                samples: [],
                isExplicit: false,
                revenue: 0,
                weeksAtNumberOne: 0,
                isLeadSingle: false,
                producers: [],
                songwriters: [],
                engineers: [],
                anr: [],
                costToProduce: selectedStudio.cost,
            };"""

new_code = """            const newSong: Song = {
                id: crypto.randomUUID(),
                title: track.title,
                genre,
                subgenre: subgenre !== 'None' ? subgenre : undefined,
                quality: selectedStudio.qualityMultiplier * (Math.floor(Math.random() * 20) + 80),
                coverArt: autoWriteData.image || '',
                isReleased: false,
                streams: 0,
                sales: 0,
                lastWeekStreams: 0,
                prevWeekStreams: 0,
                duration: track.duration ? Math.floor(track.duration / 1000) : (Math.floor(Math.random() * (240 - 120 + 1)) + 120),
                explicit: false,
                artistId: activeArtist.id,
                removedStreams: 0,
                dailyStreams: [],
                producers: [],
                songwriters: [],
                engineers: [],
                anr: [],
                features: [],
                samples: [],
                isExplicit: false,
                revenue: 0,
                weeksAtNumberOne: 0,
                isLeadSingle: false,
                costToProduce: selectedStudio.cost,
            };"""

if old_code in content:
    content = content.replace(old_code, new_code)
    print("Patched successfully!")
else:
    print("Match not found!")

with open('components/StudioView.tsx', 'w') as f:
    f.write(content)
