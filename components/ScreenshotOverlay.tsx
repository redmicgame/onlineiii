import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

export const ScreenshotOverlay: React.FC = () => {
    const { gameState } = useGame();
    const overlayRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMacScreenshot = e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5');
            const isWinScreenshot = e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && (e.key === 's' || e.key === 'S'));
            
            if (isMacScreenshot || isWinScreenshot) {
                if (overlayRef.current) {
                    // Show it instantly via DOM manipulation
                    overlayRef.current.style.display = 'block';
                    overlayRef.current.style.opacity = '1';
                    
                    if (timeoutRef.current) {
                        clearTimeout(timeoutRef.current);
                    }
                    
                    // Hide it after a few seconds
                    timeoutRef.current = setTimeout(() => {
                        if (overlayRef.current) {
                            overlayRef.current.style.opacity = '0';
                            setTimeout(() => {
                                if (overlayRef.current) {
                                    overlayRef.current.style.display = 'none';
                                }
                            }, 300);
                        }
                    }, 4000);
                }
            }
        };

        // Use capture phase to intercept as early as possible
        window.addEventListener('keydown', handleKeyDown, true);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown, true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    if (!gameState.difficultyMode) return null;

    return (
        <div 
            ref={overlayRef}
            className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none transition-opacity duration-300 flex justify-center"
            style={{ display: 'none', opacity: 0 }}
        >
            <div className="bg-black text-white font-bold text-sm uppercase tracking-widest px-4 py-1">
                {gameState.difficultyMode} MODE
            </div>
        </div>
    );
};
