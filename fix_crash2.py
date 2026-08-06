import re
with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

pattern2 = '''const npcName = getRandomNpcName(state.npcs.map((n) => n.name), newDate.year);'''
replacement2 = '''const npcName = getRandomNpcName(state.npcs.map((n) => n.artist), newDate.year);'''

content = content.replace(pattern2, replacement2)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
