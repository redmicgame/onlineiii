import re

with open('components/SpotifyView.tsx', 'r') as f:
    content = f.read()

content = content.replace("import ChevronLeftIcon from './icons/ChevronLeftIcon';", "import ChevronLeftIcon from './icons/ChevronLeftIcon';\nimport ChevronRightIcon from './icons/ChevronRightIcon';")

with open('components/SpotifyView.tsx', 'w') as f:
    f.write(content)
