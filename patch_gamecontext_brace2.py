import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target = """              s.lastWeekRadioPlays = previousPlays;
              s.radioPlays = rPlays;
              rImpressions = rPlays * (Math.floor(Math.random() * 2600) + 4000);
              s.radioImpressions = rImpressions;
            }
            if (s.isOnUkRadio) {"""

replacement = """              s.lastWeekRadioPlays = previousPlays;
              s.radioPlays = rPlays;
              rImpressions = rPlays * (Math.floor(Math.random() * 2600) + 4000);
              s.radioImpressions = rImpressions;
            }
            
            if (s.isOnUkRadio) {"""

content = content.replace(target, replacement)

target_end = """              s.ukRadioPlays = rPlays;
            }
          }
        } else {"""

replacement_end = """              s.ukRadioPlays = rPlays;
            }
            } // Close if (s && (s.isOnRadio || s.isOnUkRadio))
          }
        } else {"""
content = content.replace(target_end, replacement_end)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
