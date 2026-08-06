import re

with open('components/SpotifySongDNAView.tsx', 'r') as f:
    content = f.read()

old_get_avatar = """    const getAvatar = (name: string, roleType?: string) => {
        const collab = allPlayerArtists.find(a => a.name === name);
        if (collab) return collab.image;
        if (NPC_ARTIST_IMAGES[name]) return NPC_ARTIST_IMAGES[name];
        
        // Don't show avatars for specific roles if they don't have custom ones
        // Actually, Spotify shows avatars for everyone if available, but let's use UI avatars as fallback
        if (roleType === 'Producer' || roleType === 'Songwriter') return null;
        
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=333&color=fff`;
    };"""

new_get_avatar = """    const getAvatar = (name: string, roleType?: string) => {
        if (activeArtistData?.customContributorImages?.[name]) return activeArtistData.customContributorImages[name];
        
        const collab = allPlayerArtists.find(a => a.name === name);
        if (collab) return collab.image;
        if (NPC_ARTIST_IMAGES[name]) return NPC_ARTIST_IMAGES[name];
        
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=333&color=fff`;
    };"""

content = content.replace(old_get_avatar, new_get_avatar)

with open('components/SpotifySongDNAView.tsx', 'w') as f:
    f.write(content)
