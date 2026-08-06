import re
with open('types.ts', 'r') as f:
    content = f.read()

pattern = r'    \| "x"'
replacement = '    | "x"\n    | "twitch"'
content = content.replace(pattern, replacement)

with open('types.ts', 'w') as f:
    f.write(content)
