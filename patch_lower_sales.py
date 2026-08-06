import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

content = content.replace("1.5, // 1.5x boost for albums", "1.0,")

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
