import re

with open('types.ts', 'r') as f:
    content = f.read()

target = """  promoQuality: "high" | "medium" | "low";
  weeklyCost: number;"""
replace = """  promoQuality: "high" | "medium" | "low";
  region?: "Global" | "US" | "Canada" | "UK" | "Latin America" | "Asia" | "Africa";
  weeklyCost: number;"""

content = content.replace(target, replace)

with open('types.ts', 'w') as f:
    f.write(content)
