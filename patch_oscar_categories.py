import re

with open('types.ts', 'r') as f:
    content = f.read()

content = content.replace(
    'name: "Best Original Song" | "Best Actor/Actress (Leading Role)" | "Best Supporting Actor/Actress (Supporting Role)";',
    'name: "Best Original Song" | "Best Actor/Actress" | "Best Supporting Actor/Actress" | "Best Voice Actor/Actress";'
)
content = content.replace(
    'category: "Best Original Song";',
    'category: "Best Original Song" | "Best Actor/Actress" | "Best Supporting Actor/Actress" | "Best Voice Actor/Actress";'
)

with open('types.ts', 'w') as f:
    f.write(content)
