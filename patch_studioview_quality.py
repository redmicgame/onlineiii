import re

with open('components/StudioView.tsx', 'r') as f:
    content = f.read()

old_code = """        for (const track of autoWriteData.tracks) {
            // Deduct cost per song
            totalCost += selectedStudio.cost;
            const newSong: Song = {
                id: crypto.randomUUID(),
                title: track.title,
                genre,
                subgenre: subgenre !== 'None' ? subgenre : undefined,
                quality: selectedStudio.qualityMultiplier * (Math.floor(Math.random() * 20) + 80),
                coverArt: autoWriteData.image || '',"""

new_code = """        for (const track of autoWriteData.tracks) {
            // Deduct cost per song
            totalCost += selectedStudio.cost;
            const [min, max] = selectedStudio.qualityRange;
            const newSong: Song = {
                id: crypto.randomUUID(),
                title: track.title,
                genre,
                subgenre: subgenre !== 'None' ? subgenre : undefined,
                quality: Math.floor(Math.random() * (max - min + 1)) + min,
                coverArt: autoWriteData.image || '',"""

if old_code in content:
    content = content.replace(old_code, new_code)
    print("Patched successfully!")
else:
    print("Match not found!")

with open('components/StudioView.tsx', 'w') as f:
    f.write(content)
