import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "eraConfigTmp2.marketShare.digital *\n              1.5,",
    "eraConfigTmp2.marketShare.digital *\n              1.1,"
)
content = content.replace("); // 1.5x boost for albums", "); // Lowered album sales")

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
