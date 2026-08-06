import re

with open('components/ChartHistoryView.tsx', 'r') as f:
    content = f.read()

content = content.replace("history = gameState.ukSinglesChartHistory;", "history = gameState.ukSinglesChartHistory || {};")

# Also for others
content = content.replace("history = gameState.electronicChartHistory;", "history = gameState.electronicChartHistory || {};")
content = content.replace("history = gameState.countryChartHistory;", "history = gameState.countryChartHistory || {};")
content = content.replace("history = gameState.hotPopSongsHistory;", "history = gameState.hotPopSongsHistory || {};")
content = content.replace("history = gameState.hotRapRnbHistory;", "history = gameState.hotRapRnbHistory || {};")
content = content.replace("history = gameState.albumChartHistory;", "history = gameState.albumChartHistory || {};")
content = content.replace("history = gameState.chartHistory;", "history = gameState.chartHistory || {};")


with open('components/ChartHistoryView.tsx', 'w') as f:
    f.write(content)
