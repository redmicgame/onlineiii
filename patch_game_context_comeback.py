import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """    case "END_HIATUS_COMEBACK": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const activeArtist = state.soloArtist || state.group;
      const newPosts = [...(activeData.xPosts || [])];
      
      const { isGood } = action.payload || { isGood: true };
      
      if (activeArtist) {
         if (isGood) {
            newPosts.unshift({
               id: crypto.randomUUID(),
               authorId: "popbase",
               content: `${activeArtist.name} HAS RETURNED! The comeback is being universally praised by fans! 🔥`,
               likes: Math.floor(Math.random() * ((activeData.popularity || 50) * 2000)) + 50000,
               retweets: Math.floor(Math.random() * ((activeData.popularity || 50) * 500)) + 10000,
               views: Math.floor(Math.random() * ((activeData.popularity || 50) * 50000)) + 500000,
               date: state.date
            });
         } else {
            newPosts.unshift({
               id: crypto.randomUUID(),
               authorId: "popbase",
               content: `${activeArtist.name}'s highly anticipated comeback has arrived, but fans are expressing disappointment in the quality... 😬`,
               likes: Math.floor(Math.random() * ((activeData.popularity || 50) * 1500)) + 25000,
               retweets: Math.floor(Math.random() * ((activeData.popularity || 50) * 400)) + 8000,
               views: Math.floor(Math.random() * ((activeData.popularity || 50) * 40000)) + 300000,
               date: state.date
            });
         }
      }
      
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            isHiatus: false,
            hiatusStartWeek: undefined,
            hiatusStartYear: undefined,
            hiatusAnnounced: false,
            comebackAnticipation: undefined,
            xPosts: newPosts,
            hype: Math.min(100, activeData.hype + (activeData.comebackAnticipation ? 20 : 0))
          }
        }
      };
    }"""

new_code = """    case "END_HIATUS_COMEBACK": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      const activeArtist = state.soloArtist || state.group;
      const newPosts = [...(activeData.xPosts || [])];
      
      const { isGood } = action.payload || { isGood: true };
      
      let hypeChange = 0;
      let popChange = 0;
      
      if (activeArtist) {
         if (isGood) {
            newPosts.unshift({
               id: crypto.randomUUID(),
               authorId: "popbase",
               content: `${activeArtist.name} HAS RETURNED! The comeback is being universally praised by fans! 🔥🔥🔥`,
               likes: Math.floor(Math.random() * ((activeData.popularity || 50) * 3000)) + 80000,
               retweets: Math.floor(Math.random() * ((activeData.popularity || 50) * 800)) + 15000,
               views: Math.floor(Math.random() * ((activeData.popularity || 50) * 80000)) + 1000000,
               date: state.date
            });
            hypeChange = activeData.comebackAnticipation ? 40 : 15;
            popChange = activeData.comebackAnticipation ? 5 : 2;
         } else {
            newPosts.unshift({
               id: crypto.randomUUID(),
               authorId: "popbase",
               content: `${activeArtist.name}'s highly anticipated comeback has arrived, but fans are extremely disappointed in the quality... It's giving flop 😬`,
               likes: Math.floor(Math.random() * ((activeData.popularity || 50) * 4000)) + 100000,
               retweets: Math.floor(Math.random() * ((activeData.popularity || 50) * 1000)) + 20000,
               views: Math.floor(Math.random() * ((activeData.popularity || 50) * 100000)) + 1200000,
               date: state.date
            });
            hypeChange = activeData.comebackAnticipation ? -10 : -5;
            popChange = activeData.comebackAnticipation ? -2 : -1;
         }
      }
      
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            isHiatus: false,
            hiatusStartWeek: undefined,
            hiatusStartYear: undefined,
            hiatusAnnounced: false,
            comebackAnticipation: undefined,
            xPosts: newPosts,
            hype: Math.max(0, Math.min(getHypeCap(activeData), activeData.hype + hypeChange)),
            popularity: Math.max(0, Math.min(100, activeData.popularity + popChange))
          }
        }
      };
    }"""

content = content.replace(old_code, new_code)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
