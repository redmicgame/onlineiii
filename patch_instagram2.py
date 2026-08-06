with open('components/InstagramView.tsx', 'r') as f:
    lines = f.readlines()

# The lines that were inserted at 168 (index 168 to 168+61)
to_move = lines[168:230]
del lines[168:230]

# Put them back at index 17
lines[17:17] = to_move

# Now remove line 17 (`if (selectedPost) {`) and its matching `}` at line 79.
# Actually let's just write the code out completely correctly.
# Wait, let's just save this and verify it matches the original.
with open('components/InstagramView.tsx', 'w') as f:
    f.writelines(lines)
