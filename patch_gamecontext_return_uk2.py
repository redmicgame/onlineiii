import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target1 = """      const allContenders = allContendersRaw.map((song, index) => {
        let rPlays = 0;
        let rImpressions = 0;
        let isOnRadio = false;
        let rFormat = "pop";
"""
replace1 = """      const allContenders = allContendersRaw.map((song, index) => {
        let rPlays = 0;
        let rImpressions = 0;
        let isOnRadio = false;
        let rFormat = "pop";
        let pIsOnUkRadio = false;
        let pUkRadioPlays = 0;
        let pUkRadioFormat = "pop";
"""

target2 = """              s.ukRadioPlays = rPlays;
            }
            } // Close if (s && (s.isOnRadio || s.isOnUkRadio))"""
replace2 = """              s.ukRadioPlays = rPlays;
            }
              
              if (s.isOnUkRadio) {
                  pIsOnUkRadio = s.isOnUkRadio;
                  pUkRadioPlays = s.ukRadioPlays || 0;
                  pUkRadioFormat = s.ukRadioFormat || "pop";
              }
            } // Close if (s && (s.isOnRadio || s.isOnUkRadio))"""

target3 = """        return {
          ...song,
          isOnRadio,
          radioPlays: rPlays,
          radioImpressions: rImpressions,
          radioFormat: rFormat,
          ...( !song.isPlayerSong ? { isOnUkRadio, ukRadioPlays, ukRadioFormat } : {} ),
        };
      });"""

replace3 = """        return {
          ...song,
          isOnRadio,
          radioPlays: rPlays,
          radioImpressions: rImpressions,
          radioFormat: rFormat,
          ...( !song.isPlayerSong ? { isOnUkRadio, ukRadioPlays, ukRadioFormat } : { isOnUkRadio: pIsOnUkRadio, ukRadioPlays: pUkRadioPlays, ukRadioFormat: pUkRadioFormat } ),
        };
      });"""

content = content.replace(target1, replace1)
content = content.replace(target2, replace2)
content = content.replace(target3, replace3)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
