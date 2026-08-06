import React, { useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { ChartEntry, GameDate } from '../types';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import PlusIcon from './icons/PlusIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';

const ChartEntryItem: React.FC<{ entry: ChartEntry }> = ({ entry }) => {
    const { rank, lastWeek, peak, weeksOnChart, title, artist, coverArt, isPlayerSong } = entry;
    const [expanded, setExpanded] = useState(false);
    const { gameState } = useGame();

    const renderStatus = () => {
        const isNewEntry = lastWeek === null && weeksOnChart === 1;

        if (isNewEntry) {
            return (
                <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase">
                    New
                </div>
            );
        }

        if (lastWeek === null) {
            return <div className="h-5"></div>;
        }
        if (rank < lastWeek) {
            return <ArrowUpIcon className="w-5 h-5 text-green-500" />;
        }
        if (rank > lastWeek) {
            return <ArrowDownIcon className="w-5 h-5 text-red-500" />;
        }
        return <ArrowRightIcon className="w-4 h-4 text-zinc-400" />;
    };

    let boost = 1;
    if (entry.isPlayerSong && entry.songId) {
        for (const artistId in gameState.artistsData) {
            const aData = gameState.artistsData[artistId];
            const song = aData.songs.find(s => s.id === entry.songId);
            if (song) {
                const pushWeek = aData.lastPushToItunesWeek;
                const currentWeek = gameState.date.year * 52 + gameState.date.week;
                if (aData.lastPushedSongId === entry.songId && pushWeek && currentWeek - pushWeek <= 1) {
                    boost = 5 + Math.random() * 5;
                }
                break;
            }
        }
    }
    const hash = entry.uniqueId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const divisor = 750 + (hash % 250);
    const sales = Math.floor((entry.weeklyStreams || 0) / divisor) * boost;

    return (
        <div className="w-full border-b border-gray-200">
            <div className="flex w-full items-center gap-4 py-4 px-2">
                <div className="w-12 text-center flex-shrink-0">
                    <p className="text-3xl font-black text-black">{rank}</p>
                    <div className="mt-1 h-5 flex items-center justify-center">
                        {renderStatus()}
                    </div>
                </div>
                <img src={coverArt} alt={title} className="w-16 h-16 object-cover flex-shrink-0" />
                <div className="flex-grow min-w-0">
                    <p className={`font-bold text-xl truncate ${isPlayerSong ? 'text-red-600' : 'text-black'}`}>{title}</p>
                    <p className="text-zinc-600 text-base truncate">{artist}</p>
                    <p className="text-zinc-400 text-xs font-semibold mt-1 uppercase tracking-wider">
                        LW {lastWeek ?? '-'} - PEAK {peak} - WEEKS {weeksOnChart}
                    </p>
                </div>
                <button onClick={() => setExpanded(!expanded)} className="flex-shrink-0 p-2 border-2 border-zinc-300 rounded-full text-zinc-400 hover:border-black hover:text-black transition-colors bg-white">
                    <PlusIcon className={`w-5 h-5 transition-transform ${expanded ? 'rotate-45' : ''}`} />
                </button>
            </div>
            {expanded && (
                <div className="px-4 pb-4 animate-fade-in-up">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex gap-8">
                         <div className="flex-1">
                             <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Weekly Streams</p>
                             <p className="text-2xl font-black">{formatNumber(entry.weeklyStreams)}</p>
                         </div>
                         <div className="flex-1">
                             <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Digital Sales</p>
                             <p className="text-2xl font-black">{formatNumber(Math.floor(sales))}</p>
                         </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const HotPopSongsView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const { hotPopSongs, date } = gameState;

    const getWeekDate = (d: GameDate) => {
        const date = new Date(d.year, 0, (d.week - 1) * 7 + 1);
        const month = date.toLocaleString('en-US', { month: 'long' });
        const day = date.getDate();
        return `${month} ${day}, ${d.year}`;
    }

    return (
        <div className="bg-white text-black h-full overflow-y-auto">
             <header className="p-4 text-center sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b border-zinc-200">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="absolute top-1/2 left-4 -translate-y-1/2 p-2 rounded-full hover:bg-black/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-black tracking-tighter font-anton">HOT POP SONGS</h1>
                <p className="text-xs font-bold tracking-widest text-zinc-600 mt-1">WEEK OF {getWeekDate(date).toUpperCase()}</p>
            </header>
            
            <main className="max-w-5xl mx-auto">
                <div className="divide-y divide-gray-200">
                    {hotPopSongs.slice(0, 50).map(entry => (
                        <ChartEntryItem key={entry.uniqueId} entry={entry} />
                    ))}
                     {hotPopSongs.length === 0 && (
                        <div className="text-center py-20 text-zinc-500">
                            <p>The chart is empty.</p>
                            <p className="text-sm">Release pop music and wait a week for the chart to update.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default HotPopSongsView;