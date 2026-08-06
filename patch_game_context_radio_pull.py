import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """              } else if (s.weeksOnRadio >= 6 && rPlays < 100) {
                removedReason = `it failed to gain traction`;
              }"""

new_code = """              } else if (s.weeksOnRadio >= 6 && rPlays < 100) {
                removedReason = `it failed to gain traction`;
              }
              
              if (updatedArtistsData[artistId]?.isBlacklistedByLabel) {
                 removedReason = "your label blacklisted you and pulled the song from all stations";
              }"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
