with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """              const release = sub.release;

              artistData.releases.push({
                ...release,
                releaseDate: newDate,
                releasingLabel: releasingLabelInfo,"""

new_code = """              const release = sub.release;
              const preReleaseStreams = release.songIds.reduce((sum: number, sid: string) => sum + (artistData.songs.find((s: any) => s.id === sid)?.streams || 0), 0);
              const preReleaseSales = release.songIds.reduce((sum: number, sid: string) => sum + (artistData.songs.find((s: any) => s.id === sid)?.sales || 0), 0);

              artistData.releases.push({
                ...release,
                releaseDate: newDate,
                releasingLabel: releasingLabelInfo,
                preReleaseStreams,
                preReleaseSales,"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
