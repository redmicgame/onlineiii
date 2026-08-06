
import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import { Video } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import TrshdIcon from './icons/TrshdIcon';

const CreateTrshdPerformanceView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
    const { date, activeTrshdOffer } = gameState;
    const { songs } = activeArtistData!;

    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [error, setError] = useState('');

    const song = useMemo(() => {
        if (!activeTrshdOffer) return null;
        return songs.find(s => s.id === activeTrshdOffer.songId);
    }, [songs, activeTrshdOffer]);

    if (!activeArtist || !activeTrshdOffer || !song) {
        return (
            <div className="p-4 bg-zinc-900 text-white h-full overflow-y-auto">
                <p>Error loading performance creation page.</p>
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'inbox' })} className="text-red-500 mt-2">Back to Inbox</button>
            </div>
        );
    }
    
    const videoTitle = `${activeArtist.name} - "${song.title}" | TRSH'D Performance`;

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

        const description = `Watch ${activeArtist.name} perform their hit song "${song.title}" live for TRSH'D.`;

        const newVideo: Video = {
            id: crypto.randomUUID(),
            songId: song.id,
            title: videoTitle,
            type: 'Live Performance',
            views: 0,
            thumbnail,
            releaseDate: date,
            artistId: activeArtist.id,
            channelId: activeArtist.id,
            description,
            mentionedNpcs: [],
        };

        dispatch({ type: 'CREATE_TRSHD_PERFORMANCE', payload: { video: newVideo } });
    };
    
    const handleCancel = () => {
        dispatch({ type: 'CANCEL_TRSHD_OFFER' });
    };

    return (
        <div className="h-full w-full bg-zinc-900 flex flex-col">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={handleCancel} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">TRSH'D: Performance</h1>
            </header>
            <div className="flex-grow p-4 space-y-6 overflow-y-auto">
                <div className="bg-[#FFC700] text-black p-4 rounded-lg">
                    <div className="flex justify-between items-center text-xs font-bold tracking-widest">
                        <span>TRSH'D</span>
                        <TrshdIcon className="w-6 h-6 text-black" />
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
                            <TrshdIcon className="w-full h-full" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-tight">{videoTitle}</h2>
                            <p className="text-xs text-black/80">TRSH'D • 0 views • Just now</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-zinc-800 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2 text-white">Details</h3>
                    <p className="text-sm text-zinc-300"><span className="font-semibold text-zinc-400">Song:</span> {song.title}</p>
                    <p className="text-sm text-zinc-300"><span className="font-semibold text-zinc-400">Boost:</span> This performance will give "{song.title}" a streaming boost and increase your hype.</p>
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

export default CreateTrshdPerformanceView;
