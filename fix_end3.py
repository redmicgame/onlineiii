with open('components/StartScreen.tsx', 'r') as f:
    content = f.read()

# Only replace the last occurrence of );
idx = content.rfind(');')
if idx != -1:
    content = content[:idx] + '</div>\n' + content[idx:]

with open('components/StartScreen.tsx', 'w') as f:
    f.write(content)
