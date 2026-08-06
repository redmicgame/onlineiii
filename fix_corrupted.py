import re
with open("context/GameContext.tsx", "r") as f:
    text = f.read()

text = text.replace('collabs.join("\\n" and ")', 'collabs.join(", ")')
text = text.replace('collabs.join("\\n", ")', 'collabs.join(", ")')
text = text.replace('baseSong.features.join("\\n", ")', 'baseSong.features.join(", ")')
text = text.replace('nominatedCategories.join("\\n", ")', 'nominatedCategories.join(", ")')

with open("context/GameContext.tsx", "w") as f:
    f.write(text)
