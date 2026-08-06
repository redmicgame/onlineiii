import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target = """        const top100 = eligibleUkContenders.slice(0, 100);
        newUkSinglesChart = [];
        const prevUkMap = new Map((state.ukSinglesChart || []).map(entry => [entry.uniqueId, entry]));
        newUkSinglesChartHistory = { ...state.ukSinglesChartHistory };

        top100.forEach((song, index) => {"""

replacement = """        const top50 = eligibleUkContenders.slice(0, 50);
        newUkSinglesChart = [];
        const prevUkMap = new Map((state.ukSinglesChart || []).map(entry => [entry.uniqueId, entry]));
        newUkSinglesChartHistory = { ...state.ukSinglesChartHistory };

        top50.forEach((song, index) => {"""

content = content.replace(target, replacement)
with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
