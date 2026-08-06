import re

with open("context/GameContext.tsx", "r") as f:
    ctx = f.read()

ctx = ctx.replace('let baseStreams = song.quality ** 2 * 250;', 'let baseStreams = song.quality ** 2 * 80;')

with open("context/GameContext.tsx", "w") as f:
    f.write(ctx)

