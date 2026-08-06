import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """      for (const artistId in updatedArtistsData) {
        const artistData = updatedArtistsData[artistId];
        const startingMoneyForWeek = artistData.money;
        const currentAbsoluteWeek = newDate.year * 52 + newDate.week;
        
        // Hiatus & fans asking for comeback logic
        const releases = artistData.releases || [];
        const lastRelease = releases.length > 0 ? releases[releases.length - 1] : null;
        if (lastRelease) {
            const lastReleaseAbs = lastRelease.releaseDate.year * 52 + lastRelease.releaseDate.week;
            const weeksSinceRelease = currentAbsoluteWeek - lastReleaseAbs;"""

new_code = """      for (const artistId in updatedArtistsData) {
        const artistData = updatedArtistsData[artistId];
        const startingMoneyForWeek = artistData.money;
        const currentAbsWeek = newDate.year * 52 + newDate.week;
        
        // Hiatus & fans asking for comeback logic
        const releases = artistData.releases || [];
        const recentRelease = releases.length > 0 ? releases[releases.length - 1] : null;
        if (recentRelease) {
            const recentReleaseAbs = recentRelease.releaseDate.year * 52 + recentRelease.releaseDate.week;
            const weeksSinceRelease = currentAbsWeek - recentReleaseAbs;"""

content = content.replace(old_code, new_code)

old_code_2 = """        if (artistData.isHiatus && artistData.hiatusStartYear !== undefined && artistData.hiatusStartWeek !== undefined) {
             const hiatusStartAbs = artistData.hiatusStartYear * 52 + artistData.hiatusStartWeek;
             const hiatusWeeks = currentAbsoluteWeek - hiatusStartAbs;"""

new_code_2 = """        if (artistData.isHiatus && artistData.hiatusStartYear !== undefined && artistData.hiatusStartWeek !== undefined) {
             const hiatusStartAbs = artistData.hiatusStartYear * 52 + artistData.hiatusStartWeek;
             const hiatusWeeks = currentAbsWeek - hiatusStartAbs;"""

content = content.replace(old_code_2, new_code_2)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
