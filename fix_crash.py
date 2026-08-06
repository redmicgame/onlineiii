import re
with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

# Fix 1: getRandomNpcName
pattern1 = r'''const getRandomNpcName = \(excludedNames: string\[\] = \[\], currentYear\?: number\): string => \{
  let name = "";
  let attempts = 0;
  const lowerExcluded = excludedNames\.map\(\(n\) => n\.toLowerCase\(\)\);'''

replacement1 = '''const getRandomNpcName = (excludedNames: (string | undefined)[] = [], currentYear?: number): string => {
  let name = "";
  let attempts = 0;
  const lowerExcluded = excludedNames.filter((n): n is string => !!n).map((n) => n.toLowerCase());'''

content = re.sub(pattern1, replacement1, content)

# Fix 2: golden globes calling site
pattern2 = r'''const npcName = getRandomNpcName\(state\.npcs\.map\(\(n\) => n\.name\), newDate\.year\);'''
replacement2 = '''const npcName = getRandomNpcName(state.npcs.map((n) => n.artist), newDate.year);'''

content = content.replace(pattern2, replacement2)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
