with open("context/GameContext.tsx", "r") as f:
    text = f.read()

import re
text = re.sub(r'\.join\("\\n"\\n"\);', r'.join("\\n");', text)
text = re.sub(r'\.join\("\\n"\\n"\\n"\);', r'.join("\\n");', text)
text = text.replace('join("\\n"\\n");', 'join("\\n");')
text = text.replace('join("\\n"\\n"\\n");', 'join("\\n");')
text = text.replace('join("\\n"\\n"', 'join("\\n"')
text = text.replace('join("\\n"\\n\\n"', 'join("\\n"')
text = text.replace('join("\\n"\\n', 'join("\\n"')
text = text.replace('join("\\n"\\n\\n', 'join("\\n"')
text = re.sub(r'\.join\(".*?"\\n"\);', r'.join("\\n");', text)
text = re.sub(r'\.join\("\\n"\\n"\);', r'.join("\\n");', text)
with open("context/GameContext.tsx", "w") as f:
    f.write(text)
