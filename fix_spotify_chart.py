import re
with open('components/SpotifyChartView.tsx', 'r') as f:
    content = f.read()

pattern = r'const basePreSaves = \(\(popularity \* 15000\) \+ \(totalSongStreams \* 0\.05\)\) \* \(1 \+ \(weeksSinceSubmit \* 0\.25\)\);'
replacement = 'const basePreSaves = ((popularity * 15000)) * (1 + (weeksSinceSubmit * 0.25));'

content = content.replace(pattern, replacement)

with open('components/SpotifyChartView.tsx', 'w') as f:
    f.write(content)
