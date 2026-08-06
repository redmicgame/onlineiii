import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """              let targetPlays = previousPlays === 0 ? baseGrowth : previousPlays + baseGrowth;
              
              targetPlays += song.weeklyStreams * 0.0005 * traitRadioBoost; // stream impact also boosted
              
              const maxNaturalPlays = 25000 * formatMultiplier * radioEraBoost * traitRadioBoost;"""

new_code = """              let targetPlays = previousPlays === 0 ? baseGrowth : previousPlays + baseGrowth;
              
              targetPlays += song.weeklyStreams * 0.0005 * traitRadioBoost; // stream impact also boosted
              
              const maxNaturalPlays = 25000 * formatMultiplier * radioEraBoost * traitRadioBoost;
              
              if (updatedArtistsData[artistId]?.isBlacklistedByLabel) {
                 targetPlays = 0;
              }"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
