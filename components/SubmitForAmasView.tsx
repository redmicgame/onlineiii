import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { Release, Song, AmaAward, AmaCategoryName } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

type CategoryName = AmaCategoryName;

const SubmitForAmasView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
    const { date } = gameState;
    const [selections, setSelections] = useState<{ [key in CategoryName]?: string }>({});

    if (!activeArtistData || !activeArtist) return null;

    const thisYearReleases = useMemo(() => {
        return activeArtistData.releases.filter(r => r.releaseDate.year === date.year);
    }, [activeArtistData.releases, date.year]);

    const eligibleAlbums = useMemo(() => {
        return thisYearReleases.filter(r => r.type === 'Album' || r.type === 'EP' || r.type === 'Album (Deluxe)' || r.type === 'Compilation' || r.type === 'Live Album');
    }, [thisYearReleases]);

    const eligibleSongs = useMemo(() => {
        const songIds = new Set(thisYearReleases.flatMap(r => r.songIds));
        return activeArtistData.songs.filter(s => songIds.has(s.id));
    }, [thisYearReleases, activeArtistData.songs]);
    
    const isNewArtistEligible = useMemo(() => {
        const firstReleaseYear = Math.min(...activeArtistData.releases.map(r => r.releaseDate.year), date.year);
        return !activeArtistData.hasSubmittedForAmaNewArtist && firstReleaseYear === date.year;
    }, [activeArtistData.releases, activeArtistData.hasSubmittedForAmaNewArtist, date.year]);

    const handleSubmit = () => {
        const submissions = Object.entries(selections).map(([category, itemId]) => {
            const cat = category as CategoryName;
            let itemName = '';
            if (cat === 'New Artist of the Year' || cat === 'Artist of the Year' || (cat.includes('Favorite') && cat.includes('Artist'))) {
                itemName = activeArtist.name;
            } else if (cat.includes('Album')) {
                itemName = eligibleAlbums.find(a => a.id === itemId)?.title || 'N/A';
            } else {
                itemName = eligibleSongs.find(s => s.id === itemId)?.title || 'N/A';
            }
            return { artistId: activeArtist.id, category: cat, itemId, itemName };
        });
        
        const emailId = activeArtistData.inbox.find(e => e.offer?.type === 'amaSubmission' && !e.offer.isSubmitted)?.id;
        if (emailId) {
            dispatch({ type: 'SUBMIT_FOR_AMAS', payload: { submissions, emailId } });
        }
    };

    const categories: CategoryName[] = [
        'Artist of the Year', 'New Artist of the Year', 'Album of the Year', 'Song of the Year', 'Music Video of the Year',
        'Favorite Pop Artist', 'Favorite Pop Album', 'Favorite Pop Song',
        'Favorite Hip-Hop Artist', 'Favorite Hip-Hop Album', 'Favorite Hip-Hop Song',
        'Favorite R&B Artist', 'Favorite R&B Album', 'Favorite R&B Song',
        'Favorite Latin Artist', 'Favorite Latin Album', 'Favorite Latin Song',
        'Favorite Country Artist', 'Favorite Country Album', 'Favorite Country Song',
        'Favorite Rock Artist', 'Favorite Rock Album', 'Favorite Rock Song',
        'Favorite Dance/Electronic Artist'
    ];

    return (
         <div className="h-full w-full bg-zinc-900 flex flex-col">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-red-900/80 backdrop-blur-sm z-10 border-b border-red-700/50">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'inbox'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">AMAs Submissions</h1>
            </header>
            <main className="flex-grow p-4 space-y-6 overflow-y-auto">
                {categories.map(cat => {
                    let options: (Song | Release)[] = [];
                    let disabled = false;
                    let disabledText = '';
                    
                    let isAlbumCategory = false;
                    let isSongCategory = false;
                    let isArtistCategory = false;

                    if (cat.includes('Album of the Year') || cat.includes('Favorite') && cat.includes('Album')) isAlbumCategory = true;
                    if (cat.includes('Song of the Year') || cat.includes('Favorite') && cat.includes('Song') || cat.includes('Music Video')) isSongCategory = true;
                    if (cat.includes('Artist of the Year') || cat.includes('Favorite') && cat.includes('Artist') || cat === 'New Artist of the Year') isArtistCategory = true;

                    let genreFilter: string | null = null;
                    if (cat.includes('Pop')) genreFilter = 'Pop';
                    if (cat.includes('Hip-Hop')) genreFilter = 'Hip Hop';
                    if (cat.includes('R&B')) genreFilter = 'R&B';
                    if (cat.includes('Latin')) genreFilter = 'Latin';
                    if (cat.includes('Country')) genreFilter = 'Country';
                    if (cat.includes('Rock')) genreFilter = 'Rock';
                    if (cat.includes('Dance/Electronic')) genreFilter = 'Dance/Electronic';

                    if (cat === 'New Artist of the Year') {
                        if (!isNewArtistEligible) {
                            disabled = true;
                            disabledText = 'Not eligible for New Artist this year.';
                        } else {
                            options = [{id: activeArtist.id, title: activeArtist.name} as any];
                        }
                    } else if (isArtistCategory) {
                        options = [{id: activeArtist.id, title: activeArtist.name} as any];
                    } else if (isAlbumCategory) {
                        options = eligibleAlbums.filter(album => {
                            if (!genreFilter) return true;
                            const releaseSongs = album.songIds.map(id => activeArtistData.songs.find(s => s.id === id)).filter((s): s is Song => !!s);
                            if (releaseSongs.length === 0) return false;
                            const genreCounts = releaseSongs.reduce((acc, song) => {
                                acc[song.genre] = (acc[song.genre] || 0) + 1;
                                return acc;
                            }, {} as {[genre: string]: number});
                            const majorGenre = Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b);
                            return majorGenre === genreFilter;
                        });

                        if(options.length === 0) {
                            disabled = true;
                            disabledText = 'No eligible albums for this category.';
                        }
                    } else { // Song categories
                        options = eligibleSongs.filter(song => {
                            if (!genreFilter) return true;
                            return song.genre === genreFilter;
                        });

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
                                    className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-12 px-3"
                                >
                                    <option value="">-- Select an entry --</option>
                                    {options.map(opt => <option key={opt.id} value={opt.id}>{opt.title}</option>)}
                                </select>
                            )}
                        </div>
                    );
                })}
            </main>
            <div className="p-4 border-t border-red-700/50">
                <button onClick={handleSubmit} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-red-600/20">
                    Submit to AMAs
                </button>
            </div>
        </div>
    );
};

export default SubmitForAmasView;
