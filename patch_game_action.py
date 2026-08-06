import re

with open('types.ts', 'r') as f:
    content = f.read()

content = content.replace(
    '  | { type: "CREATE_CUSTOM_AWARD_SHOW"; payload: { customAwardShow: NonNullable<GameState[\'customAwardShow\']> } }',
    '  | { type: "CREATE_CUSTOM_AWARD_SHOW"; payload: { customAwardShow: NonNullable<GameState[\'customAwardShow\']> } }\n  | { type: "ADD_CUSTOM_FEATURE"; payload: { name: string; cost: number } }\n  | { type: "REMOVE_CUSTOM_FEATURE"; payload: { name: string } }'
)

with open('types.ts', 'w') as f:
    f.write(content)
