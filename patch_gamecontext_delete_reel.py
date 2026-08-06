import re

with open('types.ts', 'r') as f:
    content = f.read()

new_actions = """  | { type: "DELETE_INSTAGRAM_POST"; payload: { postId: string } }
  | { type: "DELETE_INSTAGRAM_REEL"; payload: { reelId: string } }
  | { type: "DELETE_TIKTOK_VIDEO"; payload: { videoId: string } }"""

content = content.replace('  | { type: "DELETE_INSTAGRAM_POST"; payload: { postId: string } }\n  | { type: "DELETE_TIKTOK_VIDEO"; payload: { videoId: string } }', new_actions)

with open('types.ts', 'w') as f:
    f.write(content)

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

new_cases = """    case "DELETE_INSTAGRAM_POST": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            instagramPosts: (activeData.instagramPosts || []).filter(post => post.id !== action.payload.postId),
          }
        }
      };
    }
    case "DELETE_INSTAGRAM_REEL": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            instagramReels: (activeData.instagramReels || []).filter(reel => reel.id !== action.payload.reelId),
          }
        }
      };
    }"""

content = content.replace("""    case "DELETE_INSTAGRAM_POST": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            instagramPosts: (activeData.instagramPosts || []).filter(post => post.id !== action.payload.postId),
          }
        }
      };
    }""", new_cases)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
