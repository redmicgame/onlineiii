import re
with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

pattern = r'''      return \{
        \.\.\.state,
        artistsData: \{
          \.\.\.state\.artistsData,
          \[state\.activeArtistId\]: \{
            \.\.\.activeData,
            songs: updatedSongs,
            tiktokVideos: \[newTiktok, \.\.\.\(activeData\.tiktokVideos \|\| \[\]\)\],
            hype: Math\.min\(100, activeData\.hype \+ hypeGained\),
            tiktokFollowers: followers \+ Math\.floor\(views \* 0\.01\),
          \},
        \},
      \};'''

replacement = '''      let updatedSocialFeed = [...state.socialFeed];
      if (generatePopCorePost && songNameForPost) {
        const actorOrSinger = (activeData.actingRoles?.length || 0) > (activeData.songs?.length || 0) ? "actor" : "singer";
        const artistName = state.soloArtist?.name || state.group?.name || "Unknown";
        
        updatedSocialFeed.unshift({
            id: crypto.randomUUID(),
            authorId: "popcore",
            content: `${artistName}, a famous ${actorOrSinger} joins the viral '${songNameForPost}' TikTok trend.`,
            likes: Math.floor(Math.random() * 50000) + 10000,
            retweets: Math.floor(Math.random() * 10000) + 1000,
            views: Math.floor(Math.random() * 1000000) + 500000,
            date: state.date,
        });
      }

      return {
        ...state,
        socialFeed: updatedSocialFeed,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            songs: updatedSongs,
            tiktokVideos: [newTiktok, ...(activeData.tiktokVideos || [])],
            hype: Math.min(100, activeData.hype + hypeGained),
            tiktokFollowers: followers + Math.floor(views * 0.01),
          },
        },
      };'''

content = re.sub(pattern, replacement, content)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
