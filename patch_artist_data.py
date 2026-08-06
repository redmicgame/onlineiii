import re

with open('types.ts', 'r') as f:
    content = f.read()

content = content.replace("  actingRoles?: ActingRole[];", "  actingRoles?: ActingRole[];\n  location?: string;\n  lastMoveDate?: GameDate;\n  yearlyIncomeForTax?: number;\n  taxPaidYear?: number;")

with open('types.ts', 'w') as f:
    f.write(content)
