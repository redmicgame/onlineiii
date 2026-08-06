import re

with open('types.ts', 'r') as f:
    content = f.read()

target1 = '| { type: "SUBMIT_TO_RADIO"; payload: { songId: string; format: string } }'
replacement1 = '| { type: "SUBMIT_TO_RADIO"; payload: { songId: string; format: string; region?: "US" | "UK" } }'

target2 = 'type: "WITHDRAW_FROM_RADIO";\n      payload: { songId: string; format: string };'
replacement2 = 'type: "WITHDRAW_FROM_RADIO";\n      payload: { songId: string; format: string; region?: "US" | "UK" };'

target3 = 'payload: { songId: string; format: string; amount: number; source: "label" | "personal" };'
replacement3 = 'payload: { songId: string; format: string; amount: number; source: "label" | "personal"; region?: "US" | "UK" };'


content = content.replace(target1, replacement1)
content = content.replace(target2, replacement2)
content = content.replace(target3, replacement3)

with open('types.ts', 'w') as f:
    f.write(content)
