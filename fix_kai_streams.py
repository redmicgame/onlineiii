import re
with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

pattern = r'''            if \(isOnActiveTourSetlist\) \{
              weeklyStreams = Math\.floor\(weeklyStreams \* 1\.05\); // \+5% boost
            \}'''

replacement = '''            if (isOnActiveTourSetlist) {
              weeklyStreams = Math.floor(weeklyStreams * 1.05); // +5% boost
            }

            // Kai Cenat Stream Boost
            if (artistData.twitchStreams) {
                for (const stream of artistData.twitchStreams) {
                    if (stream.hasStreamed && stream.songId === song.id) {
                        const ageInWeeks = (newDate.year - stream.scheduledDate.year) * 52 + (newDate.week - stream.scheduledDate.week);
                        if (ageInWeeks >= 0 && ageInWeeks < 2) {
                            weeklyStreams = Math.floor(weeklyStreams * 1.30); // 30% boost for 2 weeks
                        }
                    }
                }
            }'''

content = re.sub(pattern, replacement, content)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
