const fs = require('fs');
let content = fs.readFileSync('components/PromoteView.tsx', 'utf8');

const replacementToggle = `    const handleToggleSong = (songId: string) => {
        const newSelection = new Set(selectedSongIds);
        if (newSelection.has(songId)) {
            newSelection.delete(songId);
        } else {
            const activeSongPromotionsCount = activeArtistData?.promotions.filter(p => p.itemType === 'song').length || 0;
            if (gameState.difficulty === 'hard' && (newSelection.size + activeSongPromotionsCount) >= 3) {
                alert('You can only have 3 songs active in payola on Hard mode.');
                return;
            }
            if (gameState.difficulty === 'extreme' && (newSelection.size + activeSongPromotionsCount) >= 2) {
                alert('You can only have 2 songs active in payola on Extreme mode.');
                return;
            }
            newSelection.add(songId);
        }
        setSelectedSongIds(newSelection);
    };`;

const replacementSelectAll = `    const handleSelectAllSongs = () => {
        const activeSongPromotionsCount = activeArtistData?.promotions.filter(p => p.itemType === 'song').length || 0;
        let limit = promotableSongs.length;
        if (gameState.difficulty === 'hard') limit = 3 - activeSongPromotionsCount;
        if (gameState.difficulty === 'extreme') limit = 2 - activeSongPromotionsCount;
        
        if (limit <= 0) {
            alert(\`You can only have \${gameState.difficulty === 'extreme' ? 2 : 3} songs active in payola on \${gameState.difficulty} mode.\`);
            return;
        }

        const toSelect = promotableSongs.slice(0, limit).map(s => s.id);
        if (promotableSongs.length > limit) {
             alert(\`Selected \${limit} songs due to \${gameState.difficulty} mode payola limits.\`);
        }
        setSelectedSongIds(new Set(toSelect));
    };`;

const replacementSingleItem = `    const handleSelectPackageForSingleItem = (pkg: PromotionPackage, quality: 'low' | 'medium' | 'high') => {
        const activeSongPromotionsCount = activeArtistData?.promotions.filter(p => p.itemType === 'song').length || 0;
        if (selectedSingleItem?.type === 'song') {
            if (gameState.difficulty === 'hard' && activeSongPromotionsCount >= 3) {
                alert('You can only have 3 songs active in payola on Hard mode.');
                return;
            }
            if (gameState.difficulty === 'extreme' && activeSongPromotionsCount >= 2) {
                alert('You can only have 2 songs active in payola on Extreme mode.');
                return;
            }
        }
        const qualityMultiplier = quality === 'high' ? 3 : quality === 'medium' ? 1.5 : 1;`;

content = content.replace(
`    const handleToggleSong = (songId: string) => {
        const newSelection = new Set(selectedSongIds);
        if (newSelection.has(songId)) {
            newSelection.delete(songId);
        } else {
            newSelection.add(songId);
        }
        setSelectedSongIds(newSelection);
    };`, replacementToggle);

content = content.replace(
`    const handleSelectAllSongs = () => {
        setSelectedSongIds(new Set(promotableSongs.map(s => s.id)));
    };`, replacementSelectAll);

content = content.replace(
`    const handleSelectPackageForSingleItem = (pkg: PromotionPackage, quality: 'low' | 'medium' | 'high') => {
        const qualityMultiplier = quality === 'high' ? 3 : quality === 'medium' ? 1.5 : 1;`, replacementSingleItem);

fs.writeFileSync('components/PromoteView.tsx', content);
