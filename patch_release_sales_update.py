import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """          let weeklyActivity = weeklySES + totalWeeklySales;
          if (weeklyActivity > 4500000) {
            weeklyActivity = Math.floor(4500000 + Math.random() * 500000);
          }"""

new_code = """          let weeklyActivity = weeklySES + totalWeeklySales;
          if (weeklyActivity > 4500000) {
            weeklyActivity = Math.floor(4500000 + Math.random() * 500000);
          }
          
          release.sales = (release.sales || 0) + totalWeeklySales;"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
