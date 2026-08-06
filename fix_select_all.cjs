const fs = require('fs');
let promote = fs.readFileSync('components/PromoteView.tsx', 'utf8');
promote = promote.replace(/if \(gameState\.difficulty === 'hard'\) limit = 1 - activeSongPromotionsCount;/, "if (gameState.difficulty === 'hard') limit = 2 - activeSongPromotionsCount;");
fs.writeFileSync('components/PromoteView.tsx', promote);
