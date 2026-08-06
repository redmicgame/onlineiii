import re

with open('server.ts', 'r') as f:
    content = f.read()

old_code = """import spotifyUrlInfo from 'spotify-url-info';
import fetch from 'isomorphic-unfetch';
const spotify = spotifyUrlInfo(fetch as any);"""

new_code = """"""

if old_code in content:
    content = content.replace(old_code, new_code)
    print("Patched successfully!")
else:
    print("Match not found!")

with open('server.ts', 'w') as f:
    f.write(content)
