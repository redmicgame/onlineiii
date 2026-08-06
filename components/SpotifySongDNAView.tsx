import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import type { Song, PlayableGroup } from '../types';
import { NPC_ARTIST_IMAGES } from '../constants';
import { SongDNAProfileView } from './SongDNAProfileView';

export const SpotifySongDNAView: React.FC<{ song: Song; onBack: () => void; }> = ({ song, onBack }) => {
    const { activeArtist, activeArtistData, allPlayerArtists } = useGame();
    const [selectedContributor, setSelectedContributor] = useState<string | null>(null);

    if (!activeArtistData) return null;

    // Build the contributors list
    const mainArtistName = activeArtistData.group ? activeArtistData.group.name : activeArtist.name;
    const mainArtistImage = activeArtistData.group ? activeArtistData.group.image : activeArtist.image;
    
    // In our game, the song properties contain the string arrays for producers, etc.
    const hasSongwriters = song.songwriters && song.songwriters.length > 0;
    const hasProducers = song.producers && song.producers.length > 0;
    const hasEngineers = song.engineers && song.engineers.length > 0;
    const hasAnr = song.anr && song.anr.length > 0;
    const hasSamples = song.samples && song.samples.length > 0;

    // Default: give credit to main artist if lists are empty (songs released prior to update)
    const songwriters = hasSongwriters ? song.songwriters! : [mainArtistName];
    const producers = hasProducers ? song.producers! : [mainArtistName];
    const engineers = hasEngineers ? song.engineers! : [mainArtistName];
    const anr = hasAnr ? song.anr! : []; // No anr credit by default

    // Helper to get image (returns null if we want to skip showing an image for this UI element)
    const getImageForContributor = (name: string, roleType: 'Producer' | 'Songwriter' | 'Engineer' | 'A&R' | 'Featured Artist' | 'Main Artist') => {
        if (name === mainArtistName) return mainArtistImage;
        const p = allPlayerArtists.find(a => a.name === name);
        if (p) return p.image;
        if (NPC_ARTIST_IMAGES[name]) return NPC_ARTIST_IMAGES[name];
        
        // If it's an A&R or Engineer with a random name, we return undefined to not show an image
        if (roleType === 'A&R' || roleType === 'Engineer') return null;
        
        // Return null for real life producers and songwriters so it uses the generic silhouette icon
        if (roleType === 'Producer' || roleType === 'Songwriter') return null;
        
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=333&color=fff`;
    };

    // Calculate total contributors count
    const allContributors = new Set([
        mainArtistName,
        ...(song.features || []),
        ...(song.collaboration ? [song.collaboration.artistName] : []),
        ...(song.isFeatureToNpc && song.npcArtistName ? [song.npcArtistName] : []),
        ...producers,
        ...songwriters,
        ...engineers,
        ...anr
    ]);

    // Build rich contributor list
    type RichContributor = { name: string, image: string | null, roles: string[] };
    const richContributorsMap = new Map<string, RichContributor>();

    const addRole = (name: string, role: string) => {
        if (!richContributorsMap.has(name)) {
            let roleType: any = role;
            if (role === 'A&R' || role === 'Engineer' || role === 'Songwriter' || role === 'Producer' || role === 'Featured Artist' || role === 'Main Artist') {
                // strict match typecast
            } else {
                roleType = 'Songwriter';
            }
            richContributorsMap.set(name, { name, image: getImageForContributor(name, roleType), roles: [] });
        }
        richContributorsMap.get(name)!.roles.push(role);
    };

    addRole(mainArtistName, "Main Artist");
    if (song.features) { song.features.forEach(f => addRole(f, "Featured Artist")); }
    if (song.collaboration) addRole(song.collaboration.artistName, "Featured Artist");
    if (song.isFeatureToNpc && song.npcArtistName) addRole(song.npcArtistName, "Featured Artist");
    producers.forEach(p => addRole(p, "Producer"));
    songwriters.forEach(s => addRole(s, "Songwriter"));
    engineers.forEach(e => addRole(e, "Engineer"));
    anr.forEach(a => addRole(a, "A&R"));

    const richContributors = Array.from(richContributorsMap.values());

    return (
        <div className="fixed inset-0 bg-[#121212] z-50 text-white flex flex-col animate-[slideUp_0.3s_ease-out]" style={{ animation: 'slideUp 0.3s ease-out forwards' }}>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes slideUp { 0% { transform: translateY(100%); } 100% { transform: translateY(0); } }
            `}} />
            <header className="h-14 flex-shrink-0 bg-[#121212] flex items-center justify-between px-4 z-10 border-b border-white/10">
                <button onClick={onBack} className="p-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="flex items-center gap-2 font-bold text-lg">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M11.996 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12 12 12 0 0 0-12-12zm5.772 17.27a.754.754 0 0 1-1.037.248c-2.842-1.735-6.42-2.127-10.638-1.164a.755.755 0 0 1-.341-1.47c4.61-1.054 8.56-.607 11.768 1.35.372.227.491.716.248 1.036zm1.471-3.284a.94.94 0 0 1-1.294.305c-3.242-1.991-8.225-2.584-12.029-1.428a.941.941 0 0 1-.555-1.802c4.341-1.317 9.873-.655 13.573 1.62.43.264.566.837.305 1.295l-.001.01zm.105-3.41c-3.921-2.327-10.37-2.54-14.122-1.405a1.127 1.127 0 1 1-.652-2.155c4.321-1.31 11.455-1.055 16.023 1.656a1.127 1.127 0 1 1-1.25 1.904z"/></svg>
                    SongDNA <span className="bg-[#1ed760] text-black text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider -ml-1">Beta</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg></button>
                    <button onClick={onBack} className="p-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto text-left px-5 pt-8 pb-20">
                <div className="flex items-center gap-4 mb-8">
                    <img src={song.coverArt} className="w-16 h-16 sm:w-20 sm:h-20 rounded shadow-lg shadow-black/50" alt="" />
                    <div className="flex-grow min-w-0 pr-2">
                        <h1 className="text-xl sm:text-2xl font-bold truncate">{song.title}</h1>
                        <p className="text-zinc-400 text-[13px] sm:text-sm flex items-center gap-1.5 mt-1 truncate">
                            {song.explicit && <span className="text-[10px] w-4 h-4 bg-zinc-400 text-black font-bold rounded-sm flex items-center justify-center flex-shrink-0">E</span>}
                            <span className="truncate">{new Date().getFullYear()} • {[mainArtistName, ...(song.features || []), ...(song.collaboration ? [song.collaboration.artistName] : [])].join(", ")}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <button><svg className="w-6 h-6 text-zinc-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg></button>
                        <button className="bg-white rounded-full p-2 flex items-center justify-center hover:scale-105 transition-transform"><svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></button>
                    </div>
                </div>

                <h2 className="text-xl font-bold mb-6 tracking-tight">Contributors</h2>
                <div className="flex overflow-x-auto gap-4 pb-6 snap-x -mx-5 px-5">
                    {richContributors.map((c, idx) => (
                        <div key={idx} className="flex-shrink-0 w-32 flex flex-col items-center text-center snap-start cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedContributor(c.name)}>
                            {c.image ? (
                                <img src={c.image} alt={c.name} className="w-24 h-24 rounded-full object-cover mb-3 bg-[#333]" />
                            ) : (
                                <div className="w-24 h-24 rounded-full mb-3 bg-[#333] flex items-center justify-center text-zinc-500">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                                </div>
                            )}
                            <p className="font-bold text-sm leading-tight mb-1">{c.name}</p>
                            <p className="text-xs text-zinc-400 leading-tight">
                                {c.roles[0]} {c.roles.length > 1 && `+ ${c.roles.length - 1} role${c.roles.length > 2 ? 's' : ''}`}
                            </p>
                        </div>
                    ))}
                </div>

                {hasSamples && (
                    <div className="mt-8">
                        <div className="flex items-center gap-2 mb-6">
                            <h2 className="text-xl font-bold">Interpolations & Samples</h2>
                            <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="space-y-4">
                            {song.samples!.map((sz, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <img src={sz.coverArt} className="w-14 h-14 rounded object-cover" alt="" />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-[15px]">{sz.songTitle}</p>
                                        <p className="text-sm text-zinc-400">{sz.artistName}</p>
                                        <p className="text-xs text-zinc-500 mt-0.5">{sz.type}</p>
                                    </div>
                                    <svg className="w-5 h-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
            
            {selectedContributor && (
                <SongDNAProfileView 
                    contributorName={selectedContributor}
                    onBack={() => setSelectedContributor(null)}
                    onClose={() => {
                        setSelectedContributor(null);
                        onBack();
                    }}
                    onContributorClick={(name) => setSelectedContributor(name)}
                />
            )}
        </div>
    );
};
