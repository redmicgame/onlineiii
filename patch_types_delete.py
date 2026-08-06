import re

with open('types.ts', 'r') as f:
    content = f.read()

new_actions = """  | { type: "DELETE_ARTIST_IMAGE"; payload: string }
  | { type: "DELETE_INSTAGRAM_POST"; payload: { postId: string } }
  | { type: "DELETE_TIKTOK_VIDEO"; payload: { videoId: string } }"""

content = content.replace('  | { type: "DELETE_ARTIST_IMAGE"; payload: string }', new_actions)

with open('types.ts', 'w') as f:
    f.write(content)
