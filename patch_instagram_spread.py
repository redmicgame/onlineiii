import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """      return {
        ...state,
        xPosts: [popBaseXPost, ...state.xPosts],
        artistsData: {"""

new_code = """      return {
        ...state,
        xPosts: [popBaseXPost, ...(state.xPosts || [])],
        artistsData: {"""

if old_code in content:
    content = content.replace(old_code, new_code)
    print("Patched successfully!")
else:
    print("Match not found!")

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
