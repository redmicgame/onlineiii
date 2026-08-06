


import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { Video, Song } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const CreateVmaPerformanceView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
    const { date, activeVmaPerformanceOffer } = gameState;
    const { songs } = activeArtistData!;

    const [selectedSongIds, setSelectedSongIds] = useState<Set<string>>(new Set());
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [error, setError] = useState('');

    const performableSongs = useMemo(() => {
        return songs.filter(s => s.isReleased);
    }, [songs]);

    if (!activeArtist || !activeVmaPerformanceOffer) {
        return <div className="p-4">Error loading page.</div>;
    }

    const handleToggleSong = (songId: string) => {
        const newSelection = new Set(selectedSongIds);
        if (newSelection.has(songId)) {
            newSelection.delete(songId);
        } else if (newSelection.size < 3) {
            newSelection.add(songId);
        }
        setSelectedSongIds(newSelection);
    };

    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setThumbnail(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handlePublish = () => {
        if (selectedSongIds.size === 0) {
            setError('Please select at least one song to perform.'); return;
        }
        if (!thumbnail) {
            setError('Please upload a thumbnail for the video.'); return;
        }

        const songTitles = Array.from(selectedSongIds).map(id => songs.find(s=>s.id === id)?.title).filter(Boolean).join(' / ');
        const videoTitle = `${activeArtist.name} - ${songTitles} (Live From The VMAs)`;
        
        const description = `Watch ${activeArtist.name}'s stunning live performance of "${songTitles}" from the ${date.year} MTV Video Music Awards.`;

        const newVideo: Video = {
            id: crypto.randomUUID(),
            songId: Array.from(selectedSongIds)[0],
            title: videoTitle,
            type: 'Live Performance',
            views: 0,
            thumbnail,
            releaseDate: { week: 30, year: date.year },
            artistId: activeArtist.id,
            description,
            mentionedNpcs: [],
        };

        dispatch({ type: 'CREATE_VMA_PERFORMANCE', payload: { video: newVideo } });
    };

    return (
        <div className="h-full w-full bg-zinc-900 flex flex-col">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={() => dispatch({ type: 'DECLINE_VMA_PERFORMANCE', payload: { emailId: activeVmaPerformanceOffer.emailId }})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Plan VMA Performance</h1>
            </header>
            <main className="flex-grow p-4 space-y-6 overflow-y-auto">
                <div className="bg-zinc-800 p-4 rounded-lg">
                    <label htmlFor="thumbnail-upload" className="cursor-pointer w-full block">
                        <div className="w-full aspect-video rounded-lg bg-zinc-700 border-2 border-dashed border-zinc-600 flex items-center justify-center hover:border-zinc-500">
                            {thumbnail ? <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" /> : <span>Upload Thumbnail</span>}
                        </div>
                    </label>
                    <input id="thumbnail-upload" type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                </div>
                <div>
                    <h2 className="text-lg font-bold">Select Songs ({selectedSongIds.size}/3)</h2>
                    <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                        {performableSongs.map(song => (
                            <button key={song.id} onClick={() => handleToggleSong(song.id)} className={`w-full p-2 rounded-md flex items-center gap-3 transition-colors ${selectedSongIds.has(song.id) ? 'bg-zinc-700' : 'hover:bg-zinc-800'}`}>
                                <input type="checkbox" readOnly checked={selectedSongIds.has(song.id)} className="form-checkbox h-5 w-5 rounded bg-zinc-600 border-zinc-500 text-red-600 focus:ring-red-500" />
                                <img src={song.coverArt} alt={song.title} className="w-10 h-10 object-cover" />
                                <p className="font-semibold">{song.title}</p>
                            </button>
                        ))}
                    </div>
                </div>
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            </main>
             <div className="p-4 border-t border-zinc-700/50">
                <button onClick={handlePublish} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                    Confirm Performance
                </button>
            </div>
        </div>
    );
};

export default CreateVmaPerformanceView;