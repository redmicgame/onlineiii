const fs = require('fs');
let content = fs.readFileSync('firebase.ts', 'utf8');

const toRemove = [
    /export const getUserSaves = async [\s\S]*?return \[\];\n    }\n};\n/g,
    /export const deleteCloudSave = async [\s\S]*?throw error;\n    }\n};\n/g,
    /export const saveGameToCloud = async [\s\S]*?throw error;\n    }\n};\n/g,
    /export const loadLegacyGameFromCloud = async [\s\S]*?return null;\n    }\n};\n/g,
    /\/\/ Also keep a legacy loader in case they have an old \/saves\/userId doc they try to load later\n/g
];

toRemove.forEach(regex => {
    content = content.replace(regex, '');
});

fs.writeFileSync('firebase.ts', content);
