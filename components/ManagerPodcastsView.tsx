import React, { useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import { Podcast } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import SpotifyIcon from './icons/SpotifyIcon';

const ManagerPodcastsView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const activeArtist = gameState.careerMode === 'solo' ? gameState.soloArtist : gameState.group;
    const activeArtistData = activeArtist ? gameState.artistsData[activeArtist.id] : null;

    const [selectedReleaseId, setSelectedReleaseId] = useState<string>('');

    if (!activeArtist || !activeArtistData) return null;

    const podcasts = gameState.podcasts || [];
    const npcPodcasts = podcasts.filter(p => p.isNpc);
    const existingOffers = activeArtistData.podcastPitchOffers || [];

    const handlePitch = (podcastId: string, reqPop: number) => {
        if (!selectedReleaseId) {
            alert("Please select a release to promote first.");
            return;
        }

        const isAccepted = (activeArtistData.popularity || 0) >= reqPop;
        const newOffer = {
            id: `pitch_${Date.now()}`,
            podcastId,
            type: 'podcast_pitch' as const,
            status: isAccepted ? 'accepted' as const : 'rejected' as const,
            releaseIdToPromote: selectedReleaseId,
            date: { ...gameState.date }
        };

        dispatch({
            type: 'UPDATE_ARTIST_DATA',
            payload: {
                podcastPitchOffers: [...existingOffers, newOffer]
            }
        });

        if (isAccepted) {
            alert("Pitch Accepted! You will appear on the podcast this week. Check the podcast's page on Spotify for Creators to see the episode.");
            
            // Generate episode on the podcast
            const release = activeArtistData.releases?.find(r => r.id === selectedReleaseId);
            const podcast = podcasts.find(p => p.id === podcastId);
            if (podcast) {
                const newEp = {
                    id: `ep_guest_${Date.now()}`,
                    title: `${activeArtist.name} on ${release?.title}`,
                    description: `${activeArtist.name} joins ${podcast.host} to talk about their new release, ${release?.title}.`,
                    duration: 60,
                    releaseDate: { ...gameState.date },
                    plays: 0,
                    revenue: 0,
                    hasVideo: true,
                    guestId: activeArtist.id,
                    guestName: activeArtist.name
                };
                
                const updatedPodcast = { ...podcast, episodes: [...podcast.episodes, newEp] };
                const newPodcasts = podcasts.map(p => p.id === podcast.id ? updatedPodcast : p);
                dispatch({ type: 'UPDATE_GAME_STATE', payload: { podcasts: newPodcasts } });
            }
            
            // Give a boost to the release
            dispatch({
                type: 'ADD_RELEASE_PROMO_BOOST',
                payload: {
                    releaseId: selectedReleaseId,
                    boostAmount: Math.floor(activeArtistData.popularity * 100)
                }
            });
            
        } else {
            alert("Pitch Rejected. Your public image or popularity is not high enough for this podcast.");
        }
    };

    return (
        <div className="p-4 max-w-4xl mx-auto pb-24 h-full w-full overflow-y-auto">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => dispatch({ type: 'CHANGE_VIEW', payload: 'management' })} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-3xl font-bold">Pitch to Podcasts</h1>
            </div>

            <p className="text-zinc-400 mb-6">
                Select an album or EP to promote, then ask your manager to pitch you to top podcasts. Depending on your popularity and public image, they may accept or decline.
            </p>

            <div className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 mb-8">
                <h2 className="text-xl font-bold mb-4">1. Select Release to Promote</h2>
                <select
                    value={selectedReleaseId}
                    onChange={(e) => setSelectedReleaseId(e.target.value)}
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-lg p-3 font-bold"
                >
                    <option value="">-- Select a Release --</option>
                    {(activeArtistData.releases || []).map(r => (
                        <option key={r.id} value={r.id}>{r.title} ({r.type})</option>
                    ))}
                </select>
            </div>

            <h2 className="text-2xl font-bold mb-4">2. Choose a Podcast</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {npcPodcasts.map(podcast => {
                    const reqPop = podcast.requiredPopularity || 50;
                    const alreadyPitched = existingOffers.find(o => o.podcastId === podcast.id && o.date.week === gameState.date.week && o.date.year === gameState.date.year);
                    
                    return (
                        <div key={podcast.id} className="bg-zinc-800 p-4 rounded-xl border border-zinc-700 flex flex-col">
                            <div className="flex items-start gap-4 mb-4">
                                <img src={podcast.coverArt || ''} alt={podcast.name} className="w-16 h-16 rounded-md object-cover bg-zinc-900" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(podcast.name) + '&background=18181b&color=fff&size=128'; }} />
                                <div>
                                    <h3 className="font-bold text-lg leading-tight">{podcast.name}</h3>
                                    <p className="text-sm text-zinc-400">Host: {podcast.host}</p>
                                    <div className="flex items-center gap-1 mt-1 text-xs font-medium text-zinc-500">
                                        <SpotifyIcon className="w-3 h-3 text-[#1ed760]" />
                                        {formatNumber(podcast.followers)} followers
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-zinc-300 italic mb-4 flex-1">"{podcast.description}"</p>
                            
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-xs text-zinc-500">Req. Popularity: {reqPop}</span>
                                <button
                                    onClick={() => handlePitch(podcast.id, reqPop)}
                                    disabled={alreadyPitched !== undefined}
                                    className="bg-white text-black font-bold py-1.5 px-4 rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                                >
                                    {alreadyPitched ? (alreadyPitched.status === 'accepted' ? 'Accepted!' : 'Rejected') : 'Pitch'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ManagerPodcastsView;
