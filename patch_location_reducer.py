with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

reducer_case = """    case "CHANGE_LOCATION": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            location: action.payload.location,
            lastMoveDate: state.date,
          },
        },
      };
    }
"""

content = content.replace('    case "TOGGLE_OFFLINE_MODE": {\n', reducer_case + '    case "TOGGLE_OFFLINE_MODE": {\n')

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
