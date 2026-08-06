import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_logic = """      const npcAlbumContenders = newNpcAlbums.map((album) => {
        const albumSongs = album.songIds
          .map((id) => newNpcsWithReleases.find((s) => s.uniqueId === id))
          .filter(Boolean);

        const totalWeeklyStreams = albumSongs.reduce((sum, song) => {
          if (!song) return sum;
          return (
            sum + Math.floor(song.basePopularity * (Math.random() * 0.4 + 0.8))
          );
        }, 0);

        const eraConfigTmp3 = getEraConfiguration(state.date.year);

        let streamActivity = Math.floor(
          (totalWeeklyStreams / 1500) * eraConfigTmp3.marketShare.streaming,
        );
        // Add a baseline boost to ensure Billboard 200 bottom stays around 7000+ units
        streamActivity += 6000 + (Math.random() * 4000);

        // Use the sales potential to guarantee higher chart positions
        // Sales potential (14k+) ensures chart relevance.
        // Vary sales weekly by +/- 10%
        const variance = 0.9 + Math.random() * 0.2;

        // Pure sales scaling by era
        // In earlier eras, we need MORE pure sales to be relevant on the chart.
        const eraSalesBoost =
          eraConfigTmp3.marketShare.physical +
            eraConfigTmp3.marketShare.digital >
          0.8
            ? 2.5
            : 1.0;

        const weeklySales = Math.floor(
          (album.salesPotential || 1000) * variance * eraSalesBoost,
        );
        const weeklyActivity = streamActivity + weeklySales;

        return {
          uniqueId: album.uniqueId,
          title: album.title,
          artist: album.artist,
          label: album.label,
          coverArt: album.coverArt,
          isPlayerAlbum: false,
          albumId: album.uniqueId,
          weeklyActivity,
          weeklySales,
          weeklySES: streamActivity,
          weeklyPureSales: weeklySales,
        };
      });"""

new_logic = """      const targetActivities: number[] = [];
      for (let i = 0; i < newNpcAlbums.length; i++) {
        let act = 0;
        if (i === 0) act = 100000 + Math.random() * 150000; // 100k-250k
        else if (i === 1) act = 70000 + Math.random() * 50000;   // 70k-120k
        else if (i === 2) act = 55000 + Math.random() * 35000;   // 55k-90k
        else if (i === 3) act = 45000 + Math.random() * 30000;   // 45k-75k
        else if (i === 4) act = 40000 + Math.random() * 25000;   // 40k-65k
        else if (i === 5) act = 36000 + Math.random() * 19000;   // 36k-55k
        else if (i === 6) act = 33000 + Math.random() * 17000;   // 33k-50k
        else if (i === 7) act = 30000 + Math.random() * 16000;   // 30k-46k
        else if (i === 8) act = 28000 + Math.random() * 15000;   // 28k-43k
        else if (i === 9) act = 26000 + Math.random() * 14000;   // 26k-40k
        else if (i < 20) act = 18000 + Math.random() * 12000;    // 18k-30k
        else if (i < 40) act = 12000 + Math.random() * 18000;    // 12k-30k
        else if (i < 60) act = 9000 + Math.random() * 16000;     // 9k-25k
        else if (i < 80) act = 7000 + Math.random() * 13000;     // 7k-20k
        else if (i < 100) act = 5500 + Math.random() * 13000;    // 5.5k-18.5k
        else if (i < 150) act = 3500 + Math.random() * 12500;    // 3.5k-16k
        else if (i < 200) act = 2000 + Math.random() * 12000;    // 2k-14k
        else act = 500 + Math.random() * 1500;
        targetActivities.push(Math.floor(act));
      }
      targetActivities.sort((a, b) => b - a);

      const sortedNpcAlbums = [...newNpcAlbums].sort((a, b) => (b.salesPotential || 0) - (a.salesPotential || 0));
      const npcActivityMap = new Map<string, number>();
      sortedNpcAlbums.forEach((album, index) => {
          npcActivityMap.set(album.uniqueId, targetActivities[index]);
      });

      const npcAlbumContenders = newNpcAlbums.map((album) => {
        const weeklyActivity = npcActivityMap.get(album.uniqueId) || 1000;
        
        album.salesPotential = (album.salesPotential || 1000) * (0.85 + Math.random() * 0.1);

        const weeklySES = Math.floor(weeklyActivity * 0.8);
        const weeklySales = weeklyActivity - weeklySES;

        return {
          uniqueId: album.uniqueId,
          title: album.title,
          artist: album.artist,
          label: album.label,
          coverArt: album.coverArt,
          isPlayerAlbum: false,
          albumId: album.uniqueId,
          weeklyActivity,
          weeklySales,
          weeklySES,
          weeklyPureSales: weeklySales,
        };
      });"""

content = content.replace(old_logic, new_logic)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
