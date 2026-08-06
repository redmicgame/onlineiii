with open('components/InstagramView.tsx', 'r') as f:
    lines = f.readlines()

# Extract lines 18-79 (indices 17 to 78)
to_move = lines[17:79]

# Delete lines 18-79
del lines[17:79]

# Find where `const myPosts = activeArtistData.instagramPosts || [];` is
insert_index = 0
for i, line in enumerate(lines):
    if "const myPosts = activeArtistData.instagramPosts || [];" in line:
        insert_index = i + 1
        break

# Insert the extracted lines
lines[insert_index:insert_index] = to_move

with open('components/InstagramView.tsx', 'w') as f:
    f.writelines(lines)
