with open('components/SpotifyView.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<p className="font-semibold text-white text-lg">{release.title}</p>',
    '<p className="font-semibold text-white text-lg truncate">{release.title}</p>'
)

with open('components/SpotifyView.tsx', 'w') as f:
    f.write(content)
