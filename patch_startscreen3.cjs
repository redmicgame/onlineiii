const fs = require('fs');
let content = fs.readFileSync('components/StartScreen.tsx', 'utf8');

// Replace the entire `if (showSavesList)` block with nothing
// Using a regex for the block
content = content.replace(/    if \(showSavesList\) \{\n[\s\S]*?    \}\n\n/g, '');

fs.writeFileSync('components/StartScreen.tsx', content);
