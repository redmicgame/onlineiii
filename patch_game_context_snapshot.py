import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """          if (topRelease) {
            const topReleaseSongs = topRelease.songIds
              .map((id) => artistData.songs.find((s) => s.id === id))
              .filter((s): s is Song => !!s);
            const weeklyStreams = topReleaseSongs.reduce(
              (sum, s) => sum + s.lastWeekStreams,
              0,
            );
            if (weeklyStreams > 100000) {
              const jsonStr = JSON.stringify({
                type: "album_weekly",
                albumName: topRelease.title,
                artistName: artistProfile?.name || "Unknown",
                coverArt: topRelease.coverArt,
                streams: weeklyStreams,
                totalStreams: topReleaseSongs.reduce(
                  (sum, s) => sum + s.streams,
                  0,
                ),
                tracks: topReleaseSongs.map((s) => ({
                  title: s.title,
                  streams: s.streams,
                  weekly: s.lastWeekStreams,
                })),
                date: newDate,
              });
              snapshotCandidates.push({
                artistId,
                streams: weeklyStreams,
                post: {
                  id: crypto.randomUUID(),
                  authorId: spotifyDataId,
                  content: `'${topRelease.title}' by ${artistProfile?.name} received ${formatNumber(weeklyStreams)} streams on Spotify yesterday.`,
                  image: `snapshot:${jsonStr}`,
                  likes: Math.floor(Math.random() * 10000) + 2000,
                  retweets: Math.floor(Math.random() * 2000) + 500,
                  views: Math.floor(Math.random() * 200000) + 50000,
                  date: newDate,
                },
              });
            }
          }"""

new_code = """          if (topRelease) {
            const topReleaseSongs = topRelease.songIds
              .map((id) => artistData.songs.find((s) => s.id === id))
              .filter((s): s is Song => !!s);
            const weeklyStreams = topReleaseSongs.reduce(
              (sum, s) => sum + s.lastWeekStreams,
              0,
            );
            if (weeklyStreams > 100000) {
              const prevWeeklyStreams = topReleaseSongs.reduce((sum, s) => sum + (s.prevWeekStreams || 0), 0);
              let percentChangeStr = "";
              if (prevWeeklyStreams > 0) {
                 const pct = ((weeklyStreams - prevWeeklyStreams) / prevWeeklyStreams) * 100;
                 percentChangeStr = ` [${pct > 0 ? '+' : ''}${pct.toFixed(2)}%]`;
              }
              
              let biggestGainerSong: Song | null = null;
              let biggestGainerPct = -Infinity;
              topReleaseSongs.forEach(s => {
                 const sPrev = s.prevWeekStreams || 0;
                 const sCurr = s.lastWeekStreams || 0;
                 if (sPrev > 0) {
                    const sPct = ((sCurr - sPrev) / sPrev) * 100;
                    if (sPct > biggestGainerPct) {
                       biggestGainerPct = sPct;
                       biggestGainerSong = s;
                    }
                 }
              });
              let gainerText = "";
              if (biggestGainerSong && biggestGainerPct > -Infinity) {
                  gainerText = `\\n\\n—"${biggestGainerSong.title}" was the biggest gainer, ${biggestGainerPct > 0 ? 'up' : 'down'} ${Math.abs(biggestGainerPct).toFixed(2)}% with ${formatNumber(biggestGainerSong.lastWeekStreams)} streams!`;
              }
              
              const jsonStr = JSON.stringify({
                type: "album_weekly",
                albumName: topRelease.title,
                artistName: artistProfile?.name || "Unknown",
                coverArt: topRelease.coverArt,
                streams: weeklyStreams,
                totalStreams: topReleaseSongs.reduce(
                  (sum, s) => sum + s.streams,
                  0,
                ),
                tracks: topReleaseSongs.map((s) => ({
                  title: s.title,
                  streams: s.streams,
                  weekly: s.lastWeekStreams,
                })),
                date: newDate,
              });
              snapshotCandidates.push({
                artistId,
                streams: weeklyStreams,
                post: {
                  id: crypto.randomUUID(),
                  authorId: "spotifysnapshot",
                  content: `"${topRelease.title}" by ${artistProfile?.name} received ${formatNumber(weeklyStreams)} streams on Spotify this week${percentChangeStr}.${gainerText}`,
                  image: `snapshot:${jsonStr}`,
                  likes: Math.floor(Math.random() * 20000) + 5000,
                  retweets: Math.floor(Math.random() * 5000) + 1000,
                  views: Math.floor(Math.random() * 500000) + 100000,
                  date: newDate,
                },
              });
            }
          }"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
