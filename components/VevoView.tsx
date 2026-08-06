import React, { useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const VevoView: React.FC = () => {
    const { gameState, dispatch, activeArtistData } = useGame();
    
    if (!activeArtistData) return null;

    const { videos, money } = activeArtistData;

    const musicVideos = videos.filter(v => v.type === 'Music Video' && !v.isOnSpotify);
    const otherVideos = videos.filter(v => v.type !== 'Music Video' && !v.isOnSpotify);

    const getUploadCost = () => {
        const popularity = activeArtistData.popularity || 0;
        if (popularity < 10) return 500;
        if (popularity <= 30) return 1000;
        if (popularity <= 50) return 1500;
        if (popularity <= 75) return 3000;
        if (popularity <= 90) return 5000;
        return 7500;
    };

    const cost = getUploadCost();

    const handleUploadToSpotify = (videoId: string) => {
        if (money < cost) {
            alert('Not enough money!');
            return;
        }

        dispatch({ type: 'UPDATE_ARTIST_FUNDS', payload: -cost });
        dispatch({ type: 'UPDATE_VIDEO', payload: { id: videoId, updates: { isOnSpotify: true, spotifyViews: 0, spotifyDailyViews: [] } } });
        alert('Video distributed to Spotify!');
    };

    return (
        <div className="bg-black h-full overflow-y-auto text-white pb-20">
            <div className="sticky top-0 bg-black/90 backdrop-blur-md p-4 flex items-center gap-4 z-10 border-b border-zinc-800">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'game' })} className="p-2 -m-2">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold italic">vevo</h1>
                    <span className="text-zinc-400 text-sm">for Artists</span>
                </div>
            </div>

            <div className="p-4">
                <h2 className="text-2xl font-bold mb-2">Spotify Distribution</h2>
                <p className="text-zinc-400 mb-6">Distribute your YouTube music videos to Spotify. Cost is based on your popularity.</p>
                <div className="bg-zinc-900 p-4 rounded-lg mb-6 border border-zinc-800">
                    <p className="text-sm text-zinc-400">Current Cost per Video</p>
                    <p className="text-3xl font-bold text-green-500">${formatNumber(cost)}</p>
                    <p className="text-xs text-zinc-500 mt-2">Your Popularity: {Math.floor(activeArtistData.popularity || 0)}</p>
                </div>

                <h3 className="text-lg font-bold mb-4">Eligible Music Videos</h3>
                {musicVideos.length === 0 ? (
                    <p className="text-zinc-500 italic mb-8">No eligible music videos found. Create a Music Video in the YouTube app first.</p>
                ) : (
                    <div className="space-y-4 mb-8">
                        {musicVideos.map(video => (
                            <div key={video.id} className="flex items-center gap-4 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                                <img src={video.thumbnail} alt={video.title} className="w-24 h-16 object-cover rounded" />
                                <div className="flex-grow min-w-0">
                                    <p className="font-bold truncate">{video.title}</p>
                                    <p className="text-sm text-zinc-400">{formatNumber(video.views)} YouTube Views</p>
                                </div>
                                <button
                                    onClick={() => handleUploadToSpotify(video.id)}
                                    disabled={money < cost}
                                    className="bg-green-600 text-white font-bold py-2 px-4 rounded text-sm disabled:opacity-50 hover:bg-green-500 whitespace-nowrap"
                                >
                                    Distribute
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                <h3 className="text-lg font-bold mb-4 mt-8 pt-6 border-t border-zinc-800">Other Videos</h3>
                {otherVideos.length === 0 ? (
                    <p className="text-zinc-500 italic">No other eligible videos found.</p>
                ) : (
                    <div className="space-y-4">
                        {otherVideos.map(video => (
                            <div key={video.id} className="flex items-center gap-4 bg-zinc-900 p-3 rounded-lg border border-zinc-800">
                                <img src={video.thumbnail} alt={video.title} className="w-24 h-16 object-cover rounded" />
                                <div className="flex-grow min-w-0">
                                    <p className="font-bold truncate">{video.title}</p>
                                    <p className="text-xs text-zinc-400 mb-1">{video.type}</p>
                                    <p className="text-sm text-zinc-400">{formatNumber(video.views)} YouTube Views</p>
                                </div>
                                <button
                                    onClick={() => handleUploadToSpotify(video.id)}
                                    disabled={money < cost}
                                    className="bg-green-600 text-white font-bold py-2 px-4 rounded text-sm disabled:opacity-50 hover:bg-green-500 whitespace-nowrap"
                                >
                                    Distribute
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VevoView;
