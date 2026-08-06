import re

with open('components/StudioView.tsx', 'r') as f:
    content = f.read()

old_code = """    const potentialCollaborators = useMemo(() => {
        const npcs = NPC_ARTIST_NAMES.slice().sort();
        const otherPlayerArtists = allPlayerArtists
            .filter(a => a.id !== activeArtist.id)
            .map(a => a.name)
            .sort();
        return Array.from(new Set([...otherPlayerArtists, ...npcs]));
    }, [allPlayerArtists, activeArtist]);"""

new_code = """    const potentialCollaborators = useMemo(() => {
        const npcs = NPC_ARTIST_NAMES.slice().sort();
        const otherPlayerArtists = allPlayerArtists
            .filter(a => a.id !== activeArtist.id)
            .map(a => a.name)
            .sort();
        const customCollabs = (gameState.customFeatures || []).map(f => f.name);
        return Array.from(new Set([...customCollabs, ...otherPlayerArtists, ...npcs]));
    }, [allPlayerArtists, activeArtist, gameState.customFeatures]);"""

content = content.replace(old_code, new_code)

with open('components/StudioView.tsx', 'w') as f:
    f.write(content)
