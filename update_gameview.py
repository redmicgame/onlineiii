import re
with open('types.ts', 'r') as f:
    content = f.read()

pattern = r'  \| "submit_for_golden_globes"'
replacement = '  | "submit_for_golden_globes"\n  | "kaiStreamSetup"'
content = content.replace(pattern, replacement)

with open('types.ts', 'w') as f:
    f.write(content)
