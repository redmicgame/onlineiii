import React, { useState, useMemo } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import { Song, Release, Video } from '../types';
import ChevronDownIcon from './icons/ChevronDownIcon';
import InformationCircleIcon from './icons/InformationCircleIcon';
import WikipediaIcon from './icons/WikipediaIcon';
import GrammyAwardIcon from './icons/GrammyAwardIcon';
import ChartBarIcon from './icons/ChartBarIcon';

const AchievementCard: React.FC<{ title: string; children: React.ReactNode; accentColorClass?: string }> = ({ title, children, accentColorClass = 'text-zinc-400 border-zinc-700' }) => (
    <div className={`bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-xl border ${accentColorClass.replace('text-', 'border-')}/30 shadow-lg`}>
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <div className="space-y-1">{children}</div>
    </div>
);

const ItemRow: React.FC<{ item: Song | Release | Video; value: number; rank: number; isFaded?: boolean }> = ({ item, value, rank, isFaded }) => (
    <div className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${isFaded ? 'opacity-50' : ''}`}>
        <div className="flex items-center justify-center font-bold w-6 text-center text-zinc-400">
            {rank}
        </div>
        <img src={'coverArt' in item ? item.coverArt : item.thumbnail} alt={item.title} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
        <div className="flex-grow min-w-0">
            <p className="font-semibold truncate">{item.title}</p>
            <p className="text-sm text-zinc-400 font-mono">{formatNumber(value)}</p>
        </div>
    </div>
);

const ExpandableList: React.FC<{ 
    items: Array<Song | Release | Video>; 
    getValue: (item: any) => number;
    emptyMessage: string;
}> = ({ items, getValue, emptyMessage }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    if (items.length === 0) {
        return <p className="text-zinc-500 text-sm">{emptyMessage}</p>;
    }

    const displayedItems = isExpanded ? items.slice(0, 10) : items.slice(0, 3);
    const rowHeight = 64; // h-16 (4rem) + p-2 + space-y-1
    const listHeight = displayedItems.length * rowHeight;
    const expandedHeight = Math.min(10, items.length) * rowHeight;

    return (
        <div>
            <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ maxHeight: isExpanded ? `${expandedHeight}px` : `${listHeight}px` }}>
                <div className="space-y-1">
                    {displayedItems.map((item, i) => (
                        <ItemRow key={item.id} item={item} value={getValue(item)} rank={i + 1} isFaded={'isTakenDown' in item ? item.isTakenDown : false} />
                    ))}
                </div>
            </div>
            {items.length > 3 && (
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full pt-2 text-sm text-zinc-400 hover:text-white flex items-center justify-center gap-1 mt-2"
                >
                    {isExpanded ? 'Show Less' : `Show All ${Math.min(10, items.length)}`}
                    <ChevronDownIcon className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
            )}
        </div>
    );
};


const AchievementsView: React.FC = () => {
    const { gameState, dispatch, activeArtistData, activeArtist } = useGame();

    if (!activeArtistData || !activeArtist) {
        return <div className="p-4">Loading achievements...</div>;
    }

    const { songs, releases, videos, firstChartEntry } = activeArtistData;
    
    const mostStreamedSong = useMemo(() => {
        return [...songs].filter(s => s.isReleased).sort((a,b) => b.streams - a.streams)[0];
    }, [songs]);

    const topSongsFirstWeek = useMemo(() => songs
        .filter(s => typeof s.firstWeekStreams === 'number')
        .sort((a, b) => (b.firstWeekStreams ?? 0) - (a.firstWeekStreams ?? 0)), [songs]);

    const topAlbumsFirstWeek = useMemo(() => releases
        .filter(r => (r.type === 'Album' || r.type === 'EP' || r.type === 'Album (Deluxe)' || r.type === 'Compilation' || r.type === 'Live Album') && typeof r.firstWeekStreams === 'number')
        .sort((a, b) => {
            const bSPS = Math.floor((b.firstWeekStreams ?? 0) / 1500) + Math.floor(b.firstWeekSales ?? 0);
            const aSPS = Math.floor((a.firstWeekStreams ?? 0) / 1500) + Math.floor(a.firstWeekSales ?? 0);
            return bSPS - aSPS;
        }), [releases]);
        
    const topVideosFirstWeek = useMemo(() => videos
        .filter(v => typeof v.firstWeekViews === 'number')
        .sort((a, b) => (b.firstWeekViews ?? 0) - (a.firstWeekViews ?? 0)), [videos]);

    const topFraudulentSongs = useMemo(() => songs
        .filter(s => (s.removedStreams ?? 0) > 0)
        .sort((a, b) => (b.removedStreams ?? 0) - (a.removedStreams ?? 0)), [songs]);

    const bestReviewedProjects = useMemo(() => releases
        .filter(r => r.pitchforkReview)
        .sort((a, b) => (b.pitchforkReview?.score ?? 0) - (a.pitchforkReview?.score ?? 0)), [releases]);

    const topStreamedProjects = useMemo(() => releases
        .filter(r => !r.isTakenDown)
        .map(r => {
            const projectStreams = r.songIds.reduce((sum, songId) => {
                const song = songs.find(s => s.id === songId);
                return sum + (song?.streams || 0);
            }, 0);
            return { ...r, totalStreams: projectStreams };
        })
        .filter(r => r.totalStreams > 0)
        .sort((a, b) => b.totalStreams - a.totalStreams), [releases, songs]);

    return (
        <div className="h-full w-full bg-zinc-900 overflow-y-auto">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold">Achievements</h1>
                    <p className="text-sm text-zinc-400">Your Career Milestones</p>
                </div>
            </header>
            <main className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {mostStreamedSong && (
                    <div className={`md:col-span-2 bg-gradient-to-tr from-red-500/20 via-zinc-800 to-zinc-900 border border-red-500/30 p-4 rounded-xl flex flex-col md:flex-row items-center gap-6 ${mostStreamedSong.isTakenDown ? 'opacity-50' : ''}`}>
                        <img src={mostStreamedSong.coverArt} alt={mostStreamedSong.title} className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover shadow-2xl shadow-red-900/50" />
                        <div className="text-center md:text-left">
                            <p className="text-sm font-bold text-red-400 uppercase tracking-widest">Your Biggest Hit</p>
                            <h2 className="text-3xl md:text-4xl font-bold">{mostStreamedSong.title}</h2>
                            <p className="text-5xl md:text-6xl font-black text-white/80 mt-2">{formatNumber(mostStreamedSong.streams)}</p>
                            <p className="font-semibold text-zinc-400">{gameState.date.year >= 2008 ? "Total Streams" : "Total Sales"}</p>
                        </div>
                    </div>
                )}

                {firstChartEntry && (
                    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-xl border border-zinc-700/50">
                        <h2 className="text-xl font-bold mb-4">First Billboard Hot 100 Entry</h2>
                         <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-red-600/20 border-2 border-red-500 rounded-lg flex flex-col items-center justify-center text-white">
                                <p className="text-xs font-bold">DEBUT</p>
                                <p className="text-4xl font-black">#{firstChartEntry.rank}</p>
                            </div>
                            <div className="min-w-0">
                                <p className="font-semibold text-lg truncate">{firstChartEntry.songTitle}</p>
                                <p className="text-zinc-400 text-sm">Week {firstChartEntry.date.week}, {firstChartEntry.date.year}</p>
                            </div>
                        </div>
                    </div>
                )}
                
                {activeArtistData.peakMonthlyListeners && activeArtistData.peakMonthlyListeners > 0 && (
                    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-xl border border-blue-500/30">
                        <h2 className="text-xl font-bold mb-4 text-blue-400">Peak Monthly Listeners</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 w-full flex flex-col justify-center">
                                <p className="text-5xl font-black text-white">{formatNumber(activeArtistData.peakMonthlyListeners)}</p>
                                <p className="text-zinc-400 font-semibold mt-1">Listeners on Spotify</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeArtistData.peakHype && activeArtistData.peakHype > 0 && (
                    <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-4 rounded-xl border border-orange-500/30">
                        <h2 className="text-xl font-bold mb-4 text-orange-400">Peak Hype Achieved</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 w-full flex flex-col justify-center">
                                <p className="text-5xl font-black text-white">{formatNumber(Math.floor(activeArtistData.peakHype))}</p>
                                <p className="text-zinc-400 font-semibold mt-1">Hype Level</p>
                            </div>
                        </div>
                    </div>
                )}

                <AchievementCard title={gameState.date.year >= 2008 ? "Top First Week Streams" : "Top First Week Sales"} accentColorClass="text-green-400">
                    <ExpandableList 
                        items={topSongsFirstWeek} 
                        getValue={(item) => gameState.date.year >= 2008 ? (item.firstWeekStreams ?? 0) : Math.floor((item.firstWeekStreams ?? 0) / 150)} 
                        emptyMessage="No songs with first week data yet." 
                    />
                </AchievementCard>

                <AchievementCard title={gameState.date.year >= 2008 ? "Top First Week Album/EP Streams" : "Top First Week Album/EP Sales"} accentColorClass="text-green-400">
                    <ExpandableList 
                        items={topAlbumsFirstWeek} 
                        getValue={(item) => gameState.date.year >= 2008 ? (item.firstWeekStreams ?? 0) : (Math.floor((item.firstWeekStreams ?? 0) / 1500) + Math.floor(item.firstWeekSales ?? 0))} 
                        emptyMessage="No projects with first week data yet." 
                    />
                </AchievementCard>

                <AchievementCard title="Highest First Week Album Sales (SPS)" accentColorClass="text-purple-400">
                    <ExpandableList 
                        items={topAlbumsFirstWeek} 
                        getValue={(item) => Math.floor((item.firstWeekStreams ?? 0) / 1500) + Math.floor(item.firstWeekSales ?? 0)} 
                        emptyMessage="No projects with first week data yet." 
                    />
                </AchievementCard>
                
                <AchievementCard title={gameState.date.year >= 2008 ? "Top First Week Video Views" : "Top First Week Video Requests"} accentColorClass="text-red-400">
                    <ExpandableList 
                        items={topVideosFirstWeek} 
                        getValue={(item) => item.firstWeekViews ?? 0} 
                        emptyMessage="No videos with first week data yet." 
                    />
                </AchievementCard>

                <AchievementCard title="Most Fraudulent Songs" accentColorClass="text-yellow-400">
                    <ExpandableList 
                        items={topFraudulentSongs} 
                        getValue={(item) => item.removedStreams ?? 0} 
                        emptyMessage={gameState.date.year >= 2008 ? "No songs have had artificial streams removed yet." : "No songs have had artificial sales removed yet."} 
                    />
                </AchievementCard>
                
                <AchievementCard title="Highest Rated Projects (Pitchfork)" accentColorClass="text-red-400">
                    <ExpandableList 
                        items={bestReviewedProjects} 
                        getValue={(item) => item.pitchforkReview?.score ?? 0} 
                        emptyMessage="No projects reviewed by Pitchfork yet." 
                    />
                </AchievementCard>
                
                <AchievementCard title={gameState.date.year >= 2008 ? "Most Streamed Projects" : "Highest Selling Projects"} accentColorClass="text-green-500">
                    <ExpandableList 
                        items={topStreamedProjects as any} 
                        getValue={(item) => gameState.date.year >= 2008 ? (item.totalStreams ?? 0) : Math.floor((item.totalStreams ?? 0) / 1500)} 
                        emptyMessage={gameState.date.year >= 2008 ? "No streamed projects yet." : "No selling projects yet."} 
                    />
                </AchievementCard>
            </main>
        </div>
    );
};

export default AchievementsView;
