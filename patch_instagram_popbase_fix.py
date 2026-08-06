import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """      const hypeGained = Math.floor(likes / 200000);
      
      const artistProfile = state.artists.find(a => a.id === state.activeArtistId);
      const actionWord = Math.random() > 0.5 ? 'stuns in' : 'shares';
      const popBaseXPost: any = {
         id: crypto.randomUUID(),
         authorId: "popbase",
         content: `${artistProfile?.name} ${actionWord} new photo.`,
         image: action.payload.imageUrls?.[0],"""

new_code = """      const hypeGained = Math.floor(likes / 200000);
      
      let artistName = "";
      if (state.soloArtist?.id === state.activeArtistId) {
        artistName = state.soloArtist.name;
      } else if (state.group?.id === state.activeArtistId) {
        artistName = state.group.name;
      } else if (state.group?.members.some(m => m.id === state.activeArtistId)) {
        artistName = state.group.members.find(m => m.id === state.activeArtistId)?.name || "";
      } else if (state.extraPlayableArtists?.some(a => a.id === state.activeArtistId)) {
        artistName = state.extraPlayableArtists.find(a => a.id === state.activeArtistId)?.name || "";
      }

      const actionWord = Math.random() > 0.5 ? 'stuns in' : 'shares';
      const popBaseXPost: any = {
         id: crypto.randomUUID(),
         authorId: "popbase",
         content: `${artistName} ${actionWord} new photo.`,
         image: action.payload.imageUrls?.[0],"""

if old_code in content:
    content = content.replace(old_code, new_code)
    print("Patched successfully!")
else:
    print("Match not found!")

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
