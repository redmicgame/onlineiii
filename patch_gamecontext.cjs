const fs = require('fs');
let content = fs.readFileSync('context/GameContext.tsx', 'utf8');

const importTarget = 'import { loadGameFromCloud, saveGameToCloud } from "../firebase";';
content = content.replace(importTarget, '');

const targetEffect = `  useEffect(() => {
    if (!isLoading && !isAuthLoading && gameState.careerMode && user) {
      const timeout = setTimeout(async () => {
        try {
          let currentSaveId = gameState.cloudSaveId;
          if (!currentSaveId) {
            currentSaveId = \`save_\${Date.now()}_\${Math.random().toString(36).substring(7)}\`;
            dispatch({ type: "SET_CLOUD_SAVE_ID", payload: currentSaveId });
          }
          await saveGameToCloud(user.uid, currentSaveId, gameState);
        } catch (err) {
          console.error("Could not background save to Cloud DB", err);
        }
      }, 10000); // 10 seconds debounce

      return () => clearTimeout(timeout);
    }
  }, [gameState, isLoading, isAuthLoading, user]);`;

content = content.replace(targetEffect, '');
fs.writeFileSync('context/GameContext.tsx', content);
