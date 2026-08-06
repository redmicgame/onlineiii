import re

with open('components/GameUI.tsx', 'r') as f:
    content = f.read()

old_import = "import React, { useEffect, useState } from 'react';"
new_import = "import React, { useEffect, useState } from 'react';\nimport LoadingScreen from './LoadingScreen';"
content = content.replace(old_import, new_import)
if "import LoadingScreen" not in content:
    content = content.replace("import React from 'react';", "import React, { useState } from 'react';\nimport LoadingScreen from './LoadingScreen';")
    if "import LoadingScreen" not in content:
        # Fallback
        content = "import LoadingScreen from './LoadingScreen';\n" + content

old_progress = """    const handleProgressWeek = () => {
        dispatch({ type: 'PROGRESS_WEEK' });
    };"""

new_progress = """    const [loadingData, setLoadingData] = useState<{ active: boolean, progress: number, text: string } | null>(null);

    const handleProgressWeek = () => {
        const stateStr = JSON.stringify(gameState);
        const sizeMB = stateStr.length / (1024 * 1024);
        
        if (sizeMB > 85) {
            setLoadingData({ active: true, progress: 0, text: 'Preparing to advance week...' });
            
            const extraMB = sizeMB - 85;
            const delayTime = Math.max(1500, Math.floor(extraMB * 200)); 
            
            let currentProgress = 0;
            const steps = 10;
            const stepTime = delayTime / steps;
            
            const stepInterval = setInterval(() => {
                currentProgress += 10;
                setLoadingData({ 
                    active: true, 
                    progress: currentProgress, 
                    text: `Simulating world events... (${sizeMB.toFixed(1)}MB save)` 
                });
                
                if (currentProgress >= 100) {
                    clearInterval(stepInterval);
                    dispatch({ type: 'PROGRESS_WEEK' });
                    setTimeout(() => {
                        setLoadingData(null);
                    }, 100);
                }
            }, stepTime);
        } else {
            dispatch({ type: 'PROGRESS_WEEK' });
        }
    };"""

content = content.replace(old_progress, new_progress)

old_return = """    return (
        <div className="h-full w-full flex flex-col bg-zinc-900 text-white relative">
            <main className="flex-grow overflow-y-auto pb-24 h-full">"""

new_return = """    return (
        <div className="h-full w-full flex flex-col bg-zinc-900 text-white relative">
            {loadingData && loadingData.active && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <h2 className="text-2xl font-bold text-white mb-2">Processing</h2>
                    <p className="text-zinc-400 mb-6">{loadingData.text}</p>
                    <div className="w-full max-w-md bg-zinc-800 rounded-full h-3 overflow-hidden">
                        <div className="bg-red-600 h-full transition-all duration-300 ease-out" style={{ width: `${loadingData.progress}%` }}></div>
                    </div>
                </div>
            )}
            <main className="flex-grow overflow-y-auto pb-24 h-full">"""

content = content.replace(old_return, new_return)

with open('components/GameUI.tsx', 'w') as f:
    f.write(content)
