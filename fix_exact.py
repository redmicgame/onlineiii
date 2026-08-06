with open("context/GameContext.tsx", "r") as f:
    text = f.read()

import re
text = re.sub(r'\.join\("\\n"\n\s*"\);', r'.join("\\n");', text)

with open("context/GameContext.tsx", "w") as f:
    f.write(text)
