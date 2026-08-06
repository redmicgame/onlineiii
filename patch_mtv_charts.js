import fs from 'fs';
const mtvCode = `import React, { useMemo, useState } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ArrowLeftIcon from './icons/ArrowLeftIcon';

const MTVView: React.FC = () => {
    const { gameState, dispatch } = useGame();
    const { artistsData, npcs } = gameState;
    const [activeTab, setActiveTab] = useState<'countdown' | 'myVideos'>('countdown');

    const topVideos = useMemo(() => {
        let allMVs = [];
        
        // Player/Playable Videos
        for (const artistId in artistsData) {
            const data = artistsData[artistId];
            let artistName = "Artist";
            if (gameState.soloArtist?.id === artistId) artistName = gameState.soloArtist.name;
            else if (gameState.group?.id === artistId) artistName = gameState.group.name;
            else if (gameState.extraPlayableArtists) {
                const found = gameState.extraPlayableArtists.find(a => a.id === artistId);
                if (found) artistName = found.name;
            }
            data.videos.forEach(v => {
                if (v.type === 'Music Video' || v.type === 'Live Performance') {
                    const weeksSinceRelease = (gameState.date.year * 52 + gameState.date.week) - (v.releaseDate.year * 52 + v.releaseDate.week);
                    if (weeksSinceRelease <= 78) {
                        allMVs.push({ 
                            ...v, 
                            artistName, 
                            isPlayer: true,
                            requests: Math.floor(v.views / 500) + 100 
                        });
                    }
                }
            });
        }
        
        // NPC Videos
        if (npcs) {
            npcs.forEach(npc => {
                const age = npc.releaseDate ? (gameState.date.year * 52 + gameState.date.week) - (npc.releaseDate.year * 52 + npc.releaseDate.week) : 0;
                if (age <= 78 && npc.basePopularity > 20) {
                    allMVs.push({
                        id: npc.uniqueId,
                        title: npc.title,
                        artistName: npc.artist,
                        thumbnail: npc.coverArt || 'https://images.unsplash.com/photo-1593697821252-0cbfabc258dd?w=500&q=80',
                        isPlayer: false,
                        views: npc.basePopularity * 100000,
                        requests: Math.floor((npc.basePopularity * 50) + Math.random() * 500),
                        type: 'Music Video'
                    });
                }
            });
        }

        return allMVs
            .sort((a, b) => b.requests - a.requests)
            .slice(0, 10);
    }, [artistsData, npcs, gameState]);

    const myVideos = useMemo(() => {
        let myMVs = [];
        if (gameState.activeArtistId && artistsData[gameState.activeArtistId]) {
            const data = artistsData[gameState.activeArtistId];
            data.videos.forEach(v => {
                if (v.type === 'Music Video' || v.type === 'Live Performance') {
                    myMVs.push(v);
                }
            });
        }
        return myMVs.sort((a, b) => b.views - a.views);
    }, [artistsData, gameState.activeArtistId]);

    return (
        <div className="h-full w-full bg-black overflow-y-auto text-white">
            <header className="p-4 flex flex-col gap-4 sticky top-0 bg-black/90 backdrop-blur z-20 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'game'})} className="p-2 hover:bg-white/10 rounded-full">
                            <ArrowLeftIcon className="w-6 h-6" />
                        </button>
                        <h1 className="text-4xl font-black italic tracking-tighter">MTV</h1>
                    </div>
                    <div className="text-xs font-bold text-zinc-500 text-right">
                        MUSIC<br/>TELEVISION
                    </div>
                </div>
                <div className="flex gap-4 border-t border-zinc-800 pt-3">
                    <button 
                        onClick={() => setActiveTab('countdown')}
                        className={\`px-4 py-2 font-bold text-sm tracking-widest uppercase transition-colors \${activeTab === 'countdown' ? 'bg-red-600 text-white rounded-lg' : 'text-zinc-500 hover:text-white'}\`}
                    >
                        TRL Countdown
                    </button>
                    <button 
                        onClick={() => setActiveTab('myVideos')}
                        className={\`px-4 py-2 font-bold text-sm tracking-widest uppercase transition-colors \${activeTab === 'myVideos' ? 'bg-red-600 text-white rounded-lg' : 'text-zinc-500 hover:text-white'}\`}
                    >
                        My Videos
                    </button>
                </div>
            </header>
            
            <main className="p-4 space-y-8 pb-24 max-w-4xl mx-auto">
                {activeTab === 'countdown' ? (
                    <>
                        <section className="relative rounded-2xl overflow-hidden bg-zinc-900 aspect-video flex items-end p-6 border-2 border-zinc-800">
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
                            <div className="relative z-20 w-full flex justify-between items-end">
                                <div>
                                    <span className="bg-red-600 text-white font-black px-2 py-1 text-xs uppercase tracking-widest mb-2 inline-block">Breaking News</span>
                                    <h2 className="text-3xl md:text-5xl font-black italic">TRL IS LIVE!</h2>
                                    <p className="text-zinc-300 md:text-lg mt-2 font-medium">The most requested music videos of the week.</p>
                                </div>
                            </div>
                        </section>
                        
                        <section>
                            <h2 className="text-2xl font-black mb-4 flex items-center gap-2 italic">
                                <span className="text-red-600">TOTAL REQUEST</span> LIVE
                            </h2>
                            
                            {topVideos.length === 0 ? (
                                <div className="p-10 text-center bg-zinc-900 border border-zinc-800 rounded-xl">
                                    <p className="text-zinc-500 font-bold">No music videos on rotation this week.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {topVideos.map((video, index) => (
                                        <div key={video.id} className="flex flex-col md:flex-row gap-4 bg-zinc-900 p-3 rounded-xl items-center relative overflow-hidden group border border-zinc-800 hover:border-zinc-600 transition-colors">
                                            <div className="absolute left-0 top-0 bottom-0 w-12 bg-red-600 flex items-center justify-center font-black text-2xl skew-x-12 -ml-2">
                                                <span className="-skew-x-12">{index + 1}</span>
                                            </div>
                                            <div className="pl-14 w-full md:w-auto">
                                                <img src={video.thumbnail || video.coverArt} alt={video.title} className="w-full md:w-32 aspect-video object-cover rounded shadow-md border border-zinc-800" />
                                            </div>
                                            <div className="flex-1 min-w-0 py-2 md:py-0 w-full md:pl-0 pl-14">
                                                <h3 className="font-black text-xl truncate tracking-tight">{video.title}</h3>
                                                <p className="text-red-500 font-bold truncate text-sm uppercase tracking-wider">{video.artistName}</p>
                                            </div>
                                            <div className="text-right hidden md:block">
                                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Requests</p>
                                                <p className="font-black text-xl">{formatNumber(video.requests || video.views)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                ) : (
                    <section>
                        <h2 className="text-2xl font-black mb-4 flex items-center gap-2 italic">
                            <span className="text-red-600">MY</span> VIDEOS
                        </h2>
                        {myVideos.length === 0 ? (
                            <div className="p-10 text-center bg-zinc-900 border border-zinc-800 rounded-xl">
                                <p className="text-zinc-500 font-bold">You haven't released any music videos yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {myVideos.map((video) => (
                                    <div key={video.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-colors">
                                        <div className="aspect-video relative">
                                            <img src={video.thumbnail || video.coverArt} alt={video.title} className="w-full h-full object-cover" />
                                            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs font-bold">
                                                {formatNumber(video.views)} views
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-black text-lg truncate">{video.title}</h3>
                                            <p className="text-zinc-500 text-sm font-bold uppercase">{video.type}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
                
                <section className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 rounded-xl p-8 text-center relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 text-[150px] font-black italic opacity-5 text-red-600 pointer-events-none">MTV</div>
                    <h2 className="text-2xl font-black mb-2 italic relative z-10">SUBMIT YOUR VIDEO</h2>
                    <p className="text-zinc-400 text-sm mb-6 relative z-10 max-w-md mx-auto">Shoot a music video and submit it to the MTV programming team to get on the TRL countdown.</p>
                    <button 
                        onClick={() => dispatch({type: 'CHANGE_VIEW', payload: 'createVideo'})} 
                        className="relative z-10 bg-red-600 hover:bg-red-700 text-white font-black py-4 px-8 rounded-lg w-full md:w-auto transition-colors uppercase tracking-widest text-sm"
                    >
                        Create Music Video
                    </button>
                </section>
            </main>
        </div>
    );
};

export default MTVView;
`;
fs.writeFileSync('components/MTVView.tsx', mtvCode);
