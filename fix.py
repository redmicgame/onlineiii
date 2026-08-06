with open("context/GameContext.tsx", "r") as f:
    text = f.read()

text = text.replace('join("\\n\\"");', 'join("\\n");')
text = text.replace('join("\\\\n\\"");', 'join("\\n");')
text = text.replace('join("\\\\n");', 'join("\\n");')
text = text.replace('join("\n\\"");', 'join("\\n");')

with open("context/GameContext.tsx", "w") as f:
    f.write(text)
