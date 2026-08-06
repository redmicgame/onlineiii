import re

with open('components/SpotifyView.tsx', 'r') as f:
    content = f.read()

content = content.replace("import ChevronRightIcon from './icons/ChevronRightIcon';\n", "")

with open('components/SpotifyView.tsx', 'w') as f:
    f.write(content)
