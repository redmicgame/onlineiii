import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Podcast } from '../types';
import { ChevronLeft, Home, BarChart2, Mic, MessageSquare, Settings, Plus, Play, Users, Clock } from 'lucide-react';
import SpotifyIcon from './icons/SpotifyIcon';

const SpotifyForCreatorsView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const activeArtist = gameState.careerMode === 'solo' ? gameState.soloArtist : gameState.group;
    const allPodcasts = gameState.podcasts || [];
    
    // Find podcast owned by the player
    const myPodcasts = allPodcasts.filter(p => !p.isNpc && p.host === activeArtist?.name);
    const [selectedPodcast, setSelectedPodcast] = useState<Podcast | null>(myPodcasts.length > 0 ? myPodcasts[0] : null);
    
    const [activeTab, setActiveTab] = useState<'Home' | 'Analytics' | 'Episodes' | 'Comments' | 'Settings'>('Analytics');
    
    // Settings form state
    const [showName, setShowName] = useState(selectedPodcast?.name || '');
    const [showDesc, setShowDesc] = useState(selectedPodcast?.description || '');
    const [showEpisodeModal, setShowEpisodeModal] = useState(false);
    const [newEpTitle, setNewEpTitle] = useState('');
    const [newEpIsVideo, setNewEpIsVideo] = useState(false);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    
    const handleBack = () => {
        dispatch({ type: 'CHANGE_VIEW', payload: 'game' });
    };
    
    const handleCreatePodcast = () => {
        if (!activeArtist) return;
        const newPod: Podcast = {
            id: `pod_${Date.now()}`,
            name: `${activeArtist.name}'s Podcast`,
            host: activeArtist.name,
            description: "A new podcast.",
            topics: ["Music"],
            coverArt: activeArtist.imageUrl || null,
            followers: 0,
            episodes: [],
            totalPlays: 0,
            imdbRating: 0,
            isNpc: false
        };
        dispatch({ type: 'UPDATE_GAME_STATE', payload: { podcasts: [...allPodcasts, newPod] } });
        setSelectedPodcast(newPod);
        setActiveTab('Settings');
        setShowName(newPod.name);
        setShowDesc(newPod.description);
    };

    const handleSaveSettings = () => {
        if (!selectedPodcast) return;
        const updated = { ...selectedPodcast, name: showName, description: showDesc };
        const newPodcasts = allPodcasts.map(p => p.id === selectedPodcast.id ? updated : p);
        dispatch({ type: 'UPDATE_GAME_STATE', payload: { podcasts: newPodcasts } });
        setSelectedPodcast(updated);
        setToastMsg("Settings saved!"); setTimeout(() => setToastMsg(null), 3000);
    };
    
    const handleCreateEpisode = () => {
        setShowEpisodeModal(true);
        setNewEpTitle("");
        setNewEpIsVideo(false);
    };

    const confirmCreateEpisode = () => {
        if (!selectedPodcast || !newEpTitle) return;
        const newEp = {
            id: `ep_${Date.now()}`,
            title: newEpTitle,
            description: "A brand new episode.",
            duration: Math.floor(Math.random() * 60) + 30,
            releaseDate: { ...gameState.date },
            plays: 0,
            revenue: 0,
            hasVideo: newEpIsVideo
        };
        const updated = { ...selectedPodcast, episodes: [...selectedPodcast.episodes, newEp] };
        const newPodcasts = allPodcasts.map(p => p.id === selectedPodcast.id ? updated : p);
        dispatch({ type: 'UPDATE_GAME_STATE', payload: { podcasts: newPodcasts } });
        setSelectedPodcast(updated);
        setShowEpisodeModal(false);
        setToastMsg("Episode created!"); setTimeout(() => setToastMsg(null), 3000);
    };

    return (
        <div className="bg-[#f0f0f0] h-full w-full text-black font-sans flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-black text-white p-4 flex flex-col flex-shrink-0 h-auto md:h-full">
                <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={handleBack}>
                    <ChevronLeft className="w-5 h-5 text-zinc-400 hover:text-white" />
                    <SpotifyIcon className="w-6 h-6 text-[#a970ff]" />
                    <span className="font-bold text-lg tracking-tight">for Creators</span>
                </div>
                
                <button className="bg-white/10 text-white font-bold rounded-full py-2 px-4 mb-6 flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                    <svg className="w-4 h-4 text-[#a970ff]" fill="currentColor" viewBox="0 0 24 24"><path d="M11 2v4l3-3 3 3V2h-6zm6 10h4v10H3V12h4v2H5v6h14v-6h-2v-2zM9 13.5l5 2.5-5 2.5v-5z"/></svg>
                    Host with us
                </button>
                
                <nav className="flex flex-row md:flex-col gap-2 mb-4 md:mb-8 overflow-x-auto pb-2 flex-shrink-0 scrollbar-hide">
                    {[
                        { id: 'Home', icon: <Home className="w-5 h-5"/> },
                        { id: 'Analytics', icon: <BarChart2 className="w-5 h-5"/> },
                        { id: 'Episodes', icon: <Mic className="w-5 h-5"/> },
                        { id: 'Comments', icon: <MessageSquare className="w-5 h-5"/> },
                        { id: 'Settings', icon: <Settings className="w-5 h-5"/> }
                    ].map(item => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`flex items-center whitespace-nowrap gap-2 md:gap-3 px-3 py-2 md:py-2.5 rounded-md font-bold text-sm transition-colors ${activeTab === item.id ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'}`}
                        >
                            {item.icon}
                            {item.id}
                        </button>
                    ))}
                </nav>
                
                <div className="mt-auto">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 px-2">Your shows</h3>
                    <div className="flex flex-row md:flex-col gap-2 overflow-x-auto scrollbar-hide pb-2 md:pb-0">
                        {myPodcasts.map(pod => (
                            <div 
                                key={pod.id} 
                                onClick={() => { setSelectedPodcast(pod); setActiveTab('Analytics'); setShowName(pod.name); setShowDesc(pod.description); }}
                                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors flex-shrink-0 whitespace-nowrap ${selectedPodcast?.id === pod.id ? 'bg-zinc-800' : 'hover:bg-zinc-900'}`}
                            >
                                <img src={pod.coverArt || ''} alt="" className="w-8 h-8 rounded bg-zinc-700 object-cover" />
                                <span className="font-bold text-sm truncate">{pod.name}</span>
                            </div>
                        ))}
                        <button onClick={handleCreatePodcast} className="flex items-center gap-3 p-2 rounded-md hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors flex-shrink-0 whitespace-nowrap">
                            <Plus className="w-6 h-6" />
                            <span className="font-bold text-sm">Start a new podcast</span>
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 min-h-0 p-4 md:p-8 overflow-y-auto w-full">
                {!selectedPodcast ? (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                        <Mic className="w-16 h-16 mb-4 text-zinc-300" />
                        <h2 className="text-2xl font-bold text-black mb-2">Welcome to Spotify for Creators</h2>
                        <p className="mb-6">Start your podcast journey today.</p>
                        <button onClick={handleCreatePodcast} className="bg-black text-white font-bold rounded-full py-3 px-8 hover:scale-105 transition-transform">
                            Create a Podcast
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-4xl font-black tracking-tight">{activeTab}</h1>
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-[#8d7db5] rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {activeArtist?.name.charAt(0)}
                                </div>
                            </div>
                        </div>

                        {activeTab === 'Analytics' && (
                            <div className="max-w-5xl">
                                <div className="flex gap-6 mb-8 border-b border-zinc-200">
                                    <span className="pb-2 border-b-2 border-black font-bold text-sm">Overview</span>
                                    <span className="pb-2 text-zinc-500 font-bold text-sm cursor-pointer hover:text-black transition-colors">Discovery</span>
                                    <span className="pb-2 text-zinc-500 font-bold text-sm cursor-pointer hover:text-black transition-colors">Audience</span>
                                </div>
                                
                                <h3 className="font-bold text-xl mb-1">On Spotify</h3>
                                <p className="text-sm text-zinc-500 underline mb-6 cursor-pointer hover:text-black">About key stats on Spotify</p>
                                
                                <div className="flex flex-wrap gap-4 mb-8">
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-zinc-200 flex-1 min-w-[200px] cursor-pointer ring-2 ring-[#7b61ff]">
                                        <div className="flex items-center gap-1 text-zinc-600 mb-2">
                                            <Play className="w-4 h-4" />
                                            <span className="text-sm font-medium">Plays</span>
                                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        </div>
                                        <div className="text-3xl font-black">{selectedPodcast.totalPlays.toLocaleString()}</div>
                                        <div className="text-xs text-zinc-500 mt-1">All time</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-zinc-200 flex-1 min-w-[200px] cursor-pointer hover:bg-zinc-50 transition-colors">
                                        <div className="flex items-center gap-1 text-zinc-600 mb-2">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-sm font-medium">Consumption hours</span>
                                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        </div>
                                        <div className="text-3xl font-black">
                                            {Math.floor(selectedPodcast.totalPlays * 0.5).toLocaleString()}
                                        </div>
                                        <div className="text-xs text-zinc-500 mt-1">All time</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg shadow-sm border border-zinc-200 flex-1 min-w-[200px] cursor-pointer hover:bg-zinc-50 transition-colors">
                                        <div className="flex items-center gap-1 text-zinc-600 mb-2">
                                            <Users className="w-4 h-4" />
                                            <span className="text-sm font-medium">Followers</span>
                                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        </div>
                                        <div className="text-3xl font-black">+{selectedPodcast.followers.toLocaleString()}</div>
                                        <div className="text-xs text-zinc-500 mt-1">All time</div>
                                    </div>
                                </div>
                                
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-zinc-200 h-64 flex flex-col items-center justify-center">
                                    <BarChart2 className="w-12 h-12 text-[#7b61ff] mb-4 opacity-50" />
                                    <p className="text-zinc-500 font-medium">Keep creating episodes to see more trend data here.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Settings' && (
                            <div className="max-w-3xl">
                                <div className="flex gap-6 mb-8 border-b border-zinc-200">
                                    <span className="pb-2 border-b-2 border-black font-bold text-sm">About</span>
                                    <span className="pb-2 text-zinc-500 font-bold text-sm cursor-pointer hover:text-black transition-colors">Availability</span>
                                    <span className="pb-2 text-zinc-500 font-bold text-sm cursor-pointer hover:text-black transition-colors">Team</span>
                                </div>
                                
                                <div className="flex justify-end mb-6">
                                    <button onClick={handleSaveSettings} className="bg-[#7b61ff] hover:bg-[#6a50e5] text-white font-bold py-2 px-6 rounded-full transition-colors">
                                        Save
                                    </button>
                                </div>
                                
                                <div className="space-y-8">
                                    <div>
                                        <label className="block font-bold text-sm mb-2">Show name</label>
                                        <input 
                                            type="text" 
                                            value={showName}
                                            onChange={e => setShowName(e.target.value)}
                                            className="w-full border border-zinc-300 rounded-md p-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                            placeholder="Tell fans what your show is about..."
                                        />
                                        <div className="text-right text-xs text-zinc-500 mt-1">{showName.length} / 100</div>
                                    </div>
                                    
                                    <div>
                                        <label className="block font-bold text-sm mb-2">Description</label>
                                        <textarea 
                                            value={showDesc}
                                            onChange={e => setShowDesc(e.target.value)}
                                            className="w-full border border-zinc-300 rounded-md p-3 min-h-[120px] focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                            placeholder="What's your show about?"
                                        ></textarea>
                                        <div className="text-right text-xs text-zinc-500 mt-1">{showDesc.length} / 600</div>
                                    </div>
                                    
                                    <div>
                                        <label className="block font-bold text-sm mb-2">Creator name</label>
                                        <p className="text-sm text-zinc-500 mb-2">The host, creator, or organization name as it should appear alongside the show name.</p>
                                        <input 
                                            type="text" 
                                            value={selectedPodcast.host}
                                            disabled
                                            className="w-full border border-zinc-300 rounded-md p-3 bg-zinc-50 text-zinc-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'Episodes' && (
                            <div className="max-w-4xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-xl">Episodes</h3>
                                    <button onClick={handleCreateEpisode} className="bg-black text-white font-bold py-2 px-4 rounded-full hover:scale-105 transition-transform flex items-center gap-2">
                                        <Plus className="w-4 h-4"/> New episode
                                    </button>
                                </div>
                                
                                {selectedPodcast.episodes.length === 0 ? (
                                    <div className="bg-white p-8 rounded-lg shadow-sm border border-zinc-200 text-center">
                                        <Mic className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                                        <h4 className="font-bold text-lg mb-2">No episodes yet</h4>
                                        <p className="text-zinc-500 mb-6">Create your first episode to share with the world.</p>
                                    </div>
                                ) : (
                                    <div className="bg-white rounded-lg shadow-sm border border-zinc-200 overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-zinc-50 border-b border-zinc-200 text-xs text-zinc-500 uppercase">
                                                <tr>
                                                    <th className="px-6 py-4 font-bold">Episode</th>
                                                    <th className="px-6 py-4 font-bold">Release Date</th>
                                                    <th className="px-6 py-4 font-bold text-right">Plays</th>
                                                    <th className="px-6 py-4 font-bold text-right">Revenue</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-zinc-200">
                                                {selectedPodcast.episodes.map(ep => (
                                                    <tr key={ep.id} className="hover:bg-zinc-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="font-bold text-sm mb-1">{ep.title}</div>
                                                            <div className="text-xs text-zinc-500 flex items-center gap-2">
                                                                {ep.hasVideo ? <span className="bg-blue-100 text-blue-800 px-1.5 rounded">Video</span> : <span className="bg-zinc-200 px-1.5 rounded">Audio</span>}
                                                                {ep.duration} min
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-zinc-600 whitespace-nowrap">
                                                            {ep.releaseDate.year}-W{ep.releaseDate.week}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium text-right">
                                                            {ep.plays.toLocaleString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-[#a970ff] font-medium text-right">
                                                            ${ep.revenue.toLocaleString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {(activeTab === 'Home' || activeTab === 'Comments') && (
                            <div className="flex items-center justify-center h-64 bg-white rounded-lg border border-zinc-200 shadow-sm">
                                <p className="text-zinc-500 font-medium">This section is coming soon.</p>
                            </div>
                        )}
                    </>
                )}
                {toastMsg && (
                    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
                        {toastMsg}
                    </div>
                )}
                {showEpisodeModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="font-bold text-xl mb-4">Create New Episode</h3>
                            <div className="mb-4">
                                <label className="block text-sm font-bold mb-2">Episode Title</label>
                                <input type="text" value={newEpTitle} onChange={e => setNewEpTitle(e.target.value)} className="w-full border p-2 rounded" placeholder="Episode Title..." />
                            </div>
                            <div className="mb-6 flex items-center gap-2">
                                <input type="checkbox" id="video-ep" checked={newEpIsVideo} onChange={e => setNewEpIsVideo(e.target.checked)} />
                                <label htmlFor="video-ep" className="text-sm">Video Podcast</label>
                            </div>
                            <div className="flex gap-4 justify-end">
                                <button onClick={() => setShowEpisodeModal(false)} className="px-4 py-2 text-zinc-500 font-bold">Cancel</button>
                                <button onClick={confirmCreateEpisode} className="px-4 py-2 bg-black text-white font-bold rounded">Create</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SpotifyForCreatorsView;
