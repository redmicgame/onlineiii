with open('components/InstagramView.tsx', 'r') as f:
    lines = f.readlines()

# The incorrect block is lines 17 to 78 (inclusive).
# Let's extract it.
extracted_block = lines[17:79]

# Delete from InstagramFeedPost
del lines[17:79]

# We need to insert this block into InstagramView, right after `const username = activeArtist.name.replace(/\s/g, '').toLowerCase();` or similar.
# Let's find the start of InstagramView's `return (`
insert_index = -1
for i, line in enumerate(lines):
    if "const followers = activeArtistData.instagramFollowers || 0;" in line:
        insert_index = i
        break

if insert_index != -1:
    lines[insert_index:insert_index] = extracted_block

with open('components/InstagramView.tsx', 'w') as f:
    f.writelines(lines)
