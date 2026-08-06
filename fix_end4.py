with open('components/StartScreen.tsx', 'r') as f:
    content = f.read()

import re
content = re.sub(r'(\s*\);\s*\};\s*export default StartScreen;)', r'\n            </div>\1', content)

with open('components/StartScreen.tsx', 'w') as f:
    f.write(content)
