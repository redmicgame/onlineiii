

import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import { useGame } from '../context/GameContext';
import HomeTab from './HomeTab';
import AppsTab from './AppsTab';
import MiscTab from './MiscTab';
import BusinessTab from './BusinessTab';
import BottomNav from './BottomNav';
import { getGlobalGameTime } from '../utils/globalClock';

const GameUI: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const { activeTab } = gameState;

    const [secondsLeft, setSecondsLeft] = useState<number>(900);
    const [showInfoToast, setShowInfoToast] = useState(false);

    useEffect(() => {
        const updateTimeAndSync = () => {
            const timeData = getGlobalGameTime();
            setSecondsLeft(timeData.nextTickInSeconds);

            dispatch({
                type: 'SYNC_SERVER_DATE',
                payload: {
                    year: timeData.year,
                    week: timeData.week,
                    day: timeData.day
                }
            });
        };

        updateTimeAndSync();
        const interval = setInterval(updateTimeAndSync, 1000);

        return () => clearInterval(interval);
    }, [dispatch]);

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'Home':
                return <HomeTab />;
            case 'Apps':
                return <AppsTab />;
            case 'Charts':
                return <HomeTab />;
            case 'Business':
                return <BusinessTab />;
            case 'Misc':
                return <MiscTab />;
            default:
                return <HomeTab />;
        }
    };

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const formattedTimer = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return (
        <div className="h-full w-full flex flex-col bg-zinc-900 text-white relative">
            <main className="flex-1 overflow-y-auto pb-24 -webkit-overflow-scrolling-touch">
                {renderActiveTab()}
            </main>

            {/* Global Server Sync Clock Widget (Disabled Manual Next Week Button) */}
            <div className="absolute z-20 bottom-24 right-4 flex flex-col items-end">
                {showInfoToast && (
                    <div className="mb-2 bg-zinc-900/95 border border-red-500/50 text-zinc-200 text-xs px-3 py-2 rounded-xl shadow-xl backdrop-blur-md max-w-[200px] text-right animate-fade-in">
                        🔒 Global Online Server: Time advances automatically every 15 minutes for all players worldwide.
                    </div>
                )}
                <button 
                  type="button"
                  onClick={() => {
                      setShowInfoToast(true);
                      setTimeout(() => setShowInfoToast(false), 3500);
                  }}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-3.5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 border border-red-400/30 hover:scale-105 transition-all cursor-pointer shadow-red-900/40">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
                  </span>
                  <div className="flex flex-col text-right">
                      <span className="text-[10px] font-black uppercase tracking-wider text-red-200 leading-none">Global Tick In</span>
                      <span className="font-mono font-extrabold text-sm text-amber-300 leading-tight mt-0.5">{formattedTimer}</span>
                  </div>
                </button>
            </div>

            <BottomNav />
        </div>
    );
};

export default GameUI;
