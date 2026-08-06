import re

with open('components/StudioView.tsx', 'r') as f:
    content = f.read()

# Replace getContributorCost logic 
# We add this function right after handleFeature2Change
old_toggle = """    const toggleRemixType = (type: string) => {"""
new_toggle = """    const getContributorCost = () => {
        if (contributorPaymentMethod === 'upfront') {
            return (producers.length + songwriters.length + engineers.length + anr.length) * CONTRIBUTOR_UPFRONT_COST;
        }
        return 0;
    };

    const toggleRemixType = (type: string) => {"""

content = content.replace(old_toggle, new_toggle)

# Fix totalCost in handleRecord
old_handle_record_cost = """        const totalCost = selectedStudio.cost + (collaboration ? collaboration.cost : 0);
        if (money < totalCost) {"""
new_handle_record_cost = """        const totalCost = selectedStudio.cost + (collaboration ? collaboration.cost : 0) + getContributorCost();
        if (money < totalCost) {"""
content = content.replace(old_handle_record_cost, new_handle_record_cost)


# Fix handleRecord final logic
old_record_cut_logic = """        const generateCut = () => Math.floor(Math.random() * 10) + 1;
        const totalCuts = producers.reduce((sum) => sum + generateCut(), 0) +
                          songwriters.reduce((sum) => sum + generateCut(), 0) +
                          engineers.reduce((sum) => sum + generateCut(), 0) +
                          anr.reduce((sum) => sum + generateCut(), 0);

        const newSong: Song = {
            id: crypto.randomUUID(),
            title: songTitle,
            genre,
            subgenre: subgenre !== 'None' ? subgenre : undefined,
            quality: finalQuality,"""

new_record_cut_logic = """        const generateCut = () => Math.floor(Math.random() * 10) + 1;
        let totalCuts = 0;
        if (contributorPaymentMethod === 'split') {
            totalCuts = producers.reduce((sum) => sum + generateCut(), 0) +
                        songwriters.reduce((sum) => sum + generateCut(), 0) +
                        engineers.reduce((sum) => sum + generateCut(), 0) +
                        anr.reduce((sum) => sum + generateCut(), 0);
        }
        
        const numContributors = producers.length + songwriters.length + engineers.length + anr.length;
        const qualityBonus = numContributors * (Math.floor(Math.random() * 2) + 1);
        const adjustedFinalQuality = Math.min(100, finalQuality + qualityBonus);

        const newSong: Song = {
            id: crypto.randomUUID(),
            title: songTitle,
            genre,
            subgenre: subgenre !== 'None' ? subgenre : undefined,
            quality: adjustedFinalQuality,"""
content = content.replace(old_record_cut_logic, new_record_cut_logic)

# Fix totalCost in handleCreateRemixPack
old_pack_cost = """        const packTotalCost = (selectedStudio.cost * selectedRemixTypes.size) + totalFeatureCost;
        if (money < packTotalCost) {"""
new_pack_cost = """        const packTotalCost = (selectedStudio.cost * selectedRemixTypes.size) + totalFeatureCost + (getContributorCost() * selectedRemixTypes.size);
        if (money < packTotalCost) {"""
content = content.replace(old_pack_cost, new_pack_cost)


# Fix handleCreateRemixPack logic
old_pack_cut_logic = """        const generateCut = () => Math.floor(Math.random() * 10) + 1;
        const totalCuts = producers.reduce((sum) => sum + generateCut(), 0) +
                          songwriters.reduce((sum) => sum + generateCut(), 0) +
                          engineers.reduce((sum) => sum + generateCut(), 0) +
                          anr.reduce((sum) => sum + generateCut(), 0);

        Array.from(selectedRemixTypes).forEach(type => {"""
        
new_pack_cut_logic = """        const generateCut = () => Math.floor(Math.random() * 10) + 1;
        let totalCuts = 0;
        if (contributorPaymentMethod === 'split') {
            totalCuts = producers.reduce((sum) => sum + generateCut(), 0) +
                        songwriters.reduce((sum) => sum + generateCut(), 0) +
                        engineers.reduce((sum) => sum + generateCut(), 0) +
                        anr.reduce((sum) => sum + generateCut(), 0);
        }

        const numContributors = producers.length + songwriters.length + engineers.length + anr.length;
        const qualityBonus = numContributors * (Math.floor(Math.random() * 2) + 1);

        Array.from(selectedRemixTypes).forEach(type => {"""
content = content.replace(old_pack_cut_logic, new_pack_cut_logic)

# Replace finalQuality in pack to include bonus
old_pack_quality = """            const finalQuality = Math.min(100, quality);

            newSongs.push({"""
new_pack_quality = """            const finalQuality = Math.min(100, quality + qualityBonus);

            newSongs.push({"""
content = content.replace(old_pack_quality, new_pack_quality)


# Fix the UI display of cost
old_display_cost = """    const totalCost = selectedStudio.cost + (collaboration ? collaboration.cost : 0);"""
new_display_cost = """    const totalCost = selectedStudio.cost + (collaboration ? collaboration.cost : 0) + getContributorCost();"""
content = content.replace(old_display_cost, new_display_cost)

# Add DISPATCH to store customImageUploads globally when recording
# We can do this right before the dispatch 'RECORD_SONG'
old_dispatch = """        dispatch({ type: 'RECORD_SONG', payload: { song: newSong, cost: totalCost } });"""
new_dispatch = """        if (Object.keys(customImageUploads).length > 0) {
            dispatch({ type: 'UPDATE_CUSTOM_IMAGES', payload: customImageUploads });
        }
        dispatch({ type: 'RECORD_SONG', payload: { song: newSong, cost: totalCost } });"""
content = content.replace(old_dispatch, new_dispatch)

old_dispatch_pack = """        dispatch({ type: 'CREATE_REMIX_PACK', payload: { songs: newSongs, cost: packTotalCost } });"""
new_dispatch_pack = """        if (Object.keys(customImageUploads).length > 0) {
            dispatch({ type: 'UPDATE_CUSTOM_IMAGES', payload: customImageUploads });
        }
        dispatch({ type: 'CREATE_REMIX_PACK', payload: { songs: newSongs, cost: packTotalCost } });"""
content = content.replace(old_dispatch_pack, new_dispatch_pack)


with open('components/StudioView.tsx', 'w') as f:
    f.write(content)
