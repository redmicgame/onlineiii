import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

target = """    case "WITHDRAW_FROM_RADIO": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const songIndex = activeData.songs.findIndex(
        (s) => s.id === action.payload.songId,
      );
      if (songIndex === -1) return state;
      const updatedSongs = [...activeData.songs];
      updatedSongs[songIndex] = {
        ...updatedSongs[songIndex],
        isOnRadio: false,
      };"""

replacement = """    case "WITHDRAW_FROM_RADIO": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const songIndex = activeData.songs.findIndex(
        (s) => s.id === action.payload.songId,
      );
      if (songIndex === -1) return state;
      const updatedSongs = [...activeData.songs];
      
      const region = (action.payload as any).region || 'US';
      if (region === 'UK') {
          updatedSongs[songIndex] = {
            ...updatedSongs[songIndex],
            isOnUkRadio: false,
          };
      } else {
          updatedSongs[songIndex] = {
            ...updatedSongs[songIndex],
            isOnRadio: false,
          };
      }"""

content = content.replace(target, replacement)
with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
