import re

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
    case "DELETE_TIKTOK_VIDEO": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            tiktokVideos: (activeData.tiktokVideos || []).filter(video => video.id !== action.payload.videoId),
          }
        }
      };
    }
    case "DELETE_ARTIST_IMAGE": {"""

content = content.replace('    case "DELETE_ARTIST_IMAGE": {', new_cases)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
