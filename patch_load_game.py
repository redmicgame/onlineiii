with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_load = """          newState.artistsData[id].songs = (newState.artistsData[id].songs || []).map(song => {
            if (!song.traitGenerated) {
                return { ...song, trait: generateSongTrait(song.quality, newState.difficultyMode || "normal"), traitGenerated: true };
            }
            return song;
          });"""

new_load = """          newState.artistsData[id].songs = (newState.artistsData[id].songs || []).map(song => {
            let updatedSong = { ...song };
            if (!updatedSong.traitGenerated) {
                updatedSong.trait = generateSongTrait(updatedSong.quality, newState.difficultyMode || "normal");
                updatedSong.traitGenerated = true;
            } else if (!updatedSong.trait && newState.difficultyMode !== "easy") {
                updatedSong.trait = "Normal";
            }
            return updatedSong;
          });"""

content = content.replace(old_load, new_load)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
