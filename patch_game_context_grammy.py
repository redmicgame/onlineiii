import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """            if (isValid) {
              contenders.push({
                id: sub.itemId,
                name: sub.itemName,
                artistName: artistProfile.name,
                isPlayer: true,
                score,
                coverArt,
              });
            }"""

new_code = """            if (isValid) {
              if (artistData.isBlacklistedByLabel) {
                 score = score * 0.1; // Extremely hard to secure nominations
              }
              contenders.push({
                id: sub.itemId,
                name: sub.itemName,
                artistName: artistProfile.name,
                isPlayer: true,
                score,
                coverArt,
              });
            }"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
