import React, { useMemo, useState } from 'react';
import { useGame } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import VmaAwardIcon from './icons/VmaAwardIcon';

const VMAsView: React.FC = () => {
    const { dispatch, activeArtist, activeArtistData } = useGame();
    if (!activeArtist || !activeArtistData) return null;

    const { vmaHistory, songs, videos } = activeArtistData;

    const wins = useMemo(() => vmaHistory.filter(g => g.isWinner).length, [vmaHistory]);
    const nominations = useMemo(() => vmaHistory.length, [vmaHistory]);

    const awardsByYear = useMemo(() => {
        const grouped: { [year: number]: typeof vmaHistory } = {};
        for (const award of vmaHistory) {
            if (!grouped[award.year]) {
                grouped[award.year] = [];
            }
            grouped[award.year].push(award);
        }
        return Object.entries(grouped).sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA));
    }, [vmaHistory]);
    
    const [currentYearIndex, setCurrentYearIndex] = useState(0);

    const handleNextYear = () => {
        setCurrentYearIndex(prev => Math.max(0, prev - 1));
    };

    const handlePrevYear = () => {
        setCurrentYearIndex(prev => Math.min(awardsByYear.length - 1, prev + 1));
    };

    const getItemCoverArt = (itemId: string) => {
        const video = videos.find(v => v.id === itemId);
        if (video) return video.thumbnail;
        const song = songs.find(s => s.id === itemId);
        if (song) return song.coverArt;
        return activeArtist.image;
    }

    return (
        <div className="h-full w-full bg-[#121212] text-white flex flex-col overflow-hidden">
            <div className="relative h-64 flex-shrink-0">
                <img src="https://i.imgur.com/Ypvy2Lh.jpg" className="w-full h-full object-cover" alt="VMA background"/>
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/50" />
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/10 z-10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
            </div>
            
            <main className="flex-grow p-4 flex flex-col -mt-24 relative z-10">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm font-semibold uppercase text-zinc-400">Artist</p>
                        <h1 className="text-6xl font-black">{activeArtist.name}</h1>
                    </div>
                     <div className="flex items-center gap-4 text-zinc-300">
                        <a href="#" className="p-2 rounded-full hover:bg-zinc-800"><img src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Logo_of_Twitter.svg" className="w-5 h-5 invert"/></a>
                        <a href="#" className="p-2 rounded-full hover:bg-zinc-800"><img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" className="w-5 h-5"/></a>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="text-center">
                        <p className="text-6xl font-light text-zinc-300">{wins}</p>
                        <p className="text-sm font-semibold uppercase text-zinc-400">Wins*</p>
                    </div>
                    <div className="text-center">
                        <p className="text-6xl font-light">{nominations}</p>
                        <p className="text-sm font-semibold uppercase text-zinc-400">Nominations*</p>
                    </div>
                </div>

                <div className="flex-grow flex flex-col min-h-0">
                    {awardsByYear.length > 0 ? (
                        <>
                         <div className="border-b-2 border-zinc-400 pb-2 flex justify-between items-center">
                            <h2 className="text-lg font-bold">{parseInt(awardsByYear[currentYearIndex][0])} Video Music Awards</h2>
                            <div className="flex gap-2">
                                <button onClick={handleNextYear} disabled={currentYearIndex === 0} className="p-1 disabled:opacity-30"><ChevronLeftIcon className="w-5 h-5" /></button>
                                <button onClick={handlePrevYear} disabled={currentYearIndex === awardsByYear.length - 1} className="p-1 disabled:opacity-30"><ChevronRightIcon className="w-5 h-5" /></button>
                            </div>
                         </div>
                         <div className="py-4 flex-grow space-y-4 overflow-y-auto">
                            {awardsByYear[currentYearIndex][1].map(award => (
                                <div key={award.itemId + award.category} className="flex items-center gap-4">
                                    <img src={getItemCoverArt(award.itemId)} alt={award.itemName} className="w-16 h-16 object-cover" />
                                    <div className="flex-grow">
                                        <p className={`font-bold ${award.isWinner ? 'text-zinc-300' : ''}`}>{award.isWinner ? 'WINNER' : 'NOMINEE'}</p>
                                        <p className="text-sm text-zinc-300">{award.category}</p>
                                        <p className="text-sm font-semibold">{award.itemName}</p>
                                    </div>
                                </div>
                            ))}
                         </div>
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-center text-zinc-500">
                             <VmaAwardIcon className="w-16 h-16 mb-4" />
                            <p className="font-bold">No VMA History Yet</p>
                            <p className="text-sm">Keep releasing high-quality videos to earn nominations!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default VMAsView;
