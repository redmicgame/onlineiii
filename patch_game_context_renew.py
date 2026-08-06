import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """      const updatedData = { ...artistData, contract: newContract };"""

new_code = """      const updatedData = { ...artistData, contract: newContract, isBlacklistedByLabel: false };"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
