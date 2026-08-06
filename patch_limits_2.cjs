const fs = require('fs');

function replaceFile(path) {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(/gameState\.difficulty === 'hard'.*>= 1/g, "gameState.difficulty === 'hard' && (newSelection.size + activeSongPromotionsCount) >= 2");
    content = content.replace(/gameState\.difficulty === 'hard'.*>= 1/g, "gameState.difficulty === 'hard' && activeSongPromotionsCount >= 2");
    // RadioDashView
    content = content.replace(/gameState\.difficulty === 'hard' && activePayolaCount >= 1/g, "gameState.difficulty === 'hard' && activePayolaCount >= 2");
    
    // PromoteView hard logic
    content = content.replace(/gameState\.difficulty === 'hard' && \(newSelection\.size \+ activeSongPromotionsCount\) >= 1/g, "gameState.difficulty === 'hard' && (newSelection.size + activeSongPromotionsCount) >= 2");
    content = content.replace(/gameState\.difficulty === 'hard' && activeSongPromotionsCount >= 1/g, "gameState.difficulty === 'hard' && activeSongPromotionsCount >= 2");
    
    fs.writeFileSync(path, content);
}

replaceFile('components/PromoteView.tsx');
replaceFile('components/RadioDashView.tsx');
