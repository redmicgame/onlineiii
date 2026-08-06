const fs = require('fs');
let content = fs.readFileSync('types.ts', 'utf8');

if(!content.includes('| "youtubeMusic"')) {
    content = content.replace(
        /\| "youtubeStudio"/,
        '| "youtubeStudio"\n  | "youtubeMusic"'
    );
    fs.writeFileSync('types.ts', content);
    console.log('Added youtubeMusic to currentView');
}
