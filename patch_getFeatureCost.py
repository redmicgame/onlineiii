import re

with open('components/StudioView.tsx', 'r') as f:
    content = f.read()

old_code = """    const getFeatureCost = (artistName: string) => {
        if (allPlayerArtists.some(a => a.name === artistName && a.id !== activeArtist.id)) {
            return 0; // Other playable characters (including kids) are free to feature
        }
        
        const genre = NPC_ARTIST_GENRES[artistName];"""

new_code = """    const getFeatureCost = (artistName: string) => {
        if (allPlayerArtists.some(a => a.name === artistName && a.id !== activeArtist.id)) {
            return 0; // Other playable characters (including kids) are free to feature
        }
        
        const customFeature = gameState.customFeatures?.find(f => f.name === artistName);
        if (customFeature) {
            return customFeature.cost;
        }
        
        const genre = NPC_ARTIST_GENRES[artistName];"""

content = content.replace(old_code, new_code)

with open('components/StudioView.tsx', 'w') as f:
    f.write(content)
