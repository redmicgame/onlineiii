import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """    case "ANNOUNCE_HIATUS": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const activeArtist = state.soloArtist || state.group;
      const newPosts = [...(activeData.xPosts || [])];
      if (activeArtist) {
        newPosts.unshift({
           id: crypto.randomUUID(),
           authorId: "popbase",
           content: `${activeArtist.name} has officially announced that they are going on hiatus.`,
           likes: Math.floor(Math.random() * ((activeData.popularity || 50) * 800)) + 5000,
           retweets: Math.floor(Math.random() * ((activeData.popularity || 50) * 200)) + 1000,
           views: Math.floor(Math.random() * ((activeData.popularity || 50) * 20000)) + 100000,
           date: state.date
        });
      }"""

new_code = """    case "ANNOUNCE_HIATUS": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const activeArtist = state.soloArtist || state.group;
      const newPosts = [...(activeData.xPosts || [])];
      if (activeArtist) {
        newPosts.unshift({
           id: crypto.randomUUID(),
           authorId: "popbase",
           content: `${activeArtist.name} has officially announced that they are going on hiatus.`,
           image: ('image' in activeArtist ? activeArtist.image : undefined),
           likes: Math.floor(Math.random() * ((activeData.popularity || 50) * 800)) + 5000,
           retweets: Math.floor(Math.random() * ((activeData.popularity || 50) * 200)) + 1000,
           views: Math.floor(Math.random() * ((activeData.popularity || 50) * 20000)) + 100000,
           date: state.date
        });
      }"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
