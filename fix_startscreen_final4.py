with open('components/StartScreen.tsx', 'r') as f:
    content = f.read()

content = content.replace('                            </>\n                        )}\n                            </>\n                        )}\n', '                            </>\n                        )}\n')

with open('components/StartScreen.tsx', 'w') as f:
    f.write(content)
