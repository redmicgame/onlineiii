import re
with open('components/SubmitForGoldenGlobesView.tsx', 'r') as f:
    content = f.read()

content = content.replace("const eligibleMovies = eligibleActingRoles.filter(r => r.type === 'Movie');", 
"const eligibleMovies = eligibleActingRoles.filter(r => r.type === 'Movie');\n    const eligibleLeading = eligibleActingRoles.filter(r => (!r.roleType || r.roleType === 'Leading Role') && r.type !== 'Voice Acting');\n    const eligibleSupporting = eligibleActingRoles.filter(r => r.roleType === 'Supporting Role' && r.type !== 'Voice Acting');\n    const eligibleVoice = eligibleActingRoles.filter(r => r.type === 'Voice Acting');")

content = content.replace("options: eligibleActingRoles.map(r => ({id: r.id, name: r.title})) },", "options: eligibleLeading.map(r => ({id: r.id, name: r.title})) },", 1)
content = content.replace("options: eligibleActingRoles.map(r => ({id: r.id, name: r.title})) },", "options: eligibleSupporting.map(r => ({id: r.id, name: r.title})) },", 1)
content = content.replace("options: eligibleActingRoles.map(r => ({id: r.id, name: r.title})) },", "options: eligibleVoice.map(r => ({id: r.id, name: r.title})) },", 1)

with open('components/SubmitForGoldenGlobesView.tsx', 'w') as f:
    f.write(content)
print("done")
