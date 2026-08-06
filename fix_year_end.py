import re
with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

pattern = r'''      if \(newDate\.week === 1\) \{
        // 50% chance to create Pop Crave account each year if it doesn't exist'''

replacement = '''      if (newDate.week === 1) {
        // Collect Top #1 Songs History
        const allHistory = Object.entries(state.chartHistory || {}).filter(([id, data]) => data.weeksAtNo1 && data.weeksAtNo1 > 0);
        if (allHistory.length > 0) {
            allHistory.sort((a, b) => (b[1].weeksAtNo1 || 0) - (a[1].weeksAtNo1 || 0));
            const top = allHistory.slice(0, 12);
            
            const gridItems = top.map(([id, data]) => {
                let image = "https://ui-avatars.com/api/?name=Unknown";
                let text = `${data.weeksAtNo1} Weeks`;
                let subtitle = "Song";
                
                let playerSongFound = false;
                for (const aId in updatedArtistsData) {
                    const song = updatedArtistsData[aId].songs.find(s => s.id === id);
                    if (song) {
                        const release = updatedArtistsData[aId].labelSubmissions.find(s => s.release.songIds?.includes(id));
                        if (release) image = release.release.coverArt;
                        subtitle = song.title;
                        playerSongFound = true;
                        break;
                    }
                }
                
                if (!playerSongFound) {
                    const npcSong = state.npcs.find((s: any) => s.uniqueId === id);
                    if (npcSong) {
                        subtitle = npcSong.title;
                        const album = state.npcAlbums.find((a: any) => a.songIds.includes(id));
                        if (album && album.coverArt) {
                           image = album.coverArt;
                        } else {
                           const artistImg = state.npcImages[npcSong.artist];
                           if (artistImg) image = artistImg;
                           else image = `https://ui-avatars.com/api/?name=${encodeURIComponent(npcSong.artist)}`;
                        }
                    }
                }
                return { image, text, subtitle };
            });
            
            if (gridItems.length > 0) {
                const jsonStr = JSON.stringify({
                    title: "Songs with the most weeks at #1 on Global Spotify",
                    items: gridItems
                });
                
                snapshotCandidates.push({
                    artistId: state.activeArtistId,
                    streams: 0,
                    post: {
                        id: crypto.randomUUID(),
                        authorId: "popcore",
                        content: "Songs with the most weeks at #1 on Global Spotify:",
                        image: `leaderboard:${jsonStr}`,
                        likes: Math.floor(Math.random() * 50000) + 10000,
                        retweets: Math.floor(Math.random() * 10000) + 1000,
                        views: Math.floor(Math.random() * 1000000) + 500000,
                        date: newDate,
                    }
                });
            }
        }

        // 50% chance to create Pop Crave account each year if it doesn't exist'''

content = content.replace(pattern, replacement)

# Add popcore to xUsers
xuser_pattern = r'''          if \(
            !artistData\.xUsers\.some\(\(u\) => u\.id === "popcrave"\) &&
            Math\.random\(\) < 0\.5
          \) \{'''

xuser_replacement = '''          if (!artistData.xUsers.some(u => u.id === "popcore")) {
            artistData.xUsers.push({
              id: "popcore",
              name: "Pop Core",
              username: "TheePopCore",
              avatar: "https://ui-avatars.com/api/?name=Pop+Core&background=E8115B&color=fff",
              isVerified: true,
              bio: "The pulse of pop culture. Charts, trends, and records.",
              followersCount: 2300000,
              followingCount: 15,
            });
          }
          if (
            !artistData.xUsers.some((u) => u.id === "popcrave") &&
            Math.random() < 0.5
          ) {'''

content = re.sub(xuser_pattern, xuser_replacement, content)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
