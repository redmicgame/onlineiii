import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Podcast } from '../types';
import SpotifyIcon from './icons/SpotifyIcon';
import { ChevronLeft, MoreHorizontal, Bell, Settings, Play, ArrowDownCircle, PlusCircle } from 'lucide-react';

const SpotifyPodcastsView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(null);
    const [activeTab, setActiveTab] = useState<'Episodes' | 'About' | 'More like this'>('Episodes');

    const handleBack = () => {
        if (selectedPodcast) {
            setSelectedPodcast(null);
        } else {
            dispatch({ type: 'CHANGE_VIEW', payload: 'game' });
        }
    };

    if (selectedPodcast) {
        return (
            <div className="bg-[#121212] min-h-screen text-white font-sans flex flex-col">
                {/* Header */}
                <div className="p-4 flex items-center justify-between sticky top-0 bg-[#121212]/90 backdrop-blur z-10">
                    <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="flex-1 ml-4 bg-zinc-800 rounded-md flex items-center px-3 py-2 text-sm text-zinc-400">
                        <span className="mr-2">🔍</span> Find in this show
                    </div>
                </div>

                {/* Podcast Info */}
                <div className="px-4 py-2 flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                        {selectedPodcast.coverArt ? (
                            <img src={selectedPodcast.coverArt} alt={selectedPodcast.name} className="w-32 h-32 rounded-lg shadow-2xl object-cover" />
                        ) : (
                            <div className="w-32 h-32 rounded-lg shadow-2xl bg-zinc-800 flex items-center justify-center">
                                <span className="text-zinc-500 font-bold text-xl">{selectedPodcast.name.substring(0, 2).toUpperCase()}</span>
                            </div>
                        )}
                        <div className="absolute top-2 left-2 bg-black rounded-full p-1 shadow-md">
                            <SpotifyIcon className="w-3 h-3 text-white" />
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                        <h1 className="text-2xl font-bold leading-tight mb-1">{selectedPodcast.name}</h1>
                        <p className="text-lg font-medium">{selectedPodcast.host}</p>
                        <div className="flex items-center text-xs text-zinc-400 mt-2">
                            <span className="bg-[#a970ff] text-black font-bold px-1 rounded mr-2 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                                Verified by Spotify
                            </span>
                        </div>
                    </div>
                </div>

                <div className="px-4 mt-2 text-sm text-zinc-400">
                    <span className="font-bold text-white">#1 in Top Podcasts</span> • ⭐️ {selectedPodcast.imdbRating.toFixed(1)} • {selectedPodcast.topics.join(', ')}
                </div>

                {/* Actions */}
                <div className="px-4 py-4 flex items-center gap-4">
                    <button className="border border-zinc-500 rounded-full px-4 py-1.5 font-bold text-sm hover:border-white hover:scale-105 transition-transform">
                        Follow
                    </button>
                    <button className="text-zinc-400 hover:text-white">
                        <Bell className="w-6 h-6" />
                    </button>
                    <button className="text-zinc-400 hover:text-white">
                        <Settings className="w-6 h-6" />
                    </button>
                    <button className="text-zinc-400 hover:text-white">
                        <MoreHorizontal className="w-6 h-6" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/10 px-4 mt-2">
                    {['Episodes', 'About', 'More like this'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`mr-6 pb-2 text-sm font-bold transition-colors ${activeTab === tab ? 'text-white border-b-2 border-[#a970ff]' : 'text-zinc-400 hover:text-zinc-200'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    {activeTab === 'About' && (
                        <div>
                            <p className="text-lg font-medium mb-4">{selectedPodcast.description}</p>
                            <div className="flex gap-4 mb-6">
                                <span className="bg-zinc-800 text-white font-bold rounded-full px-4 py-1 text-sm border border-white/10">⭐️ {selectedPodcast.imdbRating.toFixed(1)}</span>
                                <span className="bg-zinc-800 text-white font-bold rounded-full px-4 py-1 text-sm border border-white/10">{selectedPodcast.topics[0]}</span>
                            </div>
                        </div>
                    )}
                    {activeTab === 'Episodes' && (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <span className="font-bold text-sm flex items-center gap-2">
                                    <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                                    Newest • All Episodes
                                </span>
                            </div>
                            
                            {selectedPodcast.episodes.length === 0 ? (
                                <p className="text-zinc-400 text-sm">No episodes yet.</p>
                            ) : (
                                selectedPodcast.episodes.slice().reverse().map((ep) => (
                                    <div key={ep.id} className="mb-6 pb-6 border-b border-white/10">
                                        <h3 className="font-bold text-lg mb-2">{ep.title}</h3>
                                        <p className="text-sm text-zinc-400 line-clamp-2 mb-3">{ep.description}</p>
                                        <div className="flex items-center text-xs text-zinc-400 font-medium mb-4 gap-2">
                                            {ep.hasVideo && <span className="bg-white/10 text-white px-1.5 rounded uppercase tracking-wider text-[10px]">Video</span>}
                                            <span>{(ep.plays / 1000).toFixed(1)}k plays</span>
                                            <span>•</span>
                                            <span>{ep.releaseDate.year}-W{ep.releaseDate.week}</span>
                                            <span>•</span>
                                            <span>{ep.duration}min</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex gap-4 text-zinc-400">
                                                <PlusCircle className="w-6 h-6 hover:text-white cursor-pointer" />
                                                <ArrowDownCircle className="w-6 h-6 hover:text-white cursor-pointer" />
                                                <MoreHorizontal className="w-6 h-6 hover:text-white cursor-pointer" />
                                            </div>
                                            <button className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform">
                                                <Play className="w-5 h-5 ml-0.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const allPodcasts = [...(gameState.podcasts || [])];
    allPodcasts.sort((a, b) => b.followers - a.followers);

    return (
        <div className="bg-[#121212] min-h-screen text-white font-sans flex flex-col pb-20">
            <div className="p-4 flex items-center sticky top-0 bg-[#121212]/90 backdrop-blur z-10">
                <button onClick={handleBack} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
            </div>
            
            <div className="px-4 pb-4">
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-32 h-32 bg-[#2d46b9] rounded-md shadow-2xl flex flex-col justify-between p-4 flex-shrink-0 relative">
                        <div className="absolute top-2 left-2 bg-black rounded-full p-1 shadow-md">
                            <SpotifyIcon className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-bold text-xl leading-tight text-white mt-4 tracking-tighter">Top<br/>Podcasts</span>
                        <div className="flex items-center text-xs font-bold gap-1 mt-auto">
                            <div className="bg-white text-black w-4 h-4 flex items-center justify-center rounded-sm">↗</div>
                            Podcast Charts
                        </div>
                    </div>
                    <div className="flex flex-col justify-center py-2">
                        <span className="text-zinc-300 font-bold tracking-widest text-xs uppercase mb-1">USA</span>
                        <h1 className="text-4xl font-black tracking-tight leading-none">Top Podcasts</h1>
                    </div>
                </div>
                
                <p className="text-zinc-400 font-medium mb-6 text-sm">Top podcasts, updated daily.</p>
                
                <div className="flex flex-col gap-4">
                    {allPodcasts.map((podcast, index) => (
                        <div 
                            key={podcast.id} 
                            onClick={() => setSelectedPodcast(podcast)}
                            className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-md transition-colors"
                        >
                            <div className="w-4 text-center font-bold text-zinc-400 group-hover:text-white">
                                {index + 1}
                            </div>
                            <img src={podcast.coverArt || ''} alt={podcast.name} className="w-14 h-14 rounded-md object-cover bg-zinc-800" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-base truncate text-white">{podcast.name}</h3>
                                <p className="text-sm text-zinc-400 truncate">{podcast.host}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SpotifyPodcastsView;
