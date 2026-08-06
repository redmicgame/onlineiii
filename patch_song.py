import re

with open('types.ts', 'r') as f:
    content = f.read()

content = content.replace("  pendingRadioPromoSpins?: number;", "  pendingRadioPromoSpins?: number;\n  hasRadioPromo?: boolean;")

with open('types.ts', 'w') as f:
    f.write(content)
