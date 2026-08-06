import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target = """          spotifyCanada: newSpotifyCanada,
          spotifyUK: newSpotifyUK,
          spotifyLatin: newSpotifyLatin,
          spotifyAsia: newSpotifyAsia,
          spotifyAfrica: newSpotifyAfrica,
          spotifyCanada: newSpotifyCanada,
          spotifyUK: newSpotifyUK,
          spotifyLatin: newSpotifyLatin,
          spotifyAsia: newSpotifyAsia,"""

replacement = """          spotifyCanada: newSpotifyCanada,
          spotifyUK: newSpotifyUK,
          spotifyLatin: newSpotifyLatin,
          spotifyAsia: newSpotifyAsia,
          spotifyAfrica: newSpotifyAfrica,"""

if target in content:
    content = content.replace(target, replacement)
    with open('context/GameContext.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Failed to find target")

