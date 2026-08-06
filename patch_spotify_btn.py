import re

with open('components/SpotifyView.tsx', 'r') as f:
    content = f.read()

# Pattern to remove
pattern = r'                {/\* Charts Button \*/}.*?                </button>\n\n'
new_content = re.sub(pattern, '', content, flags=re.DOTALL)

with open('components/SpotifyView.tsx', 'w') as f:
    f.write(new_content)
