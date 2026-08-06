import re
with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

pattern = r'''        artistData\.labelSubmissions\.forEach\(\(sub\) => \{
          if \(
            sub\.status === "scheduled" &&
            sub\.release\.type\.includes\("Album"\)
          \) \{
            const preSaves = sub\.preSaves \|\| 0;
            if \(preSaves > 10000\) \{
              const surge = Math\.floor\(Math\.random\(\) \* 40\) \+ 5;
              const d1 = Math\.floor\(preSaves \* 0\.1\);
              const d2 = Math\.floor\(preSaves \* 0\.12\);
              const d3 = Math\.floor\(preSaves \* 0\.15\);

              const jsonStr = JSON\.stringify\(\{
                type: "presave",
                albumName: sub\.release\.title,
                artistName: artistProfile\?\.name \|\| "Unknown",
                coverArt: sub\.release\.coverArt,
                preSaves: preSaves,
                surge,
                d1,
                d2,
                d3,
                date: newDate,
                releaseDate: sub\.projectReleaseDate,
              \}\);

              snapshotCandidates\.push\(\{
                artistId,
                streams: preSaves \* 10,
                post: \{
                  id: crypto\.randomUUID\(\),
                  authorId: "spotifysnapshot",
                  content: `"\$\{sub\.release\.title\}" by \$\{artistProfile\?\.name\} has now surpassed \$\{formatNumber\(preSaves\)\} pre-saves on Spotify, including a \$\{surge\}% surge yesterday!`,
                  image: `snapshot:\$\{jsonStr\}`,
                  likes: Math\.floor\(Math\.random\(\) \* 20000\) \+ 5000,
                  retweets: Math\.floor\(Math\.random\(\) \* 5000\) \+ 1000,
                  views: Math\.floor\(Math\.random\(\) \* 500000\) \+ 100000,
                  date: newDate,
                \},
              \}\);
            \}'''

replacement = '''        artistData.labelSubmissions.forEach((sub) => {
          if (
            sub.status === "scheduled" &&
            sub.release.type.includes("Album")
          ) {
            const oldPreSaves = sub.preSaves || 0;
            const popularity = artistData.popularity || 0;
            const weeksSinceSubmit = Math.max(0, (newDate.year * 52 + newDate.week) - (sub.submittedDate.year * 52 + sub.submittedDate.week));
            // Removed streams from pre-save calculation to meet prompt requirement
            const newPreSaves = ((popularity * 15000)) * (1 + (weeksSinceSubmit * 0.25));
            sub.preSaves = newPreSaves;

            const preSaves = sub.preSaves;
            const milestones = [1000000, 3000000, 5000000, 10000000];
            
            let reachedMilestone = 0;
            for (const m of milestones) {
                if (oldPreSaves < m && preSaves >= m) {
                    reachedMilestone = m;
                }
            }

            if (reachedMilestone > 0) {
              snapshotCandidates.push({
                artistId,
                streams: preSaves * 10,
                post: {
                  id: crypto.randomUUID(),
                  authorId: "popcore",
                  content: `"${sub.release.title}" by ${artistProfile?.name} has officially surpassed ${formatNumber(reachedMilestone)} pre-saves on Spotify.`,
                  image: sub.release.coverArt,
                  likes: Math.floor(Math.random() * 50000) + 10000,
                  retweets: Math.floor(Math.random() * 10000) + 1000,
                  views: Math.floor(Math.random() * 1000000) + 500000,
                  date: newDate,
                },
              });
            }'''

content = re.sub(pattern, replacement, content)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
