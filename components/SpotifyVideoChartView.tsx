import React from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ChevronLeftIcon from './icons/ChevronLeftIcon';

const SpotifyVideoChartView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    
    // Read from the newly added gameState.spotifyGlobalMusicVideos
    // Fallback to empty array if undefined
    const videoChart = gameState.spotifyGlobalMusicVideos || [];
    
    // Ensure we only take top 30 as user requested
    const displayChart = videoChart.slice(0, 30);

    return (
        <div className="bg-[#121212] h-full overflow-y-auto text-white pb-20">
            <header className="sticky top-0 bg-[#121212]/90 backdrop-blur-md p-4 flex items-center z-10">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'spotifyChart' })} className="p-1 -ml-1 rounded-full hover:bg-white/10" aria-label="Go back">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
            </header>
            
            <div className="px-4 pb-4">
                <div className="flex flex-col items-center text-center mt-2 mb-6">
                    <div className="w-52 h-52 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 mb-4 shadow-xl flex items-center justify-center rounded">
                        <div className="text-left p-4 w-full h-full flex flex-col justify-between">
                            <div>
                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.693 15.642c-.22.36-.684.478-1.042.257-2.857-1.745-6.452-2.14-10.672-1.173-.41.094-.82-.162-.914-.572-.094-.41.162-.82.572-.914 4.59-.105 8.524.333 11.758 2.31.36.22.478.683.257 1.042zm1.328-2.955c-.276.45-.856.598-1.306.322-3.266-2.008-8.243-2.613-11.956-1.428-.507.162-1.044-.117-1.205-.623-.162-.507.117-1.044.623-1.205 4.25-1.353 9.75-.68 13.522 1.636.45.276.598.856.322 1.306zm.13-3.084c-3.92-2.327-10.4-2.542-14.15-1.405-.595.18-1.226-.156-1.406-.75-.18-.595.156-1.226.75-1.406 4.34-1.317 11.536-1.063 16.082 1.636.53.315.705 1.002.39 1.533-.315.53-1.002.705-1.533.39z"/>
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-white leading-tight">Music Video</h1>
                                <h1 className="text-3xl font-black text-white leading-tight">Charts</h1>
                                <h1 className="text-3xl font-black text-white leading-tight">Global</h1>
                            </div>
                            
                        </div>
                    </div>
                    <p className="text-sm text-zinc-400 mt-2">Your daily update of the most played music videos right now - Global.</p>
                    <div className="flex items-center gap-2 mt-3 text-sm font-semibold">
                        <svg className="w-5 h-5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
                        </svg>
                        <span>Spotify</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <button className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center text-black hover:scale-105 transition-transform ml-auto">
                        <svg className="w-6 h-6 ml-1" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-4">
                    {displayChart.length === 0 && (
                        <p className="text-center text-zinc-500 italic mt-8">No music videos on the chart yet. Try advancing the week!</p>
                    )}
                    {displayChart.map((item, index) => {
                        let displayTitle = item.title;
                        let displayArtist = item.artist;
                        
                        if (displayTitle.includes(' - ')) {
                            const parts = displayTitle.split(' - ');
                            const extractedArtist = parts[0];
                            const extractedTitle = parts.slice(1).join(' - ');
                            
                            if (displayArtist === "Unknown Artist" || item.isPlayerVideo) {
                                if (extractedArtist) {
                                    displayArtist = extractedArtist;
                                }
                            }
                            displayTitle = extractedTitle;
                        }
                        
                        displayTitle = displayTitle.replace(/\s*\([^)]*(Video|Visualizer)\)[^]*$/i, '').trim();

                        return (
                        <div key={item.uniqueId} className="flex items-center gap-3">
                            <div className="w-6 text-center text-zinc-400 font-bold text-sm flex flex-col items-center">
                                <span>{item.rank}</span>
                                {item.lastWeek && item.lastWeek > item.rank && <span className="text-green-500 text-[10px]">▲</span>}
                                {item.lastWeek && item.lastWeek < item.rank && <span className="text-red-500 text-[10px]">▼</span>}
                                {item.lastWeek === item.rank && <span className="text-zinc-500 text-[10px]">—</span>}
                                {!item.lastWeek && <span className="text-yellow-500 text-[10px]">NEW</span>}
                            </div>
                            <div className="w-24 h-14 relative flex-shrink-0">
                                <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover rounded" />
                                <div className="absolute bottom-1 right-1 bg-black/70 text-[10px] px-1 rounded text-white">4:32</div>
                            </div>
                            <div className="flex-grow min-w-0">
                                <p className="text-white text-base truncate font-semibold">{displayTitle}</p>
                                <div className="flex items-center text-sm text-zinc-400 truncate gap-1 mt-0.5">
                                    <span className="truncate">{displayArtist}</span>
                                </div>
                                <p className="text-xs text-zinc-500 mt-1">{formatNumber(item.weeklyViews)} views</p>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SpotifyVideoChartView;
