import re

with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

old_code = """      const newPost: InstagramPost = {
        id: crypto.randomUUID(),
        imageUrls: action.payload.imageUrls,
        caption: action.payload.caption,
        likes,
        comments,
        date: state.date,
      };

      const hypeGained = Math.floor(likes / 200000);

      return {
        ...state,
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            instagramPosts: [newPost, ...(activeData.instagramPosts || [])],
            hype: Math.min(100, activeData.hype + hypeGained),
            instagramFollowers: followers + Math.floor(likes * 0.05),
          },
        },
      };"""

new_code = """      const newPost: InstagramPost = {
        id: crypto.randomUUID(),
        imageUrls: action.payload.imageUrls,
        caption: action.payload.caption,
        likes,
        comments,
        date: state.date,
      };

      const hypeGained = Math.floor(likes / 200000);
      
      const artistProfile = state.artists.find(a => a.id === state.activeArtistId);
      const actionWord = Math.random() > 0.5 ? 'stuns in' : 'shares';
      const popBaseXPost: any = {
         id: crypto.randomUUID(),
         authorId: "popbase",
         content: `${artistProfile?.name} ${actionWord} new photo.`,
         image: action.payload.imageUrls?.[0],
         likes: Math.floor(Math.random() * 150000) + 15000,
         retweets: Math.floor(Math.random() * 40000) + 5000,
         views: Math.floor(Math.random() * 3000000) + 500000,
         date: state.date,
      };

      return {
        ...state,
        xPosts: [popBaseXPost, ...state.xPosts],
        artistsData: {
          ...state.artistsData,
          [state.activeArtistId]: {
            ...activeData,
            instagramPosts: [newPost, ...(activeData.instagramPosts || [])],
            hype: Math.min(100, activeData.hype + hypeGained),
            instagramFollowers: followers + Math.floor(likes * 0.05),
          },
        },
      };"""

if old_code in content:
    content = content.replace(old_code, new_code)
    print("Patched successfully!")
else:
    print("Match not found!")

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
