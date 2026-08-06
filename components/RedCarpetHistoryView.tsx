import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import ChevronLeftIcon from './icons/ChevronLeftIcon';

const RedCarpetHistoryView: React.FC = () => {
    const { dispatch, activeArtistData } = useGame();
    const [selectedAwardShow, setSelectedAwardShow] = useState<string>('All');

    if (!activeArtistData) return null;

    const looks = useMemo(() => {
        let allLooks = activeArtistData.pastRedCarpetLooks ? [...activeArtistData.pastRedCarpetLooks] : [];
        if (activeArtistData.xPosts) {
            activeArtistData.xPosts.forEach(post => {
                if (post.image && (post.content.includes('red carpet.') || post.content.includes('premiere in'))) {
                    let awardShow = 'Unknown';
                    if (post.content.includes('#GRAMMYs')) awardShow = 'GRAMMYs';
                    else if (post.content.includes('#VMAs')) awardShow = 'VMAs';
                    else if (post.content.includes('#AMAs')) awardShow = 'AMAs';
                    else if (post.content.includes('#GoldenGlobes')) awardShow = 'Golden Globes';
                    else if (post.content.includes('#Oscars')) awardShow = 'Oscars';
                    else if (post.content.includes('premiere in')) {
                        const match = post.content.match(/stuns for '(.*?)' premiere/);
                        if (match && match[1]) awardShow = 'Premiere: ' + match[1];
                        else awardShow = 'Movie Premiere';
                    }
                    
                    // Check if we already have this look (by image URL or a combination of year and award show)
                    const alreadyExists = allLooks.some(look => look.imageUrl === post.image || (look.year === post.date.year && look.awardShow === awardShow));
                    if (!alreadyExists && awardShow !== 'Unknown') {
                        allLooks.push({
                            id: post.id,
                            awardShow,
                            year: post.date.year,
                            imageUrl: post.image,
                        });
                    }
                }
            });
        }
        return allLooks;
    }, [activeArtistData.pastRedCarpetLooks, activeArtistData.xPosts]);

    const awardShows = useMemo(() => {
        const shows = new Set<string>();
        looks.forEach(look => shows.add(look.awardShow));
        return ['All', ...Array.from(shows)].sort();
    }, [looks]);

    const filteredLooks = useMemo(() => {
        let filtered = looks;
        if (selectedAwardShow !== 'All') {
            filtered = looks.filter(look => look.awardShow === selectedAwardShow);
        }
        return filtered.sort((a, b) => b.year - a.year); // descending by year
    }, [looks, selectedAwardShow]);

    return (
        <div className="space-y-6 pb-20 p-4">
            <div className="flex items-center space-x-4 mb-6 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 py-4 -mt-4 -my-4 border-b border-zinc-800">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'game' })} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700">
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold">Red Carpet History</h2>
            </div>
            
            <p className="text-zinc-400 text-sm mb-6">A timeline of your iconic red carpet fashion.</p>

            {looks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center text-zinc-500 bg-zinc-800 rounded-xl">
                    <p className="text-lg mb-2">No red carpet looks yet.</p>
                    <p className="text-sm">Attend award shows and post your fashion to build your history.</p>
                </div>
            ) : (
                <>
                    {awardShows.length > 2 && ( // only show filter if there's more than one award show type
                        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
                            {awardShows.map(show => (
                                <button
                                    key={show}
                                    onClick={() => setSelectedAwardShow(show)}
                                    className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors text-sm ${
                                        selectedAwardShow === show ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 text-white'
                                    }`}
                                >
                                    {show}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredLooks.map((look) => (
                            <div key={look.id} className="bg-zinc-800 rounded-xl overflow-hidden hover:bg-zinc-700 transition-colors cursor-pointer group">
                                <div className="aspect-[3/4] relative">
                                    <img 
                                        src={look.imageUrl} 
                                        alt={`${look.awardShow} ${look.year}`} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                         <p className="text-white font-bold text-lg">{look.year}</p>
                                         <p className="text-red-400 font-semibold">{look.awardShow}</p>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <h3 className="font-bold text-base">{look.awardShow}</h3>
                                    <p className="text-sm text-zinc-400">{look.year}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default RedCarpetHistoryView;
