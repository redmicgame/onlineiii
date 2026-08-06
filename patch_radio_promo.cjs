const fs = require('fs');

let content = fs.readFileSync('components/RadioDashView.tsx', 'utf8');

const replacement = `    const handlePromote = (songId: string, format: string, region: 'US'|'UK' = 'US') => {
        const activePayolaCount = activeArtistData?.songs.filter(s => s.hasRadioPromo || s.hasUkRadioPromo).length || 0;
        if (gameState.difficulty === 'hard' && activePayolaCount >= 3) {
            alert('You can only have 3 songs active in payola on Hard mode.');
            return;
        }
        if (gameState.difficulty === 'extreme' && activePayolaCount >= 2) {
            alert('You can only have 2 songs active in payola on Extreme mode.');
            return;
        }

        if (promoSource === 'personal' && (activeArtistData?.money || 0) < promoAmount) {
            alert("Not enough personal funds.");
            return;
        }`;

content = content.replace(
`    const handlePromote = (songId: string, format: string, region: 'US'|'UK' = 'US') => {
        if (promoSource === 'personal' && (activeArtistData?.money || 0) < promoAmount) {
            alert("Not enough personal funds.");
            return;
        }`, replacement);

fs.writeFileSync('components/RadioDashView.tsx', content);
