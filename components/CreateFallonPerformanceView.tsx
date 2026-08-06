

import React, { useState, useMemo, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Video, Song } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import TonightShowIcon from './icons/TonightShowIcon';

const CreateFallonPerformanceView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
    const { date, activeFallonOffer } = gameState;
    const { songs } = activeArtistData!;

    const [songId, setSongId] = useState('');
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [error, setError] = useState('');

    const availableSongs = useMemo(() => {
        if (!activeFallonOffer) return [];
        return songs.filter(s => {
            const release = activeArtistData!.releases.find(r => r.id === activeFallonOffer.releaseId);
            return release?.songIds.includes(s.id);
        });
    }, [songs, activeFallonOffer, activeArtistData]);
    
    useEffect(() => {
        if (availableSongs.length > 0 && !songId) {
            setSongId(availableSongs[0].id);
        }
    }, [availableSongs, songId]);
    
    useEffect(() => {
        const selectedSong = songs.find(s => s.id === songId);
        if (selectedSong) {
            setThumbnail(selectedSong.coverArt);
        }
    }, [songId, songs]);

    if (!activeArtist || !activeFallonOffer) {
        return (
            <div className="p-4 bg-zinc-900 text-white h-full overflow-y-auto">
                <p>Error loading page.</p>
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'inbox' })} className="text-red-500 mt-2">Back to Inbox</button>
            </div>
        );
    }

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
        const selectedSong = songs.find(s => s.id === songId);
        if (!selectedSong) {
            setError('Please select a song to perform.'); return;
        }
        if (!thumbnail) {
            setError('Please upload a thumbnail for the video.'); return;
        }

        const description = `Watch ${activeArtist.name} perform their hit song "${selectedSong.title}" live on The Tonight Show Starring Jimmy Fallon.`;

        const newVideo: Video = {
            id: crypto.randomUUID(),
            songId: songId,
            title: `${activeArtist.name}: ${selectedSong.title} | The Tonight Show Starring Jimmy Fallon`,
            type: 'Live Performance',
            views: 0,
            thumbnail,
            releaseDate: date,
            artistId: activeArtist.id,
            description,
            mentionedNpcs: ['Jimmy Fallon'],
        };

        dispatch({ type: 'CREATE_FALLON_VIDEO', payload: { video: newVideo, songId } });
    };
    
    const handleCancel = () => {
        dispatch({ type: 'CANCEL_FALLON_OFFER' });
    };

    return (
        <div className="h-full w-full bg-zinc-900 flex flex-col">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={handleCancel} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Fallon: Performance</h1>
            </header>
            <div className="flex-grow p-4 space-y-6 overflow-y-auto">
                <div className="bg-black text-white p-4 rounded-lg border border-blue-500/50">
                    <div className="text-xs font-bold tracking-widest text-zinc-400">
                        THE TONIGHT SHOW STARRING JIMMY FALLON
                    </div>
                    <div className="mt-4 mb-4">
                        <label htmlFor="thumbnail-upload" className="cursor-pointer w-full block">
                            <div className="w-full aspect-video rounded-lg bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center hover:border-blue-400 transition-colors">
                                {thumbnail ? (
                                    <img src={thumbnail} alt="Video Thumbnail" className="w-full h-full rounded-lg object-cover" />
                                ) : (
                                    <span className="text-zinc-400 text-sm text-center p-4">Click to upload thumbnail</span>
                                )}
                            </div>
                        </label>
                        <input id="thumbnail-upload" type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-black rounded-full p-1 flex-shrink-0">
                            <TonightShowIcon className="w-full h-full text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg leading-tight">{`${activeArtist.name}: ${songs.find(s=>s.id===songId)?.title || 'Song Title'} | The Tonight Show`}</h2>
                            <p className="text-xs text-zinc-400">The Tonight Show • 0 views • Just now</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="song-select" className="block text-sm font-medium text-zinc-300">Select Song to Perform</label>
                    <select id="song-select" value={songId} onChange={e => setSongId(e.target.value)} className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-12 px-3">
                        {availableSongs.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
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

export default CreateFallonPerformanceView;