import re

with open('components/UKChartView.tsx', 'r') as f:
    content = f.read()

content = content.replace("dispatch({ type: 'CHANGE_VIEW', payload: 'spotifyChart' })", "dispatch({ type: 'CHANGE_VIEW', payload: 'charts' })")

with open('components/UKChartView.tsx', 'w') as f:
    f.write(content)
