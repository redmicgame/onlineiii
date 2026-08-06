

import React, { useState, useMemo, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { VIDEO_COSTS, NPC_ARTIST_NAMES, LABELS } from '../constants';
import type { Video } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const CreateVideoView: React.FC = () => {
    const { gameState, dispatch, activeArtist, activeArtistData } = useGame();
    const { date, activeYoutubeChannel, activeArtistId } = gameState;

    const [songId, setSongId] = useState('');
    const [videoType, setVideoType] = useState<'Music Video' | 'Lyric Video' | 'Visualizer' | 'Custom'>('Visualizer');
    const [customTitle, setCustomTitle] = useState('');
    const [isScheduled, setIsScheduled] = useState(false);
    const [scheduledWeeks, setScheduledWeeks] = useState(1);
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    if (!activeArtistData || !activeArtist || !activeArtistId) return null;
    const { money, songs, videos, contract } = activeArtistData;

    const cost = VIDEO_COSTS[videoType as keyof typeof VIDEO_COSTS];

    const label = contract ? LABELS.find(l => l.id === contract.labelId) : null;
    const hasLabelChannel = label && label.youtubeChannel;
    const isLabelMode = activeYoutubeChannel === 'label' && hasLabelChannel;

    const availableVideoTypes = useMemo(() => {
        const allTypes = Object.keys(VIDEO_COSTS) as Array<keyof typeof VIDEO_COSTS>;
        if (isLabelMode) {
            return allTypes.filter(t => t !== 'Custom');
        }
        return allTypes;
    }, [isLabelMode]);
    
    useEffect(() => {
        // If user switches to label mode while 'Custom' is selected, reset it.
        if(isLabelMode && videoType === 'Custom') {
            setVideoType('Visualizer');
        }
    }, [isLabelMode, videoType]);

    const availableSongs = useMemo(() => {
        const songsWithVideosOfType = new Set(
            videos.filter(v => v.type === videoType).map(v => v.songId)
        );
        if (videoType === 'Custom') {
            return songs.filter(s => s.isReleased);
        }
        return songs.filter(s => s.isReleased && !songsWithVideosOfType.has(s.id));
    }, [songs, videos, videoType]);
    
    useEffect(() => {
        const selectedSong = songs.find(s => s.id === songId);
        if (selectedSong) {
            setThumbnail(selectedSong.coverArt);
             if (videoType === 'Custom') {
                setCustomTitle(`${selectedSong.title} (Official Video)`);
            }
        } else {
            setThumbnail(null);
            setCustomTitle('');
        }
    }, [songId, songs, videoType]);

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
    
    const handleCreateVideo = () => {
        setError('');
        if (!songId) {
            setError('Please select a song.');
            return;
        }
        if (videoType === 'Custom' && !customTitle.trim()) {
            setError('A custom title is required for this video type.');
            return;
        }
        if (money < cost) {
            setError("You don't have enough money to create this video.");
            return;
        }
        
        const selectedSong = songs.find(s => s.id === songId);
        if (!selectedSong) {
             setError('Selected song not found.');
             return;
        }

        if (!thumbnail) {
            setError('A thumbnail is required for the video.');
            return;
        }
        
        let artistsForTitle = activeArtist.name;
        let songForTitle = selectedSong.title;
        if (selectedSong.features && selectedSong.features.length > 0) {
            artistsForTitle = `${activeArtist.name}, ${selectedSong.features.join(", ")}`;
            songForTitle = songForTitle.replace(/ \\(feat\\. [^)]+\\)/g, "");
        } else if (selectedSong.collaboration) {
            artistsForTitle = `${activeArtist.name}, ${selectedSong.collaboration.artistName}`;
            songForTitle = songForTitle.replace(/ \\(feat\\. [^)]+\\)/g, "");
        }
        const baseTitle = videoType === 'Custom' ? customTitle.trim() : `${songForTitle} (${videoType})`;
        const title = `${artistsForTitle} - ${baseTitle}`;
        
        const contract = activeArtistData.contract;
        const label = contract && !contract.isCustom ? LABELS.find(l => l.id === contract.labelId) : null;
        const hasLabelChannel = label && label.youtubeChannel;
        
        const channelId = activeYoutubeChannel === 'label' && hasLabelChannel
            ? contract!.labelId 
            : activeArtistId;

        const fullText = title + ' ' + description;
        const mentionedNpcs = NPC_ARTIST_NAMES.filter(name => 
            new RegExp(`\\b${name}\\b`, 'i').test(fullText)
        );

        const newVideo: Video = {
            id: crypto.randomUUID(),
            songId: selectedSong.id,
            title,
            type: videoType,
            views: 0,
            thumbnail: thumbnail,
            releaseDate: isScheduled ? { week: ((date.week + scheduledWeeks - 1) % 52) + 1, year: date.year + Math.floor((date.week + scheduledWeeks - 1) / 52) } : date,
            isScheduled: isScheduled,
            artistId: activeArtist.id,
            channelId: channelId,
            description,
            mentionedNpcs,
        };

        dispatch({ type: 'CREATE_VIDEO', payload: { video: newVideo, cost } });
        dispatch({ type: 'CHANGE_VIEW', payload: 'game' });
    };
    
    return (
        <div className="h-full w-full bg-zinc-900 overflow-y-auto">
            <header className="p-4 flex items-center gap-4 sticky top-0 bg-zinc-900/80 backdrop-blur-sm z-10 border-b border-zinc-700/50">
                <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="p-2 rounded-full hover:bg-white/10">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-2xl font-bold">Create Video</h1>
            </header>
            <div className="p-4 space-y-6">
                <div className="flex justify-center">
                    <label htmlFor="thumbnail-upload" className="cursor-pointer w-full">
                        <div className="w-full aspect-video rounded-lg bg-zinc-800 border-2 border-dashed border-zinc-600 flex items-center justify-center hover:border-red-500 transition-colors">
                            {thumbnail ? (
                                <img src={thumbnail} alt="Video Thumbnail" className="w-full h-full rounded-lg object-cover" />
                            ) : (
                                <span className="text-zinc-400 text-sm text-center p-4">Select a song to see the default thumbnail, or click to upload a custom one.</span>
                            )}
                        </div>
                    </label>
                    <input id="thumbnail-upload" type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Video Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {availableVideoTypes.map(type => (
                            <button key={type} onClick={() => { setVideoType(type); setSongId(''); }} className={`p-3 rounded-lg text-left transition-all border-2 ${videoType === type ? 'border-red-500 bg-red-500/10' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'}`}>
                                <p className="font-bold">{type}</p>
                                <p className="text-sm text-green-400">-${VIDEO_COSTS[type].toLocaleString()}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {videoType === 'Custom' && (
                    <div>
                        <label htmlFor="custom-title" className="block text-sm font-medium text-zinc-300">Custom Title</label>
                        <input type="text" id="custom-title" value={customTitle} onChange={e => setCustomTitle(e.target.value)} className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm h-10 px-3"/>
                    </div>
                )}

                <div>
                    <label htmlFor="song-select" className="block text-sm font-medium text-zinc-300">Select Song</label>
                    <select id="song-select" value={songId} onChange={e => setSongId(e.target.value)} className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm h-12 px-3">
                        <option value="">-- Choose a song --</option>
                        {availableSongs.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                     {availableSongs.length === 0 && <p className="text-xs text-zinc-400 mt-2">No available songs for this video type. Release more music or choose a different video type.</p>}
                </div>

                 <div>
                    <label htmlFor="video-description" className="block text-sm font-medium text-zinc-300">Description</label>
                    <textarea
                        id="video-description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full bg-zinc-700 border-zinc-600 rounded-md shadow-sm p-3 focus:ring-red-500 focus:border-red-500"
                        placeholder="Tell viewers about your video..."
                    />
                </div>

                <div className="bg-zinc-800 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Summary</h3>
                     <div className="grid grid-cols-2 gap-2 text-sm">
                        <p className="text-zinc-400">Video Type:</p><p>{videoType}</p>
                        <p className="text-zinc-400">Song:</p><p>{songs.find(s => s.id === songId)?.title || 'N/A'}</p>
                        <p className="text-zinc-400">Cost:</p><p className="text-red-400">-${cost.toLocaleString()}</p>
                        <p className="text-zinc-400">Your Money:</p><p className="text-green-400">${money.toLocaleString()}</p>
                    </div>
                </div>


                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                
                <button onClick={handleCreateVideo} className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-lg shadow-red-600/20 disabled:bg-zinc-600 disabled:shadow-none" disabled={money < cost || !songId}>
                    Shoot Video
                </button>
            </div>
        </div>
    );
};

export default CreateVideoView;