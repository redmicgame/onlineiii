import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

# Replace references
content = content.replace('p.type === "Album (Deluxe)" && p.originalReleaseId', 'p.standardEditionId')
content = content.replace('deluxeMap.set(p.originalReleaseId, p)', 'deluxeMap.set(p.standardEditionId, p)')
content = content.replace('r.type === "Album (Deluxe)" && r.originalReleaseId', 'r.standardEditionId')
content = content.replace('r.type === "Album (Deluxe)" ||', '')

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
