import { NPC_ARTIST_IMAGES } from "../constants";
import React, { useState, useEffect } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import InformationCircleIcon from './icons/InformationCircleIcon';
import PlayIcon from './icons/PlayIcon';
import XMarkIcon from './icons/XMarkIcon';

const UKChartView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const { ukSinglesChart = [], date } = gameState as any;
    
    const [selectedSong, setSelectedSong] = useState<any>(null);

    return (
        <div className="bg-[#fdf9f3] h-full text-black overflow-y-auto pb-24 relative">
            <header className="p-4 flex items-center bg-[#0024f0] text-white sticky top-0 z-10 shadow-md">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'apps' })} className="p-1 -ml-1 rounded-full hover:bg-black/10" aria-label="Go back">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex-1 flex justify-center gap-2 items-center text-2xl pr-8">
                    <svg className="w-8 h-8 text-white rotate-45" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 5h14v14H5z" />
                        <path d="M15 9l-6 6h6V9z" fill="#0024f0" />
                    </svg>
                    <span><span className="font-black">Official</span> <span className="font-light">Singles Chart</span></span>
                </div>
            </header>
            
            <main className="p-4">
                <div className="flex items-center gap-2 mb-6 text-sm font-semibold border-b border-zinc-300 pb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    view as cards
                </div>

                <div className="space-y-4">
                    {ukSinglesChart.map((entry: any, index: number) => {
                        const isUp = entry.lastWeek && entry.rank < entry.lastWeek;
                        const isDown = entry.lastWeek && entry.rank > entry.lastWeek;
                        const isSame = entry.lastWeek && entry.rank === entry.lastWeek;
                        const isNew = !entry.lastWeek;
                        
                        return (
                            <div key={entry.uniqueId} className="flex gap-4 items-center border-b border-zinc-200 pb-4">
                                <div className="flex flex-col items-center justify-center w-12">
                                    <span className="text-6xl font-black">{entry.rank}</span>
                                    {isUp && <div className="text-pink-500 text-2xl leading-none mt-1">▲</div>}
                                    {isDown && <div className="text-blue-700 text-2xl leading-none mt-1">▼</div>}
                                    {isNew && <div className="text-pink-500 text-[10px] font-bold uppercase mt-1">New</div>}
                                </div>
                                
                                <div className="relative flex-shrink-0">
                                    <img src={entry.coverArt} className="w-24 h-24 object-cover rounded" alt="cover" />
                                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center rounded">
                                        <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-white/30 backdrop-blur-sm">
                                            <PlayIcon className="w-6 h-6 text-white ml-1" />
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex-1 flex flex-col justify-center min-w-0 pl-2">
                                    <h3 className="font-black text-xl uppercase truncate leading-tight tracking-tight">{entry.title}</h3>
                                    <p className="italic text-sm truncate uppercase tracking-tight text-zinc-800 mt-1">{entry.artist}</p>
                                    
                                    <div className="text-[12px] mt-3 flex items-center gap-1 font-light tracking-wide text-black">
                                        LW: <span className="font-bold text-pink-500">{entry.lastWeek || '-'}</span> 
                                        <span className="ml-1">Peak:</span> <span className="font-bold text-blue-800">{entry.peak}</span>,
                                        <span className="ml-1">Weeks:</span> <span className="font-bold text-pink-500">{entry.weeksOnChart}</span>
                                    </div>
                                </div>
                                
                                <button className="p-1" onClick={() => setSelectedSong(entry)}>
                                    <InformationCircleIcon className="w-8 h-8 text-zinc-600" />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </main>

            {selectedSong && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white text-black rounded-xl w-full max-w-sm overflow-hidden shadow-2xl">
                        <div className="bg-[#0024f0] p-4 flex justify-between items-start text-white">
                            <div>
                                <h3 className="font-black text-xl uppercase leading-tight tracking-tight pr-4">{selectedSong.title}</h3>
                                <p className="text-sm opacity-90">{selectedSong.artist}</p>
                            </div>
                            <button onClick={() => setSelectedSong(null)} className="p-1 hover:bg-black/20 rounded-full transition-colors flex-shrink-0">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="p-5 space-y-6">
                            <div className="flex gap-4">
                                <img src={selectedSong.coverArt} className="w-20 h-20 object-cover rounded shadow" alt="cover" />
                                <div className="flex flex-col justify-center">
                                    <p className="text-sm text-zinc-500 uppercase font-semibold tracking-wider">Current Rank</p>
                                    <p className="text-3xl font-black text-[#0024f0]">#{selectedSong.rank}</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-[#fdf9f3] p-3 rounded-lg border border-zinc-200">
                                    <p className="text-xs text-zinc-500 uppercase font-bold mb-1">UK Streams</p>
                                    <p className="text-lg font-bold text-zinc-900">{formatNumber(selectedSong.weeklyStreams)}</p>
                                </div>
                                <div className="bg-[#fdf9f3] p-3 rounded-lg border border-zinc-200">
                                    <p className="text-xs text-zinc-500 uppercase font-bold mb-1">UK Airplay</p>
                                    <p className="text-lg font-bold text-zinc-900">{formatNumber(selectedSong.radioPlays)}</p>
                                </div>
                            </div>
                            
                            <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm flex items-start gap-2">
                                <InformationCircleIcon className="w-5 h-5 flex-shrink-0 mt-0.5 text-blue-600" />
                                <p>UK Official Singles Chart is determined by a combination of streaming data and radio airplay within the United Kingdom.</p>
                            </div>
                            
                            <button 
                                onClick={() => setSelectedSong(null)}
                                className="w-full py-3 bg-zinc-900 text-white font-bold rounded-lg hover:bg-black transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UKChartView;
