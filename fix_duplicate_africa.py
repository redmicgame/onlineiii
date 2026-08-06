import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target = 'const currentRegStreams = song.regionalStreams || { "US": 0, "Canada": 0, "UK": 0, "Latin America": 0, "Asia": 0, "Africa": 0, "Africa": 0 };'
replacement = 'const currentRegStreams = song.regionalStreams || { "US": 0, "Canada": 0, "UK": 0, "Latin America": 0, "Asia": 0, "Africa": 0 };'

if target in content:
    content = content.replace(target, replacement)
    with open('context/GameContext.tsx', 'w') as f:
        f.write(content)
    print("Fixed duplicate Africa key")
else:
    print("Not found exactly, trying regex")
    target_regex = r'const currentRegStreams = song\.regionalStreams \|\| \{ "US": 0, "Canada": 0, "UK": 0, "Latin America": 0, "Asia": 0, "Africa": 0, "Africa": 0 \};'
    if re.search(target_regex, content):
        content = re.sub(target_regex, replacement, content)
        with open('context/GameContext.tsx', 'w') as f:
            f.write(content)
        print("Fixed duplicate Africa key via regex")
    else:
        print("Still not found")

