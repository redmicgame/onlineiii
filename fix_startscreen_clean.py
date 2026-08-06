import re

with open('components/StartScreen.tsx', 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if "</>" in line:
        lines[i] = ""
    if "<>" in line:
        lines[i] = ""

for i, line in enumerate(lines):
    if "mode === 'solo' ? (" in line:
        lines[i] = "                        {mode === 'solo' ? (\n                            <>\n"
    elif "                        ) : (" in line:
        lines[i] = "                            </>\n                        ) : (\n                            <>\n"
    elif "                        )} " in line or "                        )}\n" in line:
        if i > 250: # the one near the end of the form
            lines[i] = "                            </>\n                        )}\n"
            
with open('components/StartScreen.tsx', 'w') as f:
    f.writelines(lines)
