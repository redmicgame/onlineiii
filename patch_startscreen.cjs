const fs = require('fs');
let content = fs.readFileSync('components/StartScreen.tsx', 'utf8');

// We will just remove the fetchSaves logic and remove the "Load Cloud Save" button.

const effectTarget = `    React.useEffect(() => {
        if (user) {
            const fetchSaves = async () => {
                setIsLoadingSaves(true);
                const { getUserSaves } = await import('../firebase');
                const saves = await getUserSaves(user.uid);
                // Sort by most recently updated
                saves.sort((a, b) => b.updatedAt?.seconds - a.updatedAt?.seconds);
                setCloudSaves(saves);
                setIsLoadingSaves(false);
            };
            fetchSaves();
        } else {
            setShowSavesList(false);
            setCloudSaves([]);
        }
    }, [user]);`;

content = content.replace(effectTarget, '');

const loadSaveFunc = `    const handleLoadCloudSave = async (saveData: any) => {
        setLoadingSaveMsg("Loading game...");
        const { loadLegacyGameFromCloud } = await import('../firebase');
        try {
            let loadedState = saveData.gameState;
            if (!loadedState && saveData.id === user?.uid) {
               // Legacy
               loadedState = await loadLegacyGameFromCloud(user.uid);
            }

            if (loadedState) {
                const hydrated = await injectMediaIntoState(loadedState, (pct, msg) => {
                   setLoadingSaveMsg(msg || \`Loading \${pct}%\`);
                });
                
                await db.saves.put({
                    id: 1, 
                    state: hydrated
                });
                setActiveSaveId(1);
                
                setTimeout(() => {
                   window.location.reload();
                }, 100);
            } else {
                alert("Could not load save data.");
                setLoadingSaveMsg("");
            }
        } catch (e) {
             console.error("Load save error", e);
             alert("Error loading save data.");
             setLoadingSaveMsg("");
        }
    };`;
content = content.replace(loadSaveFunc, '');

const deleteSaveFunc = `    const confirmDeleteSave = async () => {
        if (!user || !saveToDelete) return;
        try {
            const { deleteCloudSave } = await import('../firebase');
            await deleteCloudSave(user.uid, saveToDelete);
            setCloudSaves(prev => prev.filter(s => s.id !== saveToDelete));
            setSaveToDelete(null);
        } catch(e) {
            alert("Failed to delete save.");
        }
    };`;
content = content.replace(deleteSaveFunc, '');

// Also remove the JSX for cloud saves list... 
// It's a bit harder to regex out the JSX, I'll just clear the cloudSaves array rendering or remove it if I can.
