import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target = """  spotifyGlobal: [],"""
replace = """  spotifyGlobal: [],
  ukSinglesChart: [],
  ukSinglesChartHistory: {},"""

content = content.replace(target, replace)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
