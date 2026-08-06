import re

with open('components/TourDetailView.tsx', 'r') as f:
    text = f.read()

pattern = r'''    const handleSaveSetlist = \(\) => \{'''
replacement = r'''    const handleSaveSetlist = () => {
        console.log("Saving setlist. Temp setlist:", tempSetlist);'''

text = re.sub(pattern, replacement, text)

with open('components/TourDetailView.tsx', 'w') as f:
    f.write(text)
