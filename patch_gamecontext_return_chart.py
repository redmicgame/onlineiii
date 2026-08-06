import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target1 = """          spotifyAfrica: newSpotifyAfrica,
          radioOverallChart,"""
replace1 = """          spotifyAfrica: newSpotifyAfrica,
          ukSinglesChart: newUkSinglesChart,
          ukSinglesChartHistory: newUkSinglesChartHistory,
          radioOverallChart,"""

target2 = """        spotifyAfrica: newSpotifyAfrica,
        radioOverallChart,"""
replace2 = """        spotifyAfrica: newSpotifyAfrica,
        ukSinglesChart: newUkSinglesChart,
        ukSinglesChartHistory: newUkSinglesChartHistory,
        radioOverallChart,"""

content = content.replace(target1, replace1)
content = content.replace(target2, replace2)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
