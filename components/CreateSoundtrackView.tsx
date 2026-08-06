
import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { Song } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const QualityBadge: React.FC<{ quality: number; showNumber: boolean }> = ({ quality, showNumber }) => {
    const getQualityColor = () => {
        if (quality < 50) return 'bg-red-500 text-white';
        if (quality < 70) return 'bg-yellow-500 text-black';
        if (quality < 96) return 'bg-green-400 text-black';
        return 'bg-green-600 text-white';
    };
    return (
        <div className={`w-10 h-10 flex items-center justify-center rounded-md font-bold text-base ${getQualityColor()}`}>
            {showNumber ? quality : ''}
        </div>
    );
};

const CreateSoundtrackView: React.FC = () => {
    const { gameState, dispatch, activeArtistData } = useGame();
    const { activeSoundtrackOffer } = gameState;
    const { songs, redMicPro } = activeArtistData!;

    const [coverArt, setCoverArt] = useState<string | null>(null);
    const [selectedSongIds, setSelectedSongIds] = useState<Set<string>>(new Set());
    const [error, setError] = useState('');

    const unreleasedSongs = useMemo(() => {
        return songs.filter(s => !s.isReleased);
    }, [songs]);

    if (!activeSoundtrackOffer) {
        return <div className="p-4">Error: No active soundtrack offer.</div>;
    }

    const handleCoverArtUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => setCoverArt(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleToggleSong = (songId: string) => {
        const newSelection = new Set(selectedSongIds);
        if (newSelection.has(songId)) {
            newSelection.delete(songId);
        } else if (newSelection.size < 3) {
            newSelection.add(songId);
        }
        setSelectedSongIds(newSelection);
    };

    const handleSubmit = () => {
        setError('');
        if (!coverArt) {
            setError('Soundtrack cover art is required.'); return;
        }
        if (selectedSongIds.size < 1 || selectedSongIds.size > 3) {
            setError('You must select between 1 and 3 songs.'); return;
        }

        dispatch({
            type: 'CREATE_SOUNDTRACK_CONTRIBUTION',
            payload: {
                albumTitle: activeSoundtrackOffer.albumTitle,
                coverArt,
                songIds: Array.from(selectedSongIds),
            }
        });
    };

    const handleCancel = () => {
        dispatch({ type: 'CANCEL_SOUNDTRACK_OFFER' });
    };

    return (
        <div className="h-full w-full bg-zinc-900 flex flex-col">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={handleCancel} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold truncate">Create Soundtrack: {activeSoundtrackOffer.albumTitle}</h1>
            </header>
            <main className="flex-grow p-4 space-y-6 overflow-y-auto">
                <div>
                    <label htmlFor="cover-art" className="block text-sm font-medium text-zinc-300 mb-2">Soundtrack Cover Art</label>
                    <label htmlFor="cover-art" className="cursor-pointer">
                        <div className="w-full aspect-square rounded-lg bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center hover:border-red-500 transition-colors">
                            {coverArt ? (
                                <img src={coverArt} alt="Cover Art" className="w-full h-full rounded-lg object-cover" />
                            ) : (
                                <span className="text-zinc-400 text-sm text-center">Upload Cover Art</span>
                            )}
                        </div>
                    </label>
                    <input id="cover-art" type="file" accept="image/*" className="hidden" onChange={handleCoverArtUpload} />
                </div>
                <div>
                    <h3 className="block text-sm font-medium text-zinc-300 mb-2">Select Songs ({selectedSongIds.size}/3)</h3>
                    <div className="max-h-60 overflow-y-auto space-y-2 bg-zinc-800 p-2 rounded-lg">
                        {unreleasedSongs.map(song => (
                            <button key={song.id} onClick={() => handleToggleSong(song.id)} className={`w-full p-2 rounded-md text-left flex items-center gap-3 transition-colors ${selectedSongIds.has(song.id) ? 'bg-red-500/20' : 'hover:bg-zinc-700'}`}>
                                <img src={song.coverArt} alt={song.title} className="w-10 h-10 rounded-sm object-cover" />
                                <div className="flex-grow">
                                    <p className="font-semibold">{song.title}</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <QualityBadge quality={song.quality} showNumber={redMicPro.unlocked} />
                                    {redMicPro.unlocked && (song as any).trait && (
                                        <span className="text-[9px] text-zinc-400 mt-1 uppercase font-bold text-center leading-tight max-w-[60px]">{(song as any).trait}</span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                 {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            </main>
            <div className="p-4 border-t border-zinc-700/50">
                <button onClick={handleSubmit} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                    Submit to Soundtrack
                </button>
            </div>
        </div>
    );
};

export default CreateSoundtrackView;
