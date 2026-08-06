import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

# Inside PROGRESS_WEEK, let's find the end of the artist loop to sum up weekly income.
# Or better, just add a weeklyIncome variable and add it to yearlyIncomeForTax at the end of the artistData update.

# Actually, I'll just add the tax deduction at week 50.
