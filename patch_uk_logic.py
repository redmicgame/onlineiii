import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target = """      // --- UK OFFICIAL SINGLES CHART ---
      let newUkSinglesChart = state.ukSinglesChart || [];
      let newUkSinglesChartHistory = state.ukSinglesChartHistory || {};
      
      if (state.date.year >= 2016) {
        const sortedUkContenders = [...allContenders].sort((a, b) => {
            const aUkStreams = a.regionalStreams?.["UK"] || 0;
            const aUkRadio = a.ukRadioPlays || 0;
            // 50% UK streams, 50% UK radio airplay (weighting radio to roughly equal streams)
            const aPoints = (aUkStreams * 0.5) + (aUkRadio * 2000 * 0.5); 
            
            const bUkStreams = b.regionalStreams?.["UK"] || 0;
            const bUkRadio = b.ukRadioPlays || 0;
            const bPoints = (bUkStreams * 0.5) + (bUkRadio * 2000 * 0.5);
            
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

replacement = """      // --- UK OFFICIAL SINGLES CHART ---
      let newUkSinglesChart: ChartEntry[] = state.ukSinglesChart || [];
      let newUkSinglesChartHistory: ChartHistory = state.ukSinglesChartHistory || {};
      
      if (state.date.year >= 2016) {
        const sortedUkContenders = [...allContenders].map(song => {
            const aUkStreams = song.regionalStreams?.["UK"] || 0;
            const aUkRadio = song.ukRadioPlays || 0;
            const points = (aUkStreams * 0.5) + (aUkRadio * 2000 * 0.5);
            return { ...song, _ukPoints: points };
        }).sort((a, b) => b._ukPoints - a._ukPoints);
        
        const eligibleUkContenders = sortedUkContenders.filter((song, index) => {
            const potentialRank = index + 1;
            const history = newUkSinglesChartHistory[song.uniqueId];
            if (history && history.weeksOnChart >= 52 && potentialRank > 25) return false;
            if (history && history.weeksOnChart >= 20 && potentialRank > 50) return false;
            return true;
        });

        const top100 = eligibleUkContenders.slice(0, 100);
        newUkSinglesChart = [];
        const prevUkMap = new Map((state.ukSinglesChart || []).map(entry => [entry.uniqueId, entry]));
        newUkSinglesChartHistory = { ...state.ukSinglesChartHistory };

        top100.forEach((song, index) => {
            const rank = index + 1;
            const history = newUkSinglesChartHistory[song.uniqueId];
            const prevChartEntry = prevUkMap.get(song.uniqueId);

            if (history) {
              history.weeksOnChart += 1;
              history.lastRank = rank;
              if (rank < history.peak) history.peak = rank;
              if (rank === 1) history.weeksAtNo1 = (history.weeksAtNo1 || 0) + 1;
              if (history.chartRun) history.chartRun.push(rank);
              else history.chartRun = [rank];
            } else {
              newUkSinglesChartHistory[song.uniqueId] = {
                weeksOnChart: 1,
                peak: rank,
                lastRank: rank,
                weeksAtNo1: rank === 1 ? 1 : 0,
                chartRun: [rank],
                firstEntered: { year: newDate.year, week: newDate.week },
              };
            }

            newUkSinglesChart.push({
              rank: rank,
              lastWeek: prevChartEntry?.rank ?? null,
              peak: newUkSinglesChartHistory[song.uniqueId].peak,
              weeksOnChart: newUkSinglesChartHistory[song.uniqueId].weeksOnChart,
              title: song.title,
              artist: song.artist,
              coverArt: song.coverArt,
              isPlayerSong: song.isPlayerSong,
              songId: song.songId,
              uniqueId: song.uniqueId,
              weeklyStreams: song.regionalStreams?.["UK"] || 0,
              radioPlays: song.ukRadioPlays || 0,
            });
        });
      }"""
content = content.replace(target, replacement)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
