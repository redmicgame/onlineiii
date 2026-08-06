const fs = require('fs');

let promote = fs.readFileSync('components/PromoteView.tsx', 'utf8');
promote = promote.replace(/if \(gameState\.difficulty === 'hard' && \(newSelection\.size \+ activeSongPromotionsCount\) >= 2\) \{/g, (match, offset) => {
    // We only want to replace the SECOND occurrence (line 265)
    if (offset > 5000) {
        return "if (gameState.difficulty === 'hard' && activeSongPromotionsCount >= 2) {";
    }
    return match;
});
fs.writeFileSync('components/PromoteView.tsx', promote);

let radio = fs.readFileSync('components/RadioDashView.tsx', 'utf8');
radio = radio.replace(/if \(gameState\.difficulty === 'hard' && \(newSelection\.size \+ activeSongPromotionsCount\) >= 2\) \{/, "if (gameState.difficulty === 'hard' && activePayolaCount >= 2) {");
fs.writeFileSync('components/RadioDashView.tsx', radio);
