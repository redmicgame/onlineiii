import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target1 = """            const songPromo = artistData.promotions.find(
              (p) => p.itemId === song.id && p.itemType === "song",
            );
            if (songPromo) {
              weeklyStreams = Math.floor(
                weeklyStreams * songPromo.boostMultiplier,
              );
            }"""
replace1 = """            const songPromo = artistData.promotions.find(
              (p) => p.itemId === song.id && p.itemType === "song",
            );
            if (songPromo) {
              if (songPromo.region && songPromo.region !== "Global") {
                  // Handled later when splitting regional streams
              } else {
                  weeklyStreams = Math.floor(
                    weeklyStreams * songPromo.boostMultiplier,
                  );
              }
            }"""

target2 = """            if (gLower.includes("electronic") || gLower.includes("dance") || gLower.includes("rock") || gLower.includes("indie")) wUK *= 2.0;
            
            let totalPop = wUS + wCanada + wUK + wLatin + wAsia + wAfrica;"""
replace2 = """            if (gLower.includes("electronic") || gLower.includes("dance") || gLower.includes("rock") || gLower.includes("indie")) wUK *= 2.0;
            
            if (songPromo && songPromo.region && songPromo.region !== "Global") {
                if (songPromo.region === "US") wUS *= songPromo.boostMultiplier;
                if (songPromo.region === "Canada") wCanada *= songPromo.boostMultiplier;
                if (songPromo.region === "UK") wUK *= songPromo.boostMultiplier;
                if (songPromo.region === "Latin America") wLatin *= songPromo.boostMultiplier;
                if (songPromo.region === "Asia") wAsia *= songPromo.boostMultiplier;
                if (songPromo.region === "Africa") wAfrica *= songPromo.boostMultiplier;
                
                weeklyStreams = Math.floor(weeklyStreams * (1 + (songPromo.boostMultiplier - 1) * 0.3)); // Overall weekly streams gets a slight boost since it's regional
            }
            
            let totalPop = wUS + wCanada + wUK + wLatin + wAsia + wAfrica;"""

content = content.replace(target1, replace1)
content = content.replace(target2, replace2)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
