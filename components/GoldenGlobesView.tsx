
import React, { useMemo, useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import GrammyAwardIcon from './icons/GrammyAwardIcon';

const GoldenGlobesView: React.FC = () => {
    const { dispatch, activeArtist, activeArtistData } = useGame();
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!activeArtist || !activeArtistData) return null;

    const { goldenGlobeHistory, songs, releases, actingRoles, goldenGlobeBanner } = activeArtistData;

    const wins = useMemo(() => goldenGlobeHistory.filter(g => g.isWinner).length, [goldenGlobeHistory]);
    const nominations = useMemo(() => goldenGlobeHistory.length, [goldenGlobeHistory]);

    const awardsByYear = useMemo(() => {
        const grouped: { [year: number]: typeof goldenGlobeHistory } = {};
        for (const award of goldenGlobeHistory) {
            if (!grouped[award.year]) {
                grouped[award.year] = [];
            }
            grouped[award.year].push(award);
        }
        return Object.entries(grouped).sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA));
    }, [goldenGlobeHistory]);
    
    const [currentYearIndex, setCurrentYearIndex] = useState(0);

    const handleNextYear = () => {
        setCurrentYearIndex(prev => Math.max(0, prev - 1));
    };

    const handlePrevYear = () => {
        setCurrentYearIndex(prev => Math.min(awardsByYear.length - 1, prev + 1));
    };

    
        const getItemName = (award: any) => {
        if (award.itemName && award.itemName !== 'N/A' && award.itemName !== 'Unknown') return award.itemName;
        const song = songs.find(s => s.id === award.itemId);
        if (song) return song.title;
        const release = releases.find(r => r.id === award.itemId);
        if (release) return release.title;
        const role = (activeArtistData.actingRoles || []).find(r => r.id === award.itemId);
        if (role) return role.title;
        return award.itemName || 'Unknown';
    };
    
    const getItemCoverArt = (itemId: string) => {
        const song = songs.find(s => s.id === itemId);
        if (song) return song.coverArt;
        const release = releases.find(r => r.id === itemId);
        if (release) return release.coverArt;
        const role = (actingRoles || []).find(g => g.id === itemId);
        if (role) return role.coverUrl;
        return 'https://ui-avatars.com/api/?name=' + encodeURIComponent(itemId) + '&background=random&color=fff';
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                dispatch({ type: 'UPDATE_GOLDEN_GLOBE_BANNER', payload: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="h-full w-full bg-[#121212] text-white flex flex-col overflow-hidden">
            <div className="relative h-64 flex-shrink-0 cursor-pointer group" onClick={handleBannerClick}>
                <img src={goldenGlobeBanner || "https://i.imgur.com/8N45gY1.jpg"} className="w-full h-full object-cover transition-opacity group-hover:opacity-80" alt="Oscars background"/>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/50" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Change Banner
                    </span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); dispatch({type: 'CHANGE_VIEW', payload: 'game'}); }} className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/10 z-10">
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
                        <p className="text-6xl font-light text-amber-400">{wins}</p>
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
                         <div className="border-b-2 border-amber-400 pb-2 flex justify-between items-center">
                            <h2 className="text-lg font-bold">{parseInt(awardsByYear[currentYearIndex][0]) + 1} Golden Globe Awards</h2>
                            <div className="flex gap-2">
                                <button onClick={handleNextYear} disabled={currentYearIndex === 0} className="p-1 disabled:opacity-30"><ChevronLeftIcon className="w-5 h-5" /></button>
                                <button onClick={handlePrevYear} disabled={currentYearIndex === awardsByYear.length - 1} className="p-1 disabled:opacity-30"><ChevronRightIcon className="w-5 h-5" /></button>
                            </div>
                         </div>
                         <div className="py-4 flex-grow space-y-4 overflow-y-auto">
                            {awardsByYear[currentYearIndex][1].map(award => (
                                <div key={award.itemId + award.category} className="flex items-center gap-4">
                                    <img src={getItemCoverArt(award.itemId)} alt={getItemName(award)} className="w-16 h-16 object-cover" />
                                    <div className="flex-grow">
                                        <p className={`font-bold ${award.isWinner ? 'text-amber-400' : ''}`}>{award.isWinner ? 'WINNER' : 'NOMINEE'}</p>
                                        <p className="text-sm text-zinc-300">{award.category}</p>
                                        <p className="text-sm font-semibold">{getItemName(award)}</p>
                                    </div>
                                </div>
                            ))}
                         </div>
                        </>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-center text-zinc-500">
                             <GrammyAwardIcon className="w-16 h-16 mb-4" />
                            <p className="font-bold">No Oscar History Yet</p>
                            <p className="text-sm">Contribute to movie soundtracks to be eligible for nominations!</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default GoldenGlobesView;
