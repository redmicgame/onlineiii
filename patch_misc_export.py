import re

with open('components/MiscTab.tsx', 'r') as f:
    content = f.read()

old_export = """    const handleExport = () => {
        if (!activeArtist) {
            alert('Cannot export, no active artist.');
            return;
        }
        
        setShowExportOptions(false);
        setLoadingData({ active: true, progress: 0, text: 'Preparing save file...' });
        
        setTimeout(() => {
            try {
                const artistName = activeArtist.name.replace(/\s/g, '_');
                const dateStr = `${gameState.date.year}-W${gameState.date.week}`;
                
                const fileContent = JSON.stringify(gameState, null, 2); // Pretty print
                const sizeMB = fileContent.length / (1024 * 1024);
                const mimeType = 'application/json';
                const fileName = `red-mic-save_${artistName}_${dateStr}.json`;

                setLoadingData({ active: true, progress: 50, text: `Compressing ${sizeMB.toFixed(1)}MB save file...` });
                
                setTimeout(() => {
                    const blob = new Blob([fileContent], { type: mimeType });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    setLoadingData({ active: true, progress: 100, text: 'Download complete!' });
                    setTimeout(() => setLoadingData(null), 1000);
                }, 500);

            } catch (err) {
                console.error("Failed to export save data:", err);
                alert('Error exporting data. Please check the console.');
                setLoadingData(null);
            }
        }, 100);
    };"""

new_export = """    const handleExport = () => {
        if (!activeArtist) {
            alert('Cannot export, no active artist.');
            return;
        }
        
        setShowExportOptions(false);
        
        if (gameState.disableLoadingScreens) {
            try {
                const artistName = activeArtist.name.replace(/\s/g, '_');
                const dateStr = `${gameState.date.year}-W${gameState.date.week}`;
                const fileContent = JSON.stringify(gameState, null, 2);
                const mimeType = 'application/json';
                const fileName = `red-mic-save_${artistName}_${dateStr}.json`;
                
                const blob = new Blob([fileContent], { type: mimeType });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (err) {
                console.error("Failed to export save data:", err);
                alert('Error exporting data. Please check the console.');
            }
            return;
        }

        setLoadingData({ active: true, progress: 0, text: 'Preparing save file...' });
        
        setTimeout(() => {
            try {
                const artistName = activeArtist.name.replace(/\s/g, '_');
                const dateStr = `${gameState.date.year}-W${gameState.date.week}`;
                
                const fileContent = JSON.stringify(gameState, null, 2); // Pretty print
                const sizeMB = fileContent.length / (1024 * 1024);
                const mimeType = 'application/json';
                const fileName = `red-mic-save_${artistName}_${dateStr}.json`;

                setLoadingData({ active: true, progress: 50, text: `Compressing ${sizeMB.toFixed(1)}MB save file...` });
                
                setTimeout(() => {
                    const blob = new Blob([fileContent], { type: mimeType });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    
                    setLoadingData({ active: true, progress: 100, text: 'Download complete!' });
                    setTimeout(() => setLoadingData(null), 1000);
                }, 500);

            } catch (err) {
                console.error("Failed to export save data:", err);
                alert('Error exporting data. Please check the console.');
                setLoadingData(null);
            }
        }, 100);
    };"""

content = content.replace(old_export, new_export)

with open('components/MiscTab.tsx', 'w') as f:
    f.write(content)
