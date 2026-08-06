import re

with open('components/MiscTab.tsx', 'r') as f:
    content = f.read()

old_export = """    const handleExport = () => {
        if (!activeArtist) {
            alert('Cannot export, no active artist.');
            return;
        }
        try {
            const artistName = activeArtist.name.replace(/\s/g, '_');
            const dateStr = `${gameState.date.year}-W${gameState.date.week}`;
            
            const fileContent = JSON.stringify(gameState, null, 2); // Pretty print
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
        setShowExportOptions(false);
    };"""

new_export = """    const [loadingData, setLoadingData] = useState<{ active: boolean, progress: number, text: string } | null>(null);

    const handleExport = () => {
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

content = content.replace(old_export, new_export)

old_return = """    return (
        <>
            <div className="bg-[#121212] min-h-full p-4 text-white pb-24">"""

new_return = """    return (
        <>
            {loadingData && loadingData.active && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <h2 className="text-2xl font-bold text-white mb-2">Downloading Save</h2>
                    <p className="text-zinc-400 mb-6">{loadingData.text}</p>
                    <div className="w-full max-w-md bg-zinc-800 rounded-full h-3 overflow-hidden">
                        <div className="bg-red-600 h-full transition-all duration-300 ease-out" style={{ width: `${loadingData.progress}%` }}></div>
                    </div>
                </div>
            )}
            <div className="bg-[#121212] min-h-full p-4 text-white pb-24">"""

content = content.replace(old_return, new_return)

with open('components/MiscTab.tsx', 'w') as f:
    f.write(content)
