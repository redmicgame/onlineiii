import re

with open('components/SpotifyForArtistsView.tsx', 'r') as f:
    content = f.read()

target = "    let hash = 0;"
replacement = "    if (!song || !song.id) return [];\n    let hash = 0;"

if target in content:
    content = content.replace(target, replacement)
    with open('components/SpotifyForArtistsView.tsx', 'w') as f:
        f.write(content)
    print("Safe patch applied")
else:
    print("Not found")

