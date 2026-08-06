with open('types.ts', 'r') as f:
    content = f.read()

new_fields = """  location?: "US" | "Canada" | "UK" | "Asia" | "Latin America";
  lastMoveDate?: GameDate;
  yearlyIncome?: number;"""

content = content.replace("  money: number;", f"  money: number;\n{new_fields}")

with open('types.ts', 'w') as f:
    f.write(content)
