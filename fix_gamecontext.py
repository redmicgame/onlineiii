import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

# 1. Update CREATE_TIKTOK
tiktok_pattern = r'      if \(action\.payload\.songId\) \{\n        const song = activeData\.songs\.find\(s => s\.id === action\.payload\.songId\);\n        if \(song && song\.trait === "TikTok Hit"\) \{\n          views \*= 3;\n        \}\n      \}'

tiktok_new = '''      let songNameForPost = "";
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
              views *= 2; // NPC viral songs give a boost
          }
        } else {
          const song = activeData.songs.find(s => s.id === action.payload.songId);
          if (song && song.trait === "TikTok Hit") {
            views *= 3;
          }
        }
      }'''
content = content.replace(tiktok_pattern, tiktok_new)

# Generate Pop Core Post for TikTok
tiktok_post_pattern = r'      const newTiktok: TikTokVideo = \{'
tiktok_post_new = '''      if (generatePopCorePost && songNameForPost) {
        const actorOrSinger = (activeData.actingRoles?.length || 0) > (activeData.songs?.length || 0) ? "actor" : "singer";
        const artistName = state.soloArtist?.name || state.group?.name || "Unknown";
        
        const popCorePost = {
            id: crypto.randomUUID(),
            authorId: "popcore",
            content: `${artistName}, a famous ${actorOrSinger} joins the viral '${songNameForPost}' TikTok trend.`,
            likes: Math.floor(Math.random() * 50000) + 10000,
            retweets: Math.floor(Math.random() * 10000) + 1000,
            views: Math.floor(Math.random() * 1000000) + 500000,
            date: state.date,
        };
        updatedSnapshotCandidates.push({
            artistId: state.activeArtistId,
            streams: 0,
            post: popCorePost
        });
      }

      const newTiktok: TikTokVideo = {'''
# We need to make sure updatedSnapshotCandidates exists, wait, CREATE_TIKTOK does not have updatedSnapshotCandidates.
# Let's check what state we have in CREATE_TIKTOK.
