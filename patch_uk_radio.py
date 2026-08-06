import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target = """              s.radioPlays = rPlays;
              rImpressions = rPlays * (Math.floor(Math.random() * 2600) + 4000);
              s.radioImpressions = rImpressions;
            }
          }
        } else {"""

replacement = """              s.radioPlays = rPlays;
              rImpressions = rPlays * (Math.floor(Math.random() * 2600) + 4000);
              s.radioImpressions = rImpressions;
            }
            if (s.isOnUkRadio) {
              const rFormat = s.ukRadioFormat || "pop";
              const weeksOn = s.ukWeeksOnRadio || 0;
              s.ukWeeksOnRadio = weeksOn + 1;
              const formatMultiplier = isFormatCompatible(song.genre, rFormat);
              const radioEraBoost = state.date.year < 2010 ? (state.date.year < 2000 ? 5.0 : 3.0) : 1.0;
              const previousPlays = s.ukRadioPlays || 0;
              const traitRadioBoost = s.trait === "Radio Hit" ? 3.0 : 1.0;
              const baseGrowth = 300 * (qualityBoost / 50) * labelBoost * formatMultiplier * radioEraBoost * traitRadioBoost;
              let targetPlays = previousPlays === 0 ? baseGrowth : previousPlays + baseGrowth;
              targetPlays += (song.regionalStreams?.["UK"] || 0) * 0.001 * traitRadioBoost; 
              const maxNaturalPlays = 25000 * formatMultiplier * radioEraBoost * traitRadioBoost;
              if (updatedArtistsData[artistId]?.isBlacklistedByLabel) targetPlays = 0;
              if (targetPlays > maxNaturalPlays) targetPlays = maxNaturalPlays;
              const pendingSpins = s.pendingUkRadioPromoSpins || 0;
              const spinIncrease = Math.min(pendingSpins, Math.floor(Math.random() * 1500) + 500);
              s.pendingUkRadioPromoSpins = pendingSpins - spinIncrease;
              let rPlays = Math.floor(targetPlays) + spinIncrease;
              if (weeksOn > 15 + Math.floor(qualityBoost / 2)) {
                  rPlays = Math.floor(rPlays * 0.85); 
              }
              if (rPlays < 0) rPlays = 0;
              if (rPlays < 50 && weeksOn > 4 && pendingSpins === 0) {
                  s.isOnUkRadio = false;
                  rPlays = 0;
              }
              s.ukRadioPlays = rPlays;
            }
          }
        } else {"""

content = content.replace(target, replacement)

# Need to update NPC songs radio play calculation to also generate ukRadioPlay
target_npc_radio = """            const formatMultiplier = isFormatCompatible(g, rFormat);
            const rPlays = Math.floor(
              (song.weeklyStreams / 2000) * formatMultiplier * npcRadioBoost,
            );
            song.radioPlays = rPlays;
            song.radioImpressions = rPlays * 4000;
            song.radioFormat = rFormat;
          }
        }"""
        
replacement_npc_radio = """            const formatMultiplier = isFormatCompatible(g, rFormat);
            const rPlays = Math.floor(
              (song.weeklyStreams / 2000) * formatMultiplier * npcRadioBoost,
            );
            song.radioPlays = rPlays;
            song.radioImpressions = rPlays * 4000;
            song.radioFormat = rFormat;
            
            if (state.date.year >= 2016) {
                // Approximate UK radio based on UK streams
                const ukStreams = song.regionalStreams?.["UK"] || (song.weeklyStreams * 0.1);
                song.ukRadioPlays = Math.floor((ukStreams / 2000) * formatMultiplier * npcRadioBoost);
            }
          }
        }"""

content = content.replace(target_npc_radio, replacement_npc_radio)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
