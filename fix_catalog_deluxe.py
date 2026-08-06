import re

with open('components/CatalogView.tsx', 'r') as f:
    content = f.read()

# Replace references to originalReleaseId with standardEditionId
content = content.replace("originalReleaseId", "standardEditionId")
content = content.replace("p.type === 'Album (Deluxe)'", "p.standardEditionId")
content = content.replace("r.type === 'Album (Deluxe)'", "r.standardEditionId")

with open('components/CatalogView.tsx', 'w') as f:
    f.write(content)
