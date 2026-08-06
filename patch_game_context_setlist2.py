with open('context/GameContext.tsx', 'r') as f:
    text = f.read()

pattern = '    case "CANCEL_TOUR": {'

replacement = '''    case "EDIT_TOUR_SETLIST": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const artistProfile = state.soloArtist || state.group;
      if (!artistProfile) return state;
      
      const { tourId, newSetlist, addedSongs, removedSongs } = action.payload;

      const updatedTours = activeData.tours.map((tour) => {
        if (tour.id === tourId) {
          return { ...tour, setlist: newSetlist };
        }
        return tour;
      });
      
      const tour = activeData.tours.find(t => t.id === tourId);
      const newPosts: XPost[] = [];
      
      // Pop base reports
      if (removedSongs.length > 0) {
          const removedSongIds = new Set(removedSongs);
          const rSongs = activeData.songs.filter(s => removedSongIds.has(s.id));
          rSongs.forEach(song => {
              newPosts.push({
                  id: crypto.randomUUID(),
                  authorId: "popbase",
                  content: `${artistProfile.name} has removed '${song.title}' from the ${tour?.name} setlist.`,
                  image: song.coverArt,
                  likes: Math.floor(Math.random() * 50000) + 10000,
                  retweets: Math.floor(Math.random() * 10000) + 5000,
                  views: Math.floor(Math.random() * 2000000) + 500000,
                  date: state.date,
              });
          });
      }
      
      if (addedSongs.length > 0) {
          const addedSongIds = new Set(addedSongs);
          const aSongs = activeData.songs.filter(s => addedSongIds.has(s.id));
          aSongs.forEach(song => {
              newPosts.push({
                  id: crypto.randomUUID(),
                  authorId: "popbase",
                  content: `${artistProfile.name} has added '${song.title}' to the ${tour?.name} setlist!`,
                  image: song.coverArt,
                  likes: Math.floor(Math.random() * 60000) + 15000,
                  retweets: Math.floor(Math.random() * 12000) + 6000,
                  views: Math.floor(Math.random() * 2500000) + 700000,
                  date: state.date,
              });
          });
      }

      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            tours: updatedTours,
            xPosts: [...newPosts, ...activeData.xPosts]
          },
        },
      };
    }

    case "CANCEL_TOUR": {'''

text = text.replace(pattern, replacement)

with open('context/GameContext.tsx', 'w') as f:
    f.write(text)
