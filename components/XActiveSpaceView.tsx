import React, { useState, useEffect } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import UserVerifiedBadge from './icons/UserVerifiedBadge';

const XActiveSpaceView: React.FC = () => {
    const { gameState, dispatch, activeArtistData } = useGame();
    const [listeners, setListeners] = useState(15);
    const [duration, setDuration] = useState(0);
    const [showSongSelect, setShowSongSelect] = useState(false);
    const [promotedSong, setPromotedSong] = useState('');

    const { xUsers, xPosts, selectedPlayerXUserId, songs, hype, popularity } = activeArtistData!;
    const playerUser = selectedPlayerXUserId ? xUsers.find(u => u.id === selectedPlayerXUserId) : xUsers.find(u => u.isPlayer);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setDuration(prev => prev + 1);
            setListeners(prev => Math.max(10, prev + Math.floor(Math.random() * 20) - 5));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLeave = () => {
        if(promotedSong) {
            dispatch({ type: 'PROMOTE_SONG_ON_X_SPACE', payload: { songId: promotedSong, listeners: listeners * (duration / 10) } });
        }
        dispatch({ type: 'END_X_SPACE', payload: undefined });
        dispatch({ type: 'CHANGE_VIEW', payload: 'x' });
    };

    const host = playerUser || { name: 'Host', avatar: 'https://ui-avatars.com/api/?name=H', isVerified: false, id: 'host' };
    
    // Generate speakers/listeners based on hype/popularity and actual users
    const stans = [...xUsers.filter(u => u.id.includes('fan'))].sort(() => 0.5 - Math.random());
    const haters = [...xUsers.filter(u => u.id.startsWith('hater_'))].sort(() => 0.5 - Math.random());
    
    // 80% stans, 20% haters roughly
    const spaceParticipants = [
        ...stans.slice(0, 8),
        ...haters.slice(0, 3)
    ].sort(() => 0.5 - Math.random());
    
    const speakers = spaceParticipants.slice(0, 7).map(u => ({
        id: u.id,
        name: u.name,
        avatar: u.avatar,
        isVerified: u.isVerified
    }));

    const listenerList = spaceParticipants.slice(7, 11).map(u => ({
        id: u.id,
        name: u.name,
        avatar: u.avatar,
        isVerified: u.isVerified
    }));
    
    const totalPotentialListeners = Math.floor(hype * 150) + Math.floor(popularity * 80) + 100;
    
    // Initialize listeners to realistic count when starting
    useEffect(() => {
        setListeners(totalPotentialListeners);
    }, [totalPotentialListeners]);

    return (
        <div className="bg-[#111] h-full overflow-y-auto text-white pt-safe px-4 flex flex-col pb-24">
            <header className="flex items-center justify-between py-4">
                <button onClick={() => {}} className="transform -rotate-90">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div className="flex items-center gap-4">
                    <button><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg></button>
                    <button><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg></button>
                    <button onClick={handleLeave} className="text-red-500 font-bold text-lg px-2">Leave</button>
                </div>
            </header>

            <div className="flex gap-2 items-center text-[#7F56D9] font-bold text-sm bg-[#7F56D9]/10 w-fit px-2 py-1 rounded-md">
                <div className="w-2 h-2 bg-[#7F56D9] rounded-full animate-pulse"></div>
                LIVE · {formatNumber(listeners)} listening
            </div>

            <h1 className="font-bold text-2xl mt-4">{xPosts.find(p => p.isSpace && !p.spaceInfo?.isEnded)?.content.replace('Listening to ', '') || 'Space'}</h1>
            {promotedSong && <p className="text-sm text-green-400 mt-1">Promoting: {songs.find(s => s.id === promotedSong)?.title}</p>}

            <div className="flex-1 overflow-y-auto mt-6">
                <div className="grid grid-cols-4 gap-y-6 gap-x-2">
                    <div className="flex flex-col items-center text-center">
                        <img src={host.avatar} className="w-16 h-16 rounded-full border-2 border-[#7F56D9]" />
                        <span className="font-bold text-sm mt-1 truncate w-full px-1">{host.name} <UserVerifiedBadge isVerified={host.isVerified} className="inline w-3 h-3" /></span>
                        <span className="text-xs text-zinc-500">Host</span>
                    </div>
                    {speakers.map(s => (
                        <div key={s.id} className="flex flex-col items-center text-center">
                            <img src={s.avatar} className="w-16 h-16 rounded-full" />
                            <span className="font-bold text-sm mt-1 truncate w-full px-1">{s.name} <UserVerifiedBadge isVerified={s.isVerified} className="inline w-3 h-3" /></span>
                            <span className="text-xs text-zinc-500">Speaker</span>
                        </div>
                    ))}
                    {listenerList.map(l => (
                         <div key={l.id} className="flex flex-col items-center text-center">
                            <img src={l.avatar} className="w-16 h-16 rounded-full" />
                            <span className="font-bold text-sm mt-1 truncate w-full px-1">{l.name}</span>
                            <span className="text-xs text-zinc-500">Listener</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pb-8 pt-4 flex flex-col">
                <button onClick={() => setShowSongSelect(!showSongSelect)} className="border border-zinc-700 font-bold py-3 rounded-full mb-4 hover:bg-zinc-800 transition">
                    Promote a Song
                </button>
                {showSongSelect && (
                   <div className="bg-zinc-900 absolute bottom-32 left-4 right-4 rounded-xl max-h-60 overflow-y-auto p-2 border border-zinc-800 shadow-xl">
                        {songs.length > 0 ? songs.map(song => (
                            <button 
                                key={song.id} 
                                onClick={() => { setPromotedSong(song.id); setShowSongSelect(false); }}
                                className="w-full text-left p-3 hover:bg-zinc-800 rounded-lg flex items-center justify-between"
                            >
                                <span>{song.title}</span>
                                {promotedSong === song.id && <span className="text-green-500 font-bold">Selected</span>}
                            </button>
                        )) : <p className="text-center p-4 text-sm text-zinc-500">No songs available.</p>}
                   </div>
                )}
                
                <div className="flex gap-4 items-center">
                   <div className="flex-1 bg-zinc-800 rounded-full flex justify-around p-2">
                       <button className="p-2"><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg></button>
                   </div>
                   <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                       <span className="text-black text-2xl font-bold">❤️</span>
                   </button>
                </div>
            </div>
        </div>
    );
};

export default XActiveSpaceView;
