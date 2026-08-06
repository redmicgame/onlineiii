import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_logic = """    case "RECORD_SONG": {"""
new_logic = """    case "UPDATE_CUSTOM_IMAGES": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            customContributorImages: {
              ...(activeData.customContributorImages || {}),
              ...action.payload
            }
          }
        }
      }
    }
    case "RECORD_SONG": {"""

content = content.replace(old_logic, new_logic)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
