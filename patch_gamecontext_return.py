import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target = """        return {
          ...song,
          isOnRadio,
          radioPlays: rPlays,
          radioImpressions: rImpressions,
          radioFormat: rFormat,
        };
      });"""

replace = """        let isOnUkRadio = false;
        let ukRadioPlays = 0;
        let ukRadioFormat = undefined;

        if (song.isPlayerSong) {
            // Already handled internally
        } else {
            if (isOnRadio) {
                isOnUkRadio = true;
                ukRadioPlays = Math.floor(rPlays * 0.15);
                ukRadioFormat = rFormat;
            }
        }

        return {
          ...song,
          isOnRadio,
          radioPlays: rPlays,
          radioImpressions: rImpressions,
          radioFormat: rFormat,
          ...( !song.isPlayerSong ? { isOnUkRadio, ukRadioPlays, ukRadioFormat } : {} ),
        };
      });"""

content = content.replace(target, replace)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
