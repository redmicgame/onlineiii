const fs = require('fs');
let content = fs.readFileSync('components/StartScreen.tsx', 'utf8');

const loadFunc = `    const handleLoadCloudSave = async (saveData: any) => {
        setLoadingSaveMsg("Loading game...");
        try {
            const { loadLegacyGameFromCloud, injectMediaIntoState } = await import('../firebase');
            let loadedState = saveData.gameState;
            if (!loadedState && saveData.id === user?.uid) {
               // Legacy
               loadedState = await loadLegacyGameFromCloud(user.uid);
            }

            if (loadedState) {
                // ...
            }
        } catch(e){}
    };`;

// We'll just regex out all these unused functions.

content = content.replace(/    const handleLoadCloudSave = async [\s\S]*?    };\n/g, '');
content = content.replace(/    const confirmDeleteCloudSave = async [\s\S]*?    };\n/g, '');

const btnTarget = /<button[\s\S]*?onClick=\{\(\) => setShowSavesList\(true\)\}[\s\S]*?<\/button>/g;
content = content.replace(btnTarget, '');

fs.writeFileSync('components/StartScreen.tsx', content);
