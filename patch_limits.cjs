const fs = require('fs');

function replaceFile(path) {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(/>= 3/g, '>= 2');
    content = content.replace(/>= 2/g, '>= 1');
    content = content.replace(/3 songs active in payola on Hard mode/g, '2 songs active in payola on Hard mode');
    content = content.replace(/2 songs active in payola on Extreme mode/g, '1 song active in payola on Extreme mode');
    content = content.replace(/3 - activeSongPromotionsCount/g, '2 - activeSongPromotionsCount');
    content = content.replace(/2 - activeSongPromotionsCount/g, '1 - activeSongPromotionsCount');
    content = content.replace(/\? 2 : 3/g, '? 1 : 2');
    fs.writeFileSync(path, content);
}

replaceFile('components/PromoteView.tsx');
replaceFile('components/RadioDashView.tsx');
