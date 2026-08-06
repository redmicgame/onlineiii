import re

with open('types.ts', 'r') as f:
    content = f.read()

content = content.replace('      type: "UPDATE_SONG_QUALITY";\n      payload: { songId: string; newQuality: number };\n    }', '      type: "UPDATE_SONG_QUALITY";\n      payload: { songId: string; newQuality: number };\n    }\n  | {\n      type: "UPDATE_SONG_TRAIT";\n      payload: { songId: string; newTrait: any };\n    }')

with open('types.ts', 'w') as f:
    f.write(content)
