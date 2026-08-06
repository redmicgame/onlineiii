import re

with open('components/CatalogView.tsx', 'r') as f:
    content = f.read()

# Fix singles streams calculation
old_singles = """                return { ...s, streams: s.streams + (merchUnits * 150), sales: s.sales || 0 };"""
new_singles = """                return { ...s, streams: s.streams, sales: (s.sales || 0) + merchUnits };"""
content = content.replace(old_singles, new_singles)

# Fix albums streams calculation
old_albums = """                return { ...release, streams: releaseStreams + (merchUnits * 1500), sales: releaseSales };"""
new_albums = """                return { ...release, streams: releaseStreams, sales: releaseSales + merchUnits };"""
content = content.replace(old_albums, new_albums)

with open('components/CatalogView.tsx', 'w') as f:
    f.write(content)
