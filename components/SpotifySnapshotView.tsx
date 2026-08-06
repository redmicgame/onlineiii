import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { Release, Song } from '../types';
import { FastAverageColor } from 'fast-average-color';

const SpotifySnapshotView: React.FC<{ release: Release; onBack: () => void; }> = ({ release, onBack }) => {
    const { gameState, activeArtist, activeArtistData, dispatch } = useGame();
    const { date } = gameState;
    const [dominantColor, setDominantColor] = useState('#1e3a8a'); // Default dark blue
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!release.coverArt) return;
        const fac = new FastAverageColor();
        fac.getColorAsync(release.coverArt, { algorithm: 'dominant' })
            .then(color => {
                setDominantColor(color.hex);
            })
            .catch(e => {
                console.error("Error getting color", e);
            });
    }, [release.coverArt]);

    if (!activeArtist || !activeArtistData) return null;
    const { songs } = activeArtistData;

    const releaseSongs = release.songIds.map(id => songs.find(s => s.id === id)).filter(Boolean) as Song[];
    
    // Group songs
    let standardSongs: Song[] = [];
    let deluxeSongs: Song[] = [];
    
    if (release.standardEditionId && activeArtistData?.releases) {
        const standard = activeArtistData.releases.find(r => r.id === release.standardEditionId);
        if (standard) {
            const standardSongIds = new Set(standard.songIds);
            standardSongs = releaseSongs.filter(s => standardSongIds.has(s.id));
            deluxeSongs = releaseSongs.filter(s => !standardSongIds.has(s.id));
        } else {
            standardSongs = releaseSongs;
        }
    } else {
        standardSongs = releaseSongs;
    }

    const hasDeluxe = deluxeSongs.length > 0;

    const getRowData = (song: Song) => {
        const weekStreams = song.actualLastWeekStreams !== undefined ? song.actualLastWeekStreams : (song.lastWeekStreams || 0);
        const prevStreams = song.actualPrevWeekStreams !== undefined ? song.actualPrevWeekStreams : (song.prevWeekStreams || 0);
        
        let changePercentDisplay = '-';
        let changeDisplay = '-';
        
        if (prevStreams > 0) {
            const change = ((weekStreams - prevStreams) / prevStreams) * 100;
            changePercentDisplay = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
            const rawChange = weekStreams - prevStreams;
            changeDisplay = `${rawChange >= 0 ? '+' : ''}${rawChange.toLocaleString()}`;
        } else if (weekStreams > 0) {
            changePercentDisplay = '+NEW';
            changeDisplay = `+${weekStreams.toLocaleString()}`;
        }

        return { weekStreams, prevStreams, changePercentDisplay, changeDisplay, netWeekly: weekStreams };
    };

    // Responsive scaling
    const [scale, setScale] = useState(1);
    
    useEffect(() => {
        const updateScale = () => {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Base width of the snapshot
            const targetWidth = 800;
            
            // Estimate height (banner 192px + date 40px + header 48px + footer 44px + rows ~37px each)
            const rowCount = standardSongs.length + deluxeSongs.length + (hasDeluxe ? 2 : 0) + 1;
            const estimatedHeight = 192 + 40 + 60 + 60 + (rowCount * 45) + 64; // +64 for extra safe margin // 32px for padding
            
            const widthScale = (viewportWidth - 32) / targetWidth; // 32px padding
            const heightScale = (viewportHeight - 32) / estimatedHeight;
            
            // Use the smaller scale so it fits entirely, cap at 1
            setScale(Math.min(1, widthScale, heightScale));
        };
        
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [standardSongs.length, deluxeSongs.length, hasDeluxe]);

    const isUglyStyle = gameState.spotifySnapshotStyle === 'ugly';

    if (isUglyStyle) {
        const totalStreams = releaseSongs.reduce((acc, song) => acc + (song.streams || 0), 0);
        const totalWeeklyStreams = releaseSongs.reduce((acc, song) => {
            const w = song.actualLastWeekStreams !== undefined ? song.actualLastWeekStreams : (song.lastWeekStreams || 0);
            return acc + w;
        }, 0);
        const totalPrevWeeklyStreams = releaseSongs.reduce((acc, song) => {
            const p = song.actualPrevWeekStreams !== undefined ? song.actualPrevWeekStreams : (song.prevWeekStreams || 0);
            return acc + p;
        }, 0);

        const overallNetChange = totalWeeklyStreams - totalPrevWeeklyStreams;
        const overallPct = totalPrevWeeklyStreams > 0 ? (overallNetChange / totalPrevWeeklyStreams) * 100 : 0;
        const isOverallPos = overallNetChange >= 0;

        const year = date?.year || 2026;
        const week = date?.week || 1;
        const dayValue = date?.day !== undefined ? date.day : 7;
        const dateObj = new Date(year, 0, (week - 1) * 7 + dayValue);
        const monthName = dateObj.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
        const day = dateObj.getDate();
        const yearNum = dateObj.getFullYear();
        const weekdayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

        return (
            <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto" onClick={onBack}>
                <div 
                    className="w-full max-w-4xl bg-[#0d0e0f] border border-zinc-800/80 p-5 sm:p-8 text-white font-mono shadow-2xl rounded-2xl flex flex-col my-auto" 
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header Area */}
                    <div className="flex gap-5 sm:gap-8 items-start mb-6 border-b border-zinc-800/60 pb-6 shrink-0">
                        {/* Left: Cover Art & Artist Name */}
                        <div className="w-[28%] sm:w-[24%] flex flex-col items-center shrink-0">
                            <div className="relative w-full aspect-square shadow-[0_0_25px_rgba(0,0,0,0.9)] border border-zinc-800 rounded-sm overflow-hidden">
                                <img src={release.coverArt} className="w-full h-full object-cover" alt="Cover" />
                            </div>
                            <div className="text-zinc-300 font-sans font-bold text-xs sm:text-sm mt-3 uppercase tracking-wider text-center truncate w-full">
                                {activeArtist.name}
                            </div>
                        </div>

                        {/* Right: Album Title, Date, Large Stream Stat */}
                        <div className="w-[72%] sm:w-[76%] flex flex-col justify-between min-h-[150px] pl-2">
                            <div>
                                <h1 className="text-3xl sm:text-5xl font-sans font-extrabold text-white leading-none tracking-tight uppercase mb-2 truncate">
                                    {release.title}
                                </h1>
                                <div className="text-zinc-400 text-xs sm:text-sm flex items-center gap-2 uppercase font-mono tracking-wider mb-5">
                                    <span>📅</span> {monthName} {day}, {yearNum} | {weekdayName}
                                </div>
                            </div>

                            {/* Large Streams Box */}
                            <div className="flex items-center gap-3 sm:gap-5 mb-4 flex-wrap">
                                <span className="text-zinc-400 text-2xl sm:text-3xl font-bold font-mono">↗</span>
                                <div className="text-4xl sm:text-6xl font-mono font-black text-white tracking-tight">
                                    {totalWeeklyStreams.toLocaleString()}
                                </div>
                                <div className={`${isOverallPos ? 'bg-[#16a34a]' : 'bg-[#dc2626]'} text-white text-xs sm:text-base font-extrabold font-mono px-3 py-1.5 rounded flex items-center gap-1`}>
                                    {isOverallPos ? '↑ ' : '↓ '}{Math.abs(overallPct).toFixed(2)}%
                                </div>
                            </div>

                            {/* Total Streams Bar */}
                            <div className="flex items-center gap-2 text-zinc-400 text-xs sm:text-sm font-mono uppercase tracking-wider border-t border-zinc-800/40 pt-2.5">
                                <span>☑</span>
                                <span className="text-white font-bold">{totalStreams.toLocaleString()}</span>
                                <span className="text-zinc-500 font-normal">| TOTAL STREAMS</span>
                            </div>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="w-full flex flex-col flex-1 min-h-0">
                        {/* Header Row */}
                        <div className="grid grid-cols-[2rem_1fr_6.5rem_5.5rem_5rem_6.5rem] sm:grid-cols-[2.5rem_1fr_8rem_6.5rem_6rem_8rem] gap-2 p-2 text-xs sm:text-sm font-bold text-[#22c55e] border-b border-zinc-800 font-mono uppercase tracking-wider shrink-0">
                            <div className="col-span-2">TRACK</div>
                            <div className="text-right">DAILY STREAMS</div>
                            <div className="text-right">CHANGE</div>
                            <div className="text-right">%CHANGE</div>
                            <div className="text-right">TOTAL</div>
                        </div>

                        {/* Track Rows */}
                        <div className="py-1 pr-1 space-y-0.5">
                            {releaseSongs.map((song, i) => {
                                const data = getRowData(song);
                                const streamCount = data.weekStreams;
                                const prev = data.prevStreams;
                                const rawChange = streamCount - prev;
                                const pctChange = prev > 0 ? (rawChange / prev) * 100 : 0;
                                const isPos = rawChange >= 0;

                                return (
                                    <div 
                                        key={song.id} 
                                        className="grid grid-cols-[2rem_1fr_6.5rem_5.5rem_5rem_6.5rem] sm:grid-cols-[2.5rem_1fr_8rem_6.5rem_6rem_8rem] gap-2 px-2 py-2 text-xs sm:text-sm items-center hover:bg-zinc-800/40 transition-colors border-b border-zinc-900/40"
                                    >
                                        <div className="flex items-center gap-2 col-span-2 min-w-0">
                                            <span className="text-[#22c55e] font-mono font-bold text-xs sm:text-sm shrink-0 w-5">
                                                {i + 1}
                                            </span>
                                            <span className="truncate font-sans font-medium text-white text-xs sm:text-sm">
                                                {song.title}
                                            </span>
                                        </div>
                                        <div className="text-right text-white font-mono text-xs sm:text-sm">
                                            {streamCount.toLocaleString()}
                                        </div>
                                        <div className={`text-right font-mono text-xs sm:text-sm ${isPos ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                                            {isPos ? '+' : ''}{rawChange.toLocaleString()}
                                        </div>
                                        <div className={`text-right font-mono text-xs sm:text-sm ${isPos ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                                            {isPos ? '↑ ' : '↓ '}{Math.abs(pctChange).toFixed(2)}%
                                        </div>
                                        <div className="text-right text-white font-mono text-xs sm:text-sm">
                                            {(song.streams || 0).toLocaleString()}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* TOTAL Footer Row */}
                        <div className="grid grid-cols-[2rem_1fr_6.5rem_5.5rem_5rem_6.5rem] sm:grid-cols-[2.5rem_1fr_8rem_6.5rem_6rem_8rem] gap-2 p-2 text-xs sm:text-sm font-bold items-center border-t border-zinc-800 mt-2 pt-3 font-mono shrink-0">
                            <div className="col-span-2 flex items-center">
                                <span className="bg-[#22c55e] text-black text-xs font-extrabold px-1.5 py-0.5 rounded-xs font-mono uppercase">
                                    TOTAL
                                </span>
                            </div>
                            <div className="text-right text-white font-mono">
                                {totalWeeklyStreams.toLocaleString()}
                            </div>
                            <div className={`text-right font-mono ${isOverallPos ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                                {isOverallPos ? '+' : ''}{overallNetChange.toLocaleString()}
                            </div>
                            <div className={`text-right font-mono ${isOverallPos ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                                {overallPct.toFixed(2)}%
                            </div>
                            <div className="text-right text-white font-mono">
                                {totalStreams.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderRows = (songsToRender: Song[]) => {
        return songsToRender.map((song, index) => {
            const data = getRowData(song);
            const isNegative = data.netWeekly < 0;
            const isChangeNegative = data.changePercentDisplay.startsWith('-');
            return (
                <tr key={song.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100/50'}>
                    <td className="p-2 font-bold text-black border border-gray-300 text-center">{song.title}</td>
                    <td className="text-center p-2 text-gray-700 border border-gray-300">{(song.streams || 0).toLocaleString()}</td>
                    <td className={`text-center p-2 font-bold border border-gray-300 ${isNegative ? 'text-red-600' : 'text-gray-800'}`}>
                        {isNegative ? '' : '+'}{data.netWeekly.toLocaleString()}
                    </td>
                    <td className={`text-center p-2 font-semibold border border-gray-300 ${isChangeNegative ? 'text-red-600' : 'text-green-600'}`}>
                        {data.changePercentDisplay}
                    </td>
                    <td className={`text-center p-2 font-semibold border border-gray-300 ${isChangeNegative ? 'text-red-600' : 'text-green-600'}`}>
                        {data.changeDisplay}
                    </td>
                </tr>
            );
        });
    };

    const renderSubtotal = (songsList: Song[], label: string, bgColor: string) => {
        const totalStreams = songsList.reduce((acc, song) => acc + (song.streams || 0), 0);
        const totalWeeklyStreams = songsList.reduce((acc, song) => {
            const w = song.actualLastWeekStreams !== undefined ? song.actualLastWeekStreams : (song.lastWeekStreams || 0);
            return acc + w;
        }, 0);
        const totalPrevWeeklyStreams = songsList.reduce((acc, song) => {
            const p = song.actualPrevWeekStreams !== undefined ? song.actualPrevWeekStreams : (song.prevWeekStreams || 0);
            return acc + p;
        }, 0);

        let changePercentDisplay = '-';
        let changeDisplay = '-';
        if (totalPrevWeeklyStreams > 0) {
            const change = ((totalWeeklyStreams - totalPrevWeeklyStreams) / totalPrevWeeklyStreams) * 100;
            changePercentDisplay = `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
            const rawChange = totalWeeklyStreams - totalPrevWeeklyStreams;
            changeDisplay = `${rawChange >= 0 ? '+' : ''}${rawChange.toLocaleString()}`;
        } else if (totalWeeklyStreams > 0) {
            changePercentDisplay = '+NEW';
            changeDisplay = `+${totalWeeklyStreams.toLocaleString()}`;
        }

        return (
            <tr className="font-bold text-white border-y border-gray-300" style={{ backgroundColor: bgColor }}>
                <td className="p-2 text-center border-r border-gray-300/30">{label}</td>
                <td className="text-center p-2 border-r border-gray-300/30">{totalStreams.toLocaleString()}</td>
                <td className={`text-center p-2 border-r border-gray-300/30`}>
                    {totalWeeklyStreams >= 0 ? '+' : ''}{totalWeeklyStreams.toLocaleString()}
                </td>
                <td className={`text-center p-2 border-r border-gray-300/30`}>
                    {changePercentDisplay}
                </td>
                <td className={`text-center p-2`}>
                    {changeDisplay}
                </td>
            </tr>
        );
    };

    const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    dispatch({ type: 'UPDATE_SNAPSHOT_BANNER', payload: { releaseId: release.id, bannerUrl: event.target.result as string }});
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden" onClick={onBack}>
            <div 
                className="w-[800px] shadow-2xl rounded-lg overflow-hidden relative font-sans shrink-0" 
                onClick={e => e.stopPropagation()} 
                style={{ 
                    transform: `scale(${scale})`, 
                    transformOrigin: 'center center'
                }}
            >
                
                {/* Banner Area */}
                <div 
                    className="w-full h-48 bg-zinc-800 relative cursor-pointer group flex items-center justify-between px-8 border-b-4 border-black overflow-hidden"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ 
                        backgroundImage: release.snapshotBanner ? `url(${release.snapshotBanner})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="absolute inset-0 bg-black/40 z-0 group-hover:bg-black/50 transition-colors" />
                    
                    <div className="relative z-10 flex items-center gap-6">
                        <img src={release.coverArt} className="w-32 h-32 rounded-sm shadow-xl" alt="Cover" />
                    </div>
                    
                    <div className="relative z-10 flex-grow text-center pointer-events-none">
                         {!release.snapshotBanner ? (
                            <div className="flex flex-col items-center">
                                <h1 className="text-5xl font-black text-white uppercase tracking-tighter drop-shadow-lg">{release.title}</h1>
                                <span className="text-white/80 font-bold mt-2">Tap to upload custom banner</span>
                            </div>
                         ) : null}
                    </div>

                    <div className="relative z-10 font-bold text-white/50 italic pointer-events-none">
                         Charts by Red Mic
                    </div>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleBannerUpload} className="hidden" />
                </div>

                {/* Date Row */}
                <div className="p-2 text-center text-white font-bold tracking-wide" style={{ backgroundColor: dominantColor }}>
                    Week {date.week}, {date.year}
                </div>

                {/* Table */}
                <div className="bg-white text-black">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="text-center p-3 font-bold border border-gray-600">Song</th>
                                <th className="text-center p-3 font-bold border border-gray-600">Total Streams</th>
                                <th className="text-center p-3 font-bold border border-gray-600">Weekly Streams</th>
                                <th className="text-center p-3 font-bold border border-gray-600">% Change</th>
                                <th className="text-center p-3 font-bold border border-gray-600">Net Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderRows(standardSongs)}
                            {hasDeluxe && renderSubtotal(standardSongs, "Standard Album", dominantColor)}
                            {hasDeluxe && renderRows(deluxeSongs)}
                            {hasDeluxe && renderSubtotal(deluxeSongs, "Deluxe", dominantColor + 'cc')} {/* Slight transparency for deluxe */}
                        </tbody>
                        <tfoot>
                            {renderSubtotal(releaseSongs, "TOTAL", "#000000")}
                        </tfoot>
                    </table>
                </div>

                {/* Footer */}
                <div className="p-3 flex justify-between items-center text-sm font-semibold text-gray-600 bg-white border-t border-gray-300">
                    <span className="flex items-center gap-2">
                        <img src={activeArtist.image} className="w-5 h-5 rounded-full" alt="Artist"/>
                        @Red Mic
                    </span>
                    {gameState.difficultyMode && (
                        <span className="text-xs uppercase opacity-50 tracking-wider">
                            {gameState.difficultyMode} MODE
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SpotifySnapshotView;
