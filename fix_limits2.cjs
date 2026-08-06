const fs = require('fs');

let promote = fs.readFileSync('components/PromoteView.tsx', 'utf8');

// Line 200
promote = promote.replace(/if \(gameState\.difficulty === 'hard' && activeSongPromotionsCount >= 2\) \{/, "if (gameState.difficulty === 'hard' && (newSelection.size + activeSongPromotionsCount) >= 2) {");

// extreme limit in handleToggleSong (already correct): if (gameState.difficulty === 'extreme' && (newSelection.size + activeSongPromotionsCount) >= 1)

fs.writeFileSync('components/PromoteView.tsx', promote);
