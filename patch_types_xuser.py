import re

with open('types.ts', 'r') as f:
    content = f.read()

content = content.replace('  bio?: string;', '  bio?: string;\n  headerImage?: string;')
content = content.replace('  | { type: "REMOVE_CUSTOM_FEATURE"; payload: { name: string } }', '  | { type: "REMOVE_CUSTOM_FEATURE"; payload: { name: string } }\n  | { type: "EDIT_X_PROFILE"; payload: { userId: string; name: string; bio: string; headerImage?: string; avatar?: string } }')

with open('types.ts', 'w') as f:
    f.write(content)
