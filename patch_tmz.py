import re

with open('components/TmzArticleView.tsx', 'r') as f:
    content = f.read()

content = content.replace("dispatch({ type: 'CHANGE_VIEW', payload: 'x' });", "dispatch({ type: 'CHANGE_VIEW', payload: 'game' });")

with open('components/TmzArticleView.tsx', 'w') as f:
    f.write(content)
