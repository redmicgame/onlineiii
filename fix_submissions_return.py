import re
with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

pattern_grammys = r'''        grammySubmissions: \[\.\.\.\(state\.grammySubmissions \|\| \[\]\), \.\.\.submissions\],
        currentView: "game",'''
replacement_grammys = '''        grammySubmissions: [...(state.grammySubmissions || []), ...submissions],
        currentView: "inbox",'''

content = re.sub(pattern_grammys, replacement_grammys, content)

pattern_golden = r'''        goldenGlobeSubmissions: \[\.\.\.\(state\.goldenGlobeSubmissions \|\| \[\]\), \.\.\.submissions\],
        currentView: "game",'''
replacement_golden = '''        goldenGlobeSubmissions: [...(state.goldenGlobeSubmissions || []), ...submissions],
        currentView: "inbox",'''

content = re.sub(pattern_golden, replacement_golden, content)

pattern_oscars = r'''        oscarSubmissions: \[\.\.\.\(state\.oscarSubmissions \|\| \[\]\), \.\.\.submissions\],
        currentView: "game",'''
replacement_oscars = '''        oscarSubmissions: [...(state.oscarSubmissions || []), ...submissions],
        currentView: "inbox",'''

content = re.sub(pattern_oscars, replacement_oscars, content)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
