import re

with open('types.ts', 'r') as f:
    content = f.read()

content = content.replace(
    '  hasRedMicPro?: boolean;',
    '  hasRedMicPro?: boolean;\n  customFeatures?: { name: string; cost: number }[];'
)

with open('types.ts', 'w') as f:
    f.write(content)
