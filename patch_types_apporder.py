import re

with open('types.ts', 'r') as f:
    content = f.read()

content = content.replace("  hypeMode?: \"locked\" | \"manual\";", "  hypeMode?: \"locked\" | \"manual\";\n  appOrder?: string[];")
content = content.replace("  | { type: \"DELETE_TIKTOK_VIDEO\"; payload: { videoId: string } }", "  | { type: \"DELETE_TIKTOK_VIDEO\"; payload: { videoId: string } }\n  | { type: \"SET_APP_ORDER\"; payload: { appOrder: string[] } }")

with open('types.ts', 'w') as f:
    f.write(content)

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

new_case = """    case "SET_APP_ORDER": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            redMicPro: {
              ...activeData.redMicPro,
              appOrder: action.payload.appOrder
            }
          }
        }
      };
    }"""

content = content.replace("    case \"DELETE_ARTIST_IMAGE\": {", new_case + "\n    case \"DELETE_ARTIST_IMAGE\": {")

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
