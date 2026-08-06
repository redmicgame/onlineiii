import re

with open('types.ts', 'r') as f:
    content = f.read()

content = content.replace('preReleaseSales?: number;', 'preReleaseSales?: number;\n  sales?: number;')

with open('types.ts', 'w') as f:
    f.write(content)
