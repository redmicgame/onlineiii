import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_logic = """      const npcChartContenders = newNpcsWithReleases.map((npc) => ({
        uniqueId: npc.uniqueId,
        title: npc.title,
        artist: npc.artist,
        weeklyStreams: Math.floor(
          npc.basePopularity * (Math.random() * 0.4 + 0.8),
        ),
        isPlayerSong: false,
        coverArt:
          npc.coverArt ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(npc.artist)}&background=random&color=fff&size=250`,
        songId: undefined,
        genre: npc.genre,
      }));"""

new_logic = """      const songTargetStreams: number[] = [];
      for (let i = 0; i < newNpcsWithReleases.length; i++) {
        let act = 0;
        if (i === 0) act = 20000000 + Math.random() * 20000000; // 20m-40m
        else if (i === 1) act = 16000000 + Math.random() * 9000000;   // 16m-25m
        else if (i === 2) act = 14000000 + Math.random() * 8000000;   // 14m-22m
        else if (i === 3) act = 12000000 + Math.random() * 6000000;   // 12m-18m
        else if (i === 4) act = 10000000 + Math.random() * 6000000;   // 10m-16m
        else if (i === 5) act = 9000000 + Math.random() * 5000000;    // 9m-14m
        else if (i === 6) act = 8000000 + Math.random() * 5000000;    // 8m-13m
        else if (i === 7) act = 7000000 + Math.random() * 5000000;    // 7m-12m
        else if (i === 8) act = 6500000 + Math.random() * 4500000;    // 6.5m-11m
        else if (i === 9) act = 6000000 + Math.random() * 4000000;    // 6m-10m
        else if (i < 20) act = 4000000 + Math.random() * 4000000;     // 4m-8m
        else if (i < 40) act = 2500000 + Math.random() * 2500000;     // 2.5m-5m
        else if (i < 60) act = 1800000 + Math.random() * 1200000;     // 1.8m-3m
        else if (i < 80) act = 1200000 + Math.random() * 800000;      // 1.2m-2m
        else if (i < 100) act = 700000 + Math.random() * 800000;      // 700k-1.5m
        else act = 300000 + Math.random() * 400000;                   // < 700k
        songTargetStreams.push(Math.floor(act));
      }
      songTargetStreams.sort((a, b) => b - a);

      const sortedNpcSongs = [...newNpcsWithReleases].sort((a, b) => b.basePopularity - a.basePopularity);
      const npcSongStreamMap = new Map<string, number>();
      sortedNpcSongs.forEach((song, index) => {
          npcSongStreamMap.set(song.uniqueId, songTargetStreams[index]);
      });

      const npcChartContenders = newNpcsWithReleases.map((npc) => {
        const weeklyStreams = npcSongStreamMap.get(npc.uniqueId) || 500000;
        return {
          uniqueId: npc.uniqueId,
          title: npc.title,
          artist: npc.artist,
          weeklyStreams,
          isPlayerSong: false,
          coverArt:
            npc.coverArt ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(npc.artist)}&background=random&color=fff&size=250`,
          songId: undefined,
          genre: npc.genre,
        };
      });"""

content = content.replace(old_logic, new_logic)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
