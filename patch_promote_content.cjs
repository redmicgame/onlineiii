const fs = require('fs');
let content = fs.readFileSync('components/PromoteView.tsx', 'utf8');

const songsCheck = `            case 'songs':
                if (!contract) {
                    return <div className="text-center text-zinc-400 p-8 bg-zinc-800 rounded-lg">You must be signed to a label to run song promotion campaigns. Visit the 'Labels' tab to get a deal.</div>;
                }
                const activeSongPromotionsCount = activeArtistData?.promotions.filter(p => p.itemType === 'song').length || 0;
                if (gameState.difficulty === 'hard' && activeSongPromotionsCount >= 2) {
                     return <div className="text-center text-zinc-400 p-8 bg-zinc-800 rounded-lg">Payola limit reached for Hard Mode (2 songs max). Remove a song to add more.</div>;
                }
                if (gameState.difficulty === 'extreme' && activeSongPromotionsCount >= 1) {
                     return <div className="text-center text-zinc-400 p-8 bg-zinc-800 rounded-lg">Payola limit reached for Extreme Mode (1 song max). Remove a song to add more.</div>;
                }`;

const resurgenceCheck = `            case 'resurgence':
                if (!contract) {
                     return <div className="text-center text-zinc-400 p-8 bg-zinc-800 rounded-lg">You must be signed to a label to run resurgence campaigns.</div>;
                }
                const activeResurgencePromotionsCount = activeArtistData?.promotions.filter(p => p.itemType === 'song').length || 0;
                if (gameState.difficulty === 'hard' && activeResurgencePromotionsCount >= 2) {
                     return <div className="text-center text-zinc-400 p-8 bg-zinc-800 rounded-lg">Payola limit reached for Hard Mode (2 songs max). Remove a song to add more.</div>;
                }
                if (gameState.difficulty === 'extreme' && activeResurgencePromotionsCount >= 1) {
                     return <div className="text-center text-zinc-400 p-8 bg-zinc-800 rounded-lg">Payola limit reached for Extreme Mode (1 song max). Remove a song to add more.</div>;
                }`;

content = content.replace(
`            case 'songs':
                if (!contract) {
                    return <div className="text-center text-zinc-400 p-8 bg-zinc-800 rounded-lg">You must be signed to a label to run song promotion campaigns. Visit the 'Labels' tab to get a deal.</div>;
                }`, songsCheck);

content = content.replace(
`            case 'resurgence':
                if (!contract) {
                     return <div className="text-center text-zinc-400 p-8 bg-zinc-800 rounded-lg">You must be signed to a label to run resurgence campaigns.</div>;
                }`, resurgenceCheck);

fs.writeFileSync('components/PromoteView.tsx', content);
