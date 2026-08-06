import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """      const promoBudget = Math.floor(
        avgQuality * 5000 * labelMultiplier * releaseTypeMultiplier,
      );"""

new_code = """      const promoBudget = activeData.isBlacklistedByLabel ? 0 : Math.floor(
        avgQuality * 5000 * labelMultiplier * releaseTypeMultiplier,
      );"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
