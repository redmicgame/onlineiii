import React, { useMemo, useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ChartBarIcon from './icons/ChartBarIcon';

interface PredictionEntry {
    id: string;
    title: string;
    artist: string;
    coverArt: string;
    label: string;
    pureSales: number;
    isUpcoming: boolean;
}

const AlbumPredictionsView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
    const [purchased, setPurchased] = useState(false);

    if (!activeArtistData) return null;

    const hasUnlocked = activeArtistData.albumPredictionsUnlocked || purchased;

    const predictions = useMemo(() => {
        if (!hasUnlocked) return [];
        const list: PredictionEntry[] = [];

        // Player's upcoming releases
        activeArtistData.labelSubmissions.forEach(sub => {
            if (sub.projectReleaseDate) {
                // Calculate preorder sales for this upcoming release
                const merchSales = activeArtistData.merch
                    .filter(m => m.releaseId === sub.release.id)
                    .reduce((sum, m) => sum + (m.unitsSold || 0), 0);
                
                const preorderSales = (sub.preorderSales || 0) + merchSales;

                const hash = (sub.release.id.charCodeAt(0) + (sub.release.id.charCodeAt(sub.release.id.length - 1) || 0) + gameState.date.week + gameState.date.year * 7) % 100;
                const stableRandom = hash / 100;

                list.push({
                    id: sub.release.id,
                    title: sub.release.title,
                    artist: activeArtist.name || "You",
                    coverArt: sub.release.coverArt,
                    label: sub.release.releasingLabel ? sub.release.releasingLabel.name : (activeArtistData.contract ? activeArtistData.contract.labelId : "Independent"),
                    pureSales: Math.floor(preorderSales * 1.5 + (stableRandom * 5000)), // Prediction
                    isUpcoming: true
                });
            }
        });

        // Player's released albums pure sales predictions
        activeArtistData.releases.forEach(rel => {
            if (rel.type === "Album" || rel.type === "EP" || rel.type === "Album (Deluxe)" || rel.type === "Compilation") {
                const weeksSinceRelease = (gameState.date.year - rel.releaseDate.year) * 52 + (gameState.date.week - rel.releaseDate.week);
                const chartEntry = gameState.billboardTopAlbums.find(c => c.albumId === rel.id);

                if (weeksSinceRelease <= 24 || chartEntry) {
                    // Approximate weekly pure sales
                    const totalVinylCDSales = activeArtistData.merch
                        .filter(m => m.releaseId === rel.id && !m.isPreorder)
                        .reduce((sum, m) => sum + (m._actualWeeklySales || 0), 0);
                    const rawSingleSales = rel.songIds.reduce((sum, songId) => {
                        const s = activeArtistData.songs.find(s => s.id === songId);
                        return sum + ((s?.actualLastWeekSales || 0) * 0.1);
                    }, 0);
                    
                    let predictedSales = chartEntry ? chartEntry.weeklySales : Math.floor(rawSingleSales + totalVinylCDSales);
                    
                    const hash = (rel.id.charCodeAt(0) + (rel.id.charCodeAt(rel.id.length - 1) || 0) + gameState.date.week + gameState.date.year * 7) % 100;
                    const stableRandom = hash / 100;
                    predictedSales = predictedSales * (0.8 + stableRandom * 0.4); // Add some variation

                    if (predictedSales > 500) {
                        list.push({
                            id: rel.id,
                            title: rel.title,
                            artist: activeArtist.name || "You",
                            coverArt: rel.coverArt,
                            label: rel.releasingLabel ? rel.releasingLabel.name : "Independent",
                            pureSales: Math.floor(predictedSales),
                            isUpcoming: false
                        });
                    }
                }
            }
        });

        // NPCs
        gameState.billboardTopAlbums.forEach(entry => {
            if (!entry.isPlayerAlbum) {
                const hash = (entry.uniqueId.charCodeAt(0) + (entry.uniqueId.charCodeAt(entry.uniqueId.length - 1) || 0) + gameState.date.week + gameState.date.year * 7) % 100;
                const stableRandom = hash / 100;
                const predictedSales = Math.floor(entry.weeklySales * (0.8 + stableRandom * 0.4));
                if (predictedSales > 500) {
                    list.push({
                        id: entry.uniqueId,
                        title: entry.title,
                        artist: entry.artist,
                        coverArt: entry.coverArt,
                        label: entry.label,
                        pureSales: predictedSales,
                        isUpcoming: false
                    });
                }
            }
        });

        return list.sort((a, b) => b.pureSales - a.pureSales).slice(0, 50);
    }, [hasUnlocked, activeArtistData, gameState.billboardTopAlbums]);

    // Check for massive vinyl sales on a scheduled album
    const massiveVinylAlbum = useMemo(() => {
        for (const sub of activeArtistData.labelSubmissions) {
            if (sub.projectReleaseDate) {
                const vinylSales = activeArtistData.merch
                    .filter(m => m.releaseId === sub.release.id && m.type === "Vinyl")
                    .reduce((sum, m) => sum + (m.unitsSold || 0), 0);
                if (vinylSales >= 7000000) {
                    return {
                        release: sub.release,
                        vinylSales
                    };
                }
            }
        }
        return null;
    }, [activeArtistData]);

    const handleUnlock = () => {
        if (activeArtistData.money >= 500) {
            dispatch({ type: 'UNLOCK_ALBUM_PREDICTIONS', payload: { cost: 500 } });
            setPurchased(true);
        } else {
            alert("Not enough money!");
        }
    };

    if (!hasUnlocked) {
        return (
            <div className="h-full overflow-y-auto w-full bg-black text-white flex flex-col items-center justify-center p-6 relative">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'game' })} className="absolute top-4 left-4 p-2 bg-white/10 rounded-full hover:bg-white/20">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="bg-zinc-900 p-8 rounded-2xl max-w-md w-full text-center border border-zinc-800 shadow-2xl">
                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ChartBarIcon className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-black mb-2 text-red-500">HITS Daily Double</h1>
                    <p className="text-xl font-bold mb-4">Top 50 Album Predictions</p>
                    <p className="text-zinc-400 mb-8 leading-relaxed">
                        Get exclusive access to early album predictions based on pure sales (vinyl, CD, digital). Track upcoming releases before they even drop!
                    </p>
                    <button 
                        onClick={handleUnlock}
                        disabled={activeArtistData.money < 500}
                        className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Unlock for $500
                    </button>
                    {activeArtistData.money < 500 && (
                        <p className="text-red-400 mt-4 text-sm font-semibold">Insufficient funds (Current: ${formatNumber(activeArtistData.money)})</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto w-full bg-[#FDFCF0] text-black font-sans pb-20">
            <header className="p-4 flex items-center justify-between bg-white border-b border-zinc-200 sticky top-0 z-20">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'game' })} className="p-2 hover:bg-zinc-100 rounded-full">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="text-center">
                    <h1 className="text-2xl font-black tracking-tighter text-red-600 italic">HITS</h1>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Top 50 Predictions (Pure Sales)</p>
                </div>
                <div className="w-10" />
            </header>

            {massiveVinylAlbum && (
                <div className="relative w-full h-[60vh] bg-black overflow-hidden flex items-end shadow-2xl group">
                    <img src={massiveVinylAlbum.release.coverArt} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-60 transition-opacity duration-700" alt="Cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="relative z-10 p-8 w-full text-center">
                        <div className="inline-block px-4 py-1 bg-red-600 text-white font-bold text-sm tracking-widest uppercase rounded-full mb-4 animate-pulse">
                            Massive Pre-orders
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">{massiveVinylAlbum.release.title}</h2>
                        <p className="text-xl md:text-2xl text-zinc-300 font-medium mb-4">{massiveVinylAlbum.vinylSales >= 7000000 ? "Over 7 Million Vinyls Sold!" : `${formatNumber(massiveVinylAlbum.vinylSales)} Vinyls Sold`}</p>
                        <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Releasing Soon</p>
                    </div>
                </div>
            )}

            {predictions.length > 0 && !massiveVinylAlbum && (
                <div className="relative w-full min-h-[500px] md:min-h-[70vh] bg-black overflow-hidden flex flex-col justify-end shadow-2xl group pt-24 pb-8">
                    <img src={predictions[0].coverArt} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-60 transition-opacity duration-700" alt="Cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/40 to-transparent" />
                    
                    <div className="absolute top-4 left-4 z-10">
                        <h1 className="text-4xl font-black tracking-tighter text-yellow-400 italic">HITS</h1>
                    </div>
                    <div className="absolute top-4 right-4 z-10 text-right">
                        <p className="text-xs font-bold text-white uppercase tracking-widest">UMG 59% SME 23% WMG 19%</p>
                    </div>

                    <div className="relative z-10 p-4 md:p-6 w-full text-left">
                        <div className="border-b-2 md:border-b-4 border-red-600 pb-2 mb-4 w-full">
                            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-[#c4b5fd] tracking-tight uppercase leading-none w-full">CHART FINAL: TOP 50</h2>
                        </div>
                        
                        <div className="flex flex-row items-end gap-3 md:gap-5">
                            <div className="relative w-24 h-24 md:w-36 md:h-36 flex-shrink-0">
                                <div className="absolute -top-2 -left-2 md:-top-3 md:-left-3 bg-red-600 text-white font-black text-xl md:text-2xl px-2 py-0.5 md:px-3 md:py-1 z-20 shadow-lg">
                                    #1
                                </div>
                                <img src={predictions[0].coverArt} alt="Number One" className="w-full h-full object-cover border border-zinc-800 shadow-2xl" />
                                <div className="absolute bottom-0 left-0 right-0 h-5 md:h-7 flex justify-between px-1.5 bg-black/80 items-center">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="w-1.5 h-2.5 md:w-2 md:h-3.5 bg-zinc-400/50 rounded-sm"></div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="flex-1 pb-0.5 md:pb-1">
                                {predictions[0].isUpcoming && (
                                    <span className="inline-block bg-[#FCD34D] text-black text-[9px] md:text-xs font-black px-1.5 py-0.5 md:px-2 md:py-1 uppercase tracking-widest mb-1.5 md:mb-2 shadow-sm rounded-sm">
                                        DEBUT
                                    </span>
                                )}
                                <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-0.5 md:mb-1 uppercase tracking-tight leading-none truncate">{predictions[0].artist}</h3>
                                <p className="text-sm md:text-xl lg:text-2xl text-zinc-300 font-bold mb-1.5 md:mb-2 italic leading-tight truncate">
                                    {predictions[0].title} <span className="text-[9px] md:text-xs lg:text-sm not-italic font-normal uppercase text-zinc-500 ml-1 md:ml-2">{predictions[0].label}</span>
                                </p>
                                <p className="text-xl md:text-3xl lg:text-4xl font-black text-white leading-none">
                                    {formatNumber(predictions[0].pureSales)} <span className="text-[9px] md:text-xs lg:text-sm font-bold text-zinc-400 uppercase tracking-widest ml-0.5 md:ml-1">PURE SALES</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto p-4 md:p-8 mt-4">
                <div className="bg-white rounded-3xl shadow-xl border border-zinc-100 overflow-hidden">
                    <div className="flex bg-[#F6F5E9] p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-200">
                        <div className="w-12 text-center">#</div>
                        <div className="flex-1">Album</div>
                        <div className="w-32 text-right">Pure Sales</div>
                    </div>
                    
                    <div className="divide-y divide-zinc-100">
                        {predictions.slice(massiveVinylAlbum ? 0 : 1).map((entry, idx) => {
                            const actualRank = massiveVinylAlbum ? idx + 1 : idx + 2;
                            return (
                            <div key={entry.id + idx} className={`flex items-center p-4 hover:bg-zinc-50 transition-colors ${entry.isUpcoming ? 'bg-yellow-50/30' : ''}`}>
                                <div className="w-12 text-center font-black text-2xl text-zinc-300">
                                    {actualRank}
                                </div>
                                <div className="flex-1 flex items-center gap-4 min-w-0">
                                    <div className="relative flex-shrink-0">
                                        <img src={entry.coverArt} alt={entry.title} className="w-16 h-16 rounded-lg object-cover shadow-md" />
                                        {entry.isUpcoming && (
                                            <span className="absolute -bottom-2 -right-2 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded-md uppercase border-2 border-white shadow-sm">
                                                DEBUT
                                            </span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-black text-lg md:text-xl truncate text-zinc-900 leading-tight">{entry.title}</h3>
                                        <p className="font-bold text-zinc-600 truncate text-sm md:text-base">{entry.artist}</p>
                                        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider truncate mt-0.5">{entry.label}</p>
                                    </div>
                                </div>
                                <div className="w-32 text-right">
                                    <p className="font-black text-xl text-zinc-900">{formatNumber(entry.pureSales)}</p>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Pure</p>
                                </div>
                            </div>
                        )})}
                        {predictions.length === 0 && (
                            <div className="p-12 text-center text-zinc-400 font-medium">
                                No predictions available for this week.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlbumPredictionsView;
