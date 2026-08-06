import re

with open('types.ts', 'r') as f:
    content = f.read()

content = content.replace("export type GameAction =", "export type GameAction =\n  | { type: \"UPDATE_CUSTOM_IMAGES\"; payload: Record<string, string> }")

with open('types.ts', 'w') as f:
    f.write(content)
