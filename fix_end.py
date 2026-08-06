with open('components/StartScreen.tsx', 'r') as f:
    content = f.read()

content = content.replace('            );', '        </div>\n    );')

with open('components/StartScreen.tsx', 'w') as f:
    f.write(content)
