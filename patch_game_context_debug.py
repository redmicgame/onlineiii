import re

with open('context/GameContext.tsx', 'r') as f:
    text = f.read()

pattern = r'''    case "EDIT_TOUR_SETLIST": \{'''

replacement = r'''    case "EDIT_TOUR_SETLIST": {
      console.log("EDIT_TOUR_SETLIST triggered", action.payload);'''

text = re.sub(pattern, replacement, text)

with open('context/GameContext.tsx', 'w') as f:
    f.write(text)
