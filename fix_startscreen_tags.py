import re

with open('components/StartScreen.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "mode === 'solo' ? (" in line:
        lines[i] = "                        {mode === 'solo' ? (\n                            <>\n"
    if "mode === 'group' ? (" in line or "                        ) : (" in line:
        if "                        ) : (" in line:
            lines[i] = "                            </>\n                        ) : (\n                            <>\n"

# also add `</>` right before the end of the form
for i in range(len(lines)-1, -1, -1):
    if "</form>" in lines[i]:
        lines.insert(i, "                            </>\n                        )}\n")
        break

# The previous script broke it, let's just make sure there are no syntax errors
with open('components/StartScreen.tsx', 'w') as f:
    f.writelines(lines)
