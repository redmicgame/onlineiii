import re
with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

content = content.replace('join("\\n\\"");', 'join("\\n");')
content = content.replace('join("\\n\\n");', 'join("\\n");')
# also fix any literal newlines inside join
content = re.sub(r'\.join\("\n"\);', r'.join("\\n");', content)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
