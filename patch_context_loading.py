import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_encounters = """    case "TOGGLE_ENCOUNTERS":
      return {
        ...state,
        disableEncounters: !state.disableEncounters,
      };"""

new_encounters = """    case "TOGGLE_ENCOUNTERS":
      return {
        ...state,
        disableEncounters: !state.disableEncounters,
      };
    case "TOGGLE_LOADING_SCREENS":
      return {
        ...state,
        disableLoadingScreens: !state.disableLoadingScreens,
      };"""

content = content.replace(old_encounters, new_encounters)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
