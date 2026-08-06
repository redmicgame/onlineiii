import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

# Insert hiatus logic in PROGRESS_WEEK
old_code_1 = """      for (const artistId in updatedArtistsData) {
        const artistData = updatedArtistsData[artistId];
        const startingMoneyForWeek = artistData.money;"""

new_code_1 = """      for (const artistId in updatedArtistsData) {
        const artistData = updatedArtistsData[artistId];
        const startingMoneyForWeek = artistData.money;
        const currentAbsoluteWeek = newDate.year * 52 + newDate.week;
        
        // Hiatus & fans asking for comeback logic
        const releases = artistData.releases || [];
        const lastRelease = releases.length > 0 ? releases[releases.length - 1] : null;
        if (lastRelease) {
            const lastReleaseAbs = lastRelease.releaseDate.year * 52 + lastRelease.releaseDate.week;
            const weeksSinceRelease = currentAbsoluteWeek - lastReleaseAbs;
            
            if (weeksSinceRelease >= 52 && (weeksSinceRelease % 4 === 0)) {
                if (Math.random() < 0.25) {
                    const fanAccounts = artistData.xUsers.filter(u => !u.isPlayer && u.id.startsWith("fan_"));
                    const randomFan = fanAccounts[Math.floor(Math.random() * fanAccounts.length)];
                    const activeArtistInfo = allPlayerArtistsAndGroups.find(a => a.id === artistId);
                    if (randomFan && activeArtistInfo) {
                        const msgOptions = [
                           `Where is ${activeArtistInfo.name}?? It's been over a year since we got a new release 😭`,
                           `I miss ${activeArtistInfo.name} so much, we need a comeback ASAP`,
                           `Is ${activeArtistInfo.name} officially on hiatus or did they retire? Give us something!`,
                           `waiting for a ${activeArtistInfo.name} comeback like 💀`,
                           `If ${activeArtistInfo.name} doesn't drop something soon I'm gonna lose it`
                        ];
                        const newPost = {
                           id: crypto.randomUUID(),
                           authorId: randomFan.id,
                           content: msgOptions[Math.floor(Math.random() * msgOptions.length)],
                           likes: Math.floor(Math.random() * ((artistData.popularity || 50) * 80)) + 500,
                           retweets: Math.floor(Math.random() * ((artistData.popularity || 50) * 20)) + 100,
                           views: Math.floor(Math.random() * ((artistData.popularity || 50) * 3000)) + 10000,
                           date: newDate
                        };
                        artistData.xPosts.unshift(newPost);
                    }
                }
            }
        }
        
        if (artistData.isHiatus && artistData.hiatusStartYear !== undefined && artistData.hiatusStartWeek !== undefined) {
             const hiatusStartAbs = artistData.hiatusStartYear * 52 + artistData.hiatusStartWeek;
             const hiatusWeeks = currentAbsoluteWeek - hiatusStartAbs;
             if (hiatusWeeks > 104) { // More than 2 years
                 let anticipation = 50;
                 if (artistData.popularity > 85) anticipation = 100;
                 else if (artistData.popularity > 50) anticipation = 80;
                 artistData.comebackAnticipation = anticipation;
             }
        }
"""

content = content.replace(old_code_1, new_code_1)

# Insert Actions: START_HIATUS, ANNOUNCE_HIATUS, END_HIATUS_COMEBACK
old_code_2 = """    case "RESET_GAME": {"""

new_code_2 = """    case "START_HIATUS": {
      if (!state.activeArtistId) return state;
      const activeData = state.artistsData[state.activeArtistId];
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            isHiatus: true,
            hiatusStartWeek: state.date.week,
            hiatusStartYear: state.date.year,
            hiatusAnnounced: false
          }
        }
      };
    }
    case "ANNOUNCE_HIATUS": {
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
      }
      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            hiatusAnnounced: true,
            xPosts: newPosts
          }
        }
      };
    }
    case "END_HIATUS_COMEBACK": {
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
    }
    case "RESET_GAME": {"""

content = content.replace(old_code_2, new_code_2)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
