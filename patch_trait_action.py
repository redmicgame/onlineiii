import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_action = """    case "UPDATE_SONG_QUALITY": {
      if (!state.activeArtistId) return state;
      const { songId, newQuality } = action.payload;
      const activeData = state.artistsData[state.activeArtistId];
      const updatedSongs = activeData.songs.map(s => s.id === songId ? { ...s, quality: newQuality } : s);
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            songs: updatedSongs
          }
        }
      };
    }"""

new_action = """    case "UPDATE_SONG_QUALITY": {
      if (!state.activeArtistId) return state;
      const { songId, newQuality } = action.payload;
      const activeData = state.artistsData[state.activeArtistId];
      const updatedSongs = activeData.songs.map(s => s.id === songId ? { ...s, quality: newQuality } : s);
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            songs: updatedSongs
          }
        }
      };
    }
    case "UPDATE_SONG_TRAIT": {
      if (!state.activeArtistId) return state;
      const { songId, newTrait } = action.payload;
      const activeData = state.artistsData[state.activeArtistId];
      const updatedSongs = activeData.songs.map(s => s.id === songId ? { ...s, trait: newTrait } : s);
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            songs: updatedSongs
          }
        }
      };
    }"""

content = content.replace(old_action, new_action)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
