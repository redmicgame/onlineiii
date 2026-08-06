

import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { Video } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import GeniusIcon from './icons/GeniusIcon';

const CreateGeniusInterviewView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
    const { date, activeGeniusOffer } = gameState;
    const { songs } = activeArtistData!;

    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [error, setError] = useState('');

    const song = useMemo(() => {
        if (!activeGeniusOffer) return null;
        return songs.find(s => s.id === activeGeniusOffer.songId);
    }, [songs, activeGeniusOffer]);

    if (!activeArtist || !activeGeniusOffer || !song) {
        return (
            <div className="p-4 bg-zinc-900 text-white h-full overflow-y-auto">
                <p>Error loading interview creation page.</p>
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'inbox' })} className="text-red-500 mt-2">Back to Inbox</button>
            </div>
        );
    }
    
    const videoTitle = `${activeArtist.name} "${song.title}" Official Lyrics & Meaning | Verified`;

    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnail(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePublish = () => {
        if (!thumbnail) {
            setError('Please upload a thumbnail for the video.');
            return;
        }

        const description = `Watch ${activeArtist.name} break down the lyrics of "${song.title}" on Genius' series 'Verified'.`;

        const newVideo: Video = {
            id: crypto.randomUUID(),
            songId: song.id,
            title: videoTitle,
            type: 'Genius Verified',
            views: 0,
            thumbnail,
            releaseDate: date,
            artistId: activeArtist.id,
            description,
            mentionedNpcs: [],
        };

        dispatch({ type: 'CREATE_GENIUS_INTERVIEW', payload: { video: newVideo } });
    };
    
    const handleCancel = () => {
        dispatch({ type: 'CANCEL_GENIUS_OFFER' });
    };

    return (
        <div className="h-full w-full bg-zinc-900 flex flex-col">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={handleCancel} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">Create Genius Interview</h1>
            </header>
            <div className="flex-grow p-4 space-y-6 overflow-y-auto">
                <div className="bg-yellow-300 text-black p-4 rounded-lg">
                    <div className="flex justify-between items-center text-xs font-bold tracking-widest">
                        <span>VERIFIED</span>
                        <span>GENIUS</span>
                    </div>
                    <div className="mt-4 mb-4">
                        <label htmlFor="thumbnail-upload" className="cursor-pointer w-full block">
                            <div className="w-full aspect-video rounded-lg bg-black/20 border-2 border-dashed border-black/50 flex items-center justify-center hover:border-black transition-colors">
                                {thumbnail ? (
                                    <img src={thumbnail} alt="Video Thumbnail" className="w-full h-full rounded-lg object-cover" />
                                ) : (
                                    <span className="text-black/70 text-sm text-center p-4">Click to upload thumbnail</span>
                                )}
                            </div>
                        </label>
                        <input id="thumbnail-upload" type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                    </div>
                    <div className="flex items-start gap-3">
                         <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center p-1 flex-shrink-0">
                            <GeniusIcon className="w-full h-full text-yellow-300" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-tight">{videoTitle}</h2>
                            <p className="text-xs text-black/80">Genius • 0 views • Just now</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-zinc-800 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Details</h3>
                    <p className="text-sm"><span className="font-semibold text-zinc-400">Song:</span> {song.title}</p>
                    <p className="text-sm"><span className="font-semibold text-zinc-400">Boost:</span> This will give "{song.title}" a significant streaming boost and increase your hype.</p>
                </div>
                
                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            </div>
            <div className="p-4 border-t border-zinc-700/50">
                <button onClick={handlePublish} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-red-600/20">
                    Publish to YouTube
                </button>
            </div>
        </div>
    );
};

export default CreateGeniusInterviewView;