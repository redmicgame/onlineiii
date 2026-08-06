import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """    case "UPDATE_SONG_QUALITY": {
      if (!state.activeArtistId) return state;
      const { songId, newQuality } = action.payload;
      const activeData = state.artistsData[state.activeArtistId];

      const clampedQuality = Math.max(0, Math.min(100, newQuality));

      const updatedSongs = activeData.songs.map((song) =>
        song.id === songId ? { ...song, quality: clampedQuality } : song,
      );
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: { ...activeData, songs: updatedSongs },
        },
      };
    }"""

new_code = """    case "UPDATE_SONG_QUALITY": {
      if (!state.activeArtistId) return state;
      const { songId, newQuality } = action.payload;
      const activeData = state.artistsData[state.activeArtistId];

      const clampedQuality = Math.max(0, Math.min(100, newQuality));

      const updatedSongs = activeData.songs.map((song) =>
        song.id === songId ? { ...song, quality: clampedQuality } : song,
      );
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: { ...activeData, songs: updatedSongs },
        },
      };
    }
    case "UPDATE_SONG_TRAIT": {
      if (!state.activeArtistId) return state;
      const { songId, newTrait } = action.payload;
      const activeData = state.artistsData[state.activeArtistId];

      const updatedSongs = activeData.songs.map((song) =>
        song.id === songId ? { ...song, trait: newTrait as any } : song,
      );
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: { ...activeData, songs: updatedSongs },
        },
      };
    }"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
