import re
with open('components/StartScreen.tsx', 'r') as f:
    content = f.read()

content = re.sub(r'<\/>\s*\)\}\s*<\/>\s*\)\}', r'</>\n                        )}', content)

with open('components/StartScreen.tsx', 'w') as f:
    f.write(content)
