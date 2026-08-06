with open('components/SpotifyReleaseDetailView.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    '<div className="flex-grow">',
    '<div className="flex-grow min-w-0">'
)

content = content.replace(
    '<p className="font-semibold">{song.title}</p>',
    '<p className="font-semibold truncate">{song.title}</p>'
)

with open('components/SpotifyReleaseDetailView.tsx', 'w') as f:
    f.write(content)
