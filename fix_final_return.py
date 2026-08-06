import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target = """        spotifyGlobal: newSpotifyGlobal,
        radioOverallChart,"""

replacement = """        spotifyGlobal: newSpotifyGlobal,
        spotifyUS: newSpotifyUS,
        spotifyCanada: newSpotifyCanada,
        spotifyUK: newSpotifyUK,
        spotifyLatin: newSpotifyLatin,
        spotifyAsia: newSpotifyAsia,
        spotifyAfrica: newSpotifyAfrica,
        radioOverallChart,"""

if target in content:
    content = content.replace(target, replacement)
    with open('context/GameContext.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Failed to find target")

