
import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { Release, Song, Video, VmaAward } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

type CategoryName = VmaAward['category'];

const SubmitForVMAsView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
    const { date } = gameState;
    const [selections, setSelections] = useState<{ [key in CategoryName]?: string }>({});

    if (!activeArtistData || !activeArtist) return null;

    const thisYearVideos = useMemo(() => {
        return activeArtistData.videos.filter(v => v.releaseDate.year === date.year);
    }, [activeArtistData.videos, date.year]);

    const thisYearSongs = useMemo(() => {
        const thisYearReleaseIds = new Set(activeArtistData.releases.filter(r => r.releaseDate.year === date.year).map(r => r.id));
        return activeArtistData.songs.filter(s => s.releaseId && thisYearReleaseIds.has(s.releaseId));
    }, [activeArtistData.releases, activeArtistData.songs, date.year]);
    
    const isBnaEligible = useMemo(() => {
        const firstReleaseYear = Math.min(...activeArtistData.releases.map(r => r.releaseDate.year), date.year);
        // Best New Artist is often for breakthrough year, not necessarily debut year. We'll keep it simple.
        return firstReleaseYear >= date.year - 1;
    }, [activeArtistData.releases, date.year]);

    const handleSubmit = () => {
        const submissions = Object.entries(selections).map(([category, itemId]) => {
            const cat = category as CategoryName;
            let itemName = 'N/A';
            let found = false;

            if (cat === 'Best New Artist' || cat === 'Artist of the Year') {
                if (itemId === activeArtist.id) {
                    itemName = activeArtist.name;
                    found = true;
                }
            } else if (cat === 'Song of the Year') {
                const song = thisYearSongs.find(s => s.id === itemId);
                if (song) {
                    itemName = song.title;
                    found = true;
                }
            } else { // Video categories
                const video = thisYearVideos.find(v => v.id === itemId);
                if (video) {
                    itemName = video.title;
                    found = true;
                }
            }
            
            if (found) {
                return { artistId: activeArtist.id, category: cat, itemId, itemName };
            }
            return null;
        }).filter((s): s is { artistId: string; category: CategoryName; itemId: string; itemName: string } => s !== null);
        
        const emailId = activeArtistData.inbox.find(e => e.offer?.type === 'vmaSubmission' && !e.offer.isSubmitted)?.id;
        if (emailId) {
            dispatch({ type: 'SUBMIT_FOR_VMAS', payload: { submissions, emailId } });
        }
    };

    const categories: CategoryName[] = ['Video of the Year', 'Artist of the Year', 'Song of the Year', 'Best New Artist', 'Best Pop', 'Best Hip Hop', 'Best R&B'];

    return (
         <div className="h-full w-full bg-zinc-900 flex flex-col">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'inbox'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">VMA Submissions</h1>
            </header>
            <main className="flex-grow p-4 space-y-6 overflow-y-auto">
                {categories.map(cat => {
                    let options: (Song | Video | {id: string, title: string})[] = [];
                    let disabled = false;
                    let disabledText = '';

                    const videoCategories: CategoryName[] = ['Video of the Year', 'Best Pop', 'Best Hip Hop', 'Best R&B'];

                    if (cat === 'Best New Artist' || cat === 'Artist of the Year') {
                        if(cat === 'Best New Artist' && !isBnaEligible) {
                             disabled = true;
                             disabledText = 'Not eligible for Best New Artist.';
                        } else {
                            options = [{id: activeArtist.id, title: activeArtist.name}];
                        }
                    } else if (videoCategories.includes(cat)) {
                        let genreFilter: string | null = null;
                        if (cat === 'Best Pop') genreFilter = 'Pop';
                        if (cat === 'Best Hip Hop') genreFilter = 'Hip Hop';
                        if (cat === 'Best R&B') genreFilter = 'R&B';

                        options = thisYearVideos.filter(video => {
                            if (!genreFilter) return true;
                            const song = activeArtistData.songs.find(s => s.id === video.songId);
                            return song?.genre === genreFilter;
                        });

                        if(options.length === 0) {
                            disabled = true;
                            disabledText = 'No eligible videos for this category.';
                        }
                    } else { // Song of the Year
                        options = thisYearSongs;
                        if(options.length === 0) {
                            disabled = true;
                            disabledText = 'No eligible songs for this category.';
                        }
                    }

                    return (
                        <div key={cat}>
                            <label htmlFor={cat} className="block text-lg font-bold text-zinc-300">{cat}</label>
                            {disabled ? (
                                <div className="mt-1 text-sm text-zinc-500 bg-zinc-800 p-3 rounded-md">{disabledText || 'No eligible entries.'}</div>
                            ) : (
                                <select 
                                    id={cat}
                                    value={selections[cat] || ''}
                                    onChange={e => setSelections(prev => ({ ...prev, [cat]: e.target.value }))}
                                    className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm h-12 px-3"
                                >
                                    <option value="">-- Select an entry --</option>
                                    {options.map(opt => <option key={opt.id} value={opt.id}>{opt.title}</option>)}
                                </select>
                            )}
                        </div>
                    );
                })}
            </main>
            <div className="p-4 border-t border-zinc-700/50">
                <button onClick={handleSubmit} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                    Submit to MTV
                </button>
            </div>
        </div>
    );
};

export default SubmitForVMAsView;
