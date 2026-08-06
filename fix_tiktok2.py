import re
with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

pattern = r'''      if \(action\.payload\.songId\) \{
        const song = activeData\.songs\.find\(s => s\.id === action\.payload\.songId\);
        if \(song && song\.trait === "TikTok Hit"\) \{
          views \*= 3;
        \}
      \}'''

replacement = '''      let songNameForPost = "";
      let isNpcSong = false;
      let generatePopCorePost = false;
      
      if (action.payload.songId) {
        if (action.payload.songId.startsWith("npc_")) {
          isNpcSong = true;
          const npcId = action.payload.songId.replace("npc_", "");
          const npcSong = state.npcs.find((s: any) => s.uniqueId === npcId);
          if (npcSong) {
              songNameForPost = npcSong.title;
              generatePopCorePost = true;
              views *= 2;
          }
        } else {
          const song = activeData.songs.find(s => s.id === action.payload.songId);
          if (song && song.trait === "TikTok Hit") {
            views *= 3;
          }
        }
      }'''

content = content.replace(pattern, replacement)

# Now we need to append the pop core post to socialFeed in the state return block of CREATE_TIKTOK
return_pattern = r'''      return \{
        \.\.\.state,
        artistsData: \{
          \.\.\.state\.artistsData,
          \[state\.activeArtistId\]: \{
            \.\.\.activeData,
            songs: updatedSongs,
            tiktokVideos: \[newTiktok, \.\.\.\(activeData\.tiktokVideos \|\| \[\]\)\],
            tiktokFollowers: followers \+ Math\.floor\(views \* 0\.01\),
            hype: Math\.min\(100, \(activeData\.hype \|\| 0\) \+ hypeGained\),
          \},
        \},
      \};'''

return_replacement = '''      let updatedSocialFeed = [...state.socialFeed];
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
            tiktokFollowers: followers + Math.floor(views * 0.01),
            hype: Math.min(100, (activeData.hype || 0) + hypeGained),
          },
        },
      };'''

content = content.replace(pattern, replacement) # Ensure pattern is replaced in case my previous attempt didn't apply
if "generatePopCorePost" not in content:
    content = re.sub(r'      if \(action\.payload\.songId\) \{\s*const song = activeData\.songs\.find\(s => s\.id === action\.payload\.songId\);\s*if \(song && song\.trait === "TikTok Hit"\) \{\s*views \*= 3;\s*\}\s*\}', replacement, content)

content = re.sub(r'      return \{\s*\.\.\.state,\s*artistsData: \{\s*\.\.\.state\.artistsData,\s*\[state\.activeArtistId\]: \{\s*\.\.\.activeData,\s*songs: updatedSongs,\s*tiktokVideos: \[newTiktok, \.\.\.\(activeData\.tiktokVideos \|\| \[\]\)\],\s*tiktokFollowers: followers \+ Math\.floor\(views \* 0\.01\),\s*hype: Math\.min\(100, \(activeData\.hype \|\| 0\) \+ hypeGained\),\s*\},\s*\},\s*\};', return_replacement, content)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
