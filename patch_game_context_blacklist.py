import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """        const calculatedListeners = Math.floor(totalStreamsLastMonth * 0.1);
        const maxListeners = 148000000 + (artistId.charCodeAt(0) % 2000000);
        artistData.monthlyListeners = Math.min(
          calculatedListeners,
          maxListeners,
        );

        artistData.careerStage = newCareerStage;
        artistData.peakMonthlyListeners = Math.max("""

new_code = """        const calculatedListeners = Math.floor(totalStreamsLastMonth * 0.1);
        const maxListeners = 148000000 + (artistId.charCodeAt(0) % 2000000);
        artistData.monthlyListeners = Math.min(
          calculatedListeners,
          maxListeners,
        );

        // --- Label Blacklisting Logic ---
        if (
          artistData.contract &&
          !artistData.isBlacklistedByLabel &&
          artistData.contract.labelId &&
          artistData.contract.labelId !== "custom"
        ) {
          const label = LABELS.find((l) => l.id === artistData.contract!.labelId);
          if (label) {
            let blackListChance = 0;
            if (newCareerStage === "flop") {
              blackListChance += 0.05;
            }
            if (artistData.publicImage < 30) {
              blackListChance += 0.05;
            }
            if (artistData.publicImage < 10) {
              blackListChance += 0.1;
            }
            // Check for recent flop releases
            const recentReleases = artistData.releases
              .filter(r => r.isReleased && r.releaseDate && (newDate.year * 52 + newDate.week) - (r.releaseDate.year * 52 + r.releaseDate.week) <= 4)
              .sort((a, b) => (b.releaseDate!.year * 52 + b.releaseDate!.week) - (a.releaseDate!.year * 52 + a.releaseDate!.week));
            
            if (recentReleases.length > 0) {
              const recent = recentReleases[0];
              if (recent.review && recent.review.score < 7.0) {
                blackListChance += 0.05;
              }
            }

            if (blackListChance > 0) {
              if (label.tier === "Low") blackListChance *= 2.0;
              else if (label.tier === "Mid-Low") blackListChance *= 1.5;
              else if (label.tier === "Mid-high") blackListChance *= 0.5;
              else if (label.tier === "Top") blackListChance *= 0.2;

              if (Math.random() < blackListChance) {
                artistData.isBlacklistedByLabel = true;
                artistData.contract.durationWeeks += 156; // Extends contract by 3 years
              }
            }
          }
        }

        artistData.careerStage = newCareerStage;
        artistData.peakMonthlyListeners = Math.max("""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
