import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

# I need to find where the hot 100 or other charts are generated in END_WEEK.
# Let's search for "newSpotifyAfrica = generateSpotifyChart("
target_spotify_charts = """      const newSpotifyAfrica = generateSpotifyChart("Africa", (state as any).spotifyAfrica || []);"""

replacement_spotify_charts = """      const newSpotifyAfrica = generateSpotifyChart("Africa", (state as any).spotifyAfrica || []);

      // --- UK OFFICIAL SINGLES CHART ---
      let newUkSinglesChart = state.ukSinglesChart || [];
      let newUkSinglesChartHistory = state.ukSinglesChartHistory || {};
      
      if (state.date.year >= 2016) {
        const sortedUkContenders = [...allContenders].sort((a, b) => {
            const aUkStreams = a.regionalStreams?.["UK"] || 0;
            const aUkRadio = a.ukRadioPlays || 0;
            const aPoints = aUkStreams + (aUkRadio * 50); // Rough approximation of points
            
            const bUkStreams = b.regionalStreams?.["UK"] || 0;
            const bUkRadio = b.ukRadioPlays || 0;
            const bPoints = bUkStreams + (bUkRadio * 50);
            
            return bPoints - aPoints;
        }).slice(0, 100);
        
        newUkSinglesChart = sortedUkContenders.map((song, index) => {
            const prevEntry = state.ukSinglesChart?.find(e => e.id === song.id);
            return {
                ...song,
                currentPosition: index + 1,
                lastWeekPosition: prevEntry ? prevEntry.currentPosition : null,
                peakPosition: prevEntry ? Math.min(prevEntry.peakPosition, index + 1) : index + 1,
                weeksOnChart: prevEntry ? prevEntry.weeksOnChart + 1 : 1,
                radioPlays: song.ukRadioPlays || 0,
            };
        });
        
        newUkSinglesChartHistory = { ...state.ukSinglesChartHistory };
        newUkSinglesChart.forEach(entry => {
            if (entry.isPlayerSong) {
                if (!newUkSinglesChartHistory[entry.id]) {
                    newUkSinglesChartHistory[entry.id] = [];
                }
                newUkSinglesChartHistory[entry.id].push({
                    week: state.date.week,
                    year: state.date.year,
                    position: entry.currentPosition
                });
            }
        });
      }"""
content = content.replace(target_spotify_charts, replacement_spotify_charts)

# Also need to add ukSinglesChart and ukSinglesChartHistory to the returned state of END_WEEK
target_end_week_return = """        spotifyAfrica: newSpotifyAfrica,
        hotPopSongs: newHotPopSongs,"""
replacement_end_week_return = """        spotifyAfrica: newSpotifyAfrica,
        ukSinglesChart: newUkSinglesChart,
        ukSinglesChartHistory: newUkSinglesChartHistory,
        hotPopSongs: newHotPopSongs,"""
content = content.replace(target_end_week_return, replacement_end_week_return)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
