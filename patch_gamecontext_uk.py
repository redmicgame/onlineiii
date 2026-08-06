import re

with open('context/GameContext.tsx', 'r') as f:
    lines = f.readlines()

new_lines = []
in_uk_chart = False
skip_brace = False

for line in lines:
    if line.strip() == '// --- UK OFFICIAL SINGLES CHART ---':
        in_uk_chart = True
    
    if in_uk_chart and 'if (state.date.year >= 2016) {' in line:
        continue # skip the if
    
    if in_uk_chart and '      }' in line and '// --- GENRE CHART CALCULATION ---' in ''.join(lines[lines.index(line):lines.index(line)+3]):
        in_uk_chart = False
        continue # skip the closing brace
        
    new_lines.append(line)

with open('context/GameContext.tsx', 'w') as f:
    f.writelines(new_lines)
