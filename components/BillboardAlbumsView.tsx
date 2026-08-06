


import React from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { AlbumChartEntry } from '../types';
import CalendarIcon from './icons/CalendarIcon';
import InformationCircleIcon from './icons/InformationCircleIcon';
import ArrowUpTrayIcon from './icons/ArrowUpTrayIcon';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const AlbumChartEntryItem: React.FC<{ entry: AlbumChartEntry }> = ({ entry }) => {
    const { rank, title, artist, coverArt, label, weeklyActivity, weeklySales } = entry;

    const rankColorClass = rank === 1 ? 'bg-red-600 text-white rounded-md' : 'text-black font-bold';

    return (
        <div className="flex items-start gap-4 py-4 border-b border-zinc-200">
            {/* Rank */}
            <div className="flex-shrink-0 w-12 flex justify-center mt-2">
                <div className={`w-8 h-8 flex items-center justify-center font-bold text-xl ${rankColorClass}`}>
                    {rank}
                </div>
            </div>
            
            {/* Art */}
            <img src={coverArt} alt={title} className="w-24 h-24 shadow-md object-cover flex-shrink-0" />
            
            {/* Info */}
            <div className="flex-grow min-w-0">
                <h3 className="font-bold text-lg uppercase leading-tight truncate text-black">{title}</h3>
                <p className="text-sm font-semibold uppercase text-zinc-600 truncate">{artist}</p>
                <p className="text-xs font-semibold uppercase text-zinc-400 mb-3 truncate">{label}</p>
                
                <div className="flex gap-6 text-xs font-bold text-zinc-500 tracking-wide">
                   <div>
                     <p className="mb-0.5">ACTIVITY</p>
                     <p className="text-black text-base font-normal">{formatNumber(weeklyActivity)}</p>
                   </div>
                   <div>
                     <p className="mb-0.5">ALBUMS</p>
                     <p className="text-black text-base font-normal">{formatNumber(weeklySales)}</p>
                   </div>
                </div>
            </div>
        </div>
    );
};


const BillboardAlbumsView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const { billboardTopAlbums } = gameState;

    return (
        <div className="bg-white text-black h-full overflow-y-auto">
            <header className="p-4 text-center sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-zinc-200">
                 <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="absolute top-1/2 left-4 -translate-y-1/2 p-2 rounded-full hover:bg-zinc-100">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-black tracking-tight font-anton uppercase">BILLBOARD 200</h1>
                <p className="text-xs font-medium text-zinc-500 mt-1">The week's 200 most popular albums.</p>
            </header>
            
            <main className="max-w-3xl mx-auto px-4">
                 <div className="divide-y divide-zinc-200">
                    {billboardTopAlbums.length > 0 ? (
                        billboardTopAlbums.map(entry => (
                            <AlbumChartEntryItem key={entry.uniqueId} entry={entry} />
                        ))
                    ) : (
                        <div className="text-center py-20 text-zinc-500">
                            <p>The chart is empty.</p>
                            <p className="text-sm mt-2">Release an EP or Album to see it here next week.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default BillboardAlbumsView;