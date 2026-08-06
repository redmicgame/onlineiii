import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target = """              weeklyStreams: song.regionalStreams?.["UK"] || 0,
              radioPlays: song.ukRadioPlays || 0,
            });
        });
      }

      // --- GENRE CHART CALCULATION ---"""

replace = """              weeklyStreams: song.regionalStreams?.["UK"] || 0,
              radioPlays: song.ukRadioPlays || 0,
            });
        });

      // --- GENRE CHART CALCULATION ---"""

content = content.replace(target, replace)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
