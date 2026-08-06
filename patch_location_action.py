with open('types.ts', 'r') as f:
    content = f.read()

action = """  | { type: "CHANGE_LOCATION"; payload: { location: "US" | "Canada" | "UK" | "Asia" | "Latin America" } }"""

content = content.replace('  | { type: "TOGGLE_OFFLINE_MODE" }', '  | { type: "TOGGLE_OFFLINE_MODE" }\n' + action)

with open('types.ts', 'w') as f:
    f.write(content)
