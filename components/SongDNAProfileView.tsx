import React, { useState, useMemo } from 'react';
import { useGame } from '../context/GameContext';
import type { Song } from '../types';
import { NPC_ARTIST_IMAGES } from '../constants';

export const SongDNAProfileView: React.FC<{ 
    contributorName: string;
    onBack: () => void;
    onClose: () => void;
    onContributorClick?: (name: string) => void;
}> = ({ contributorName, onBack, onClose, onContributorClick }) => {
    const { activeArtist, activeArtistData, allPlayerArtists, gameState } = useGame();

    const stats = useMemo(() => {
        if (!activeArtistData) return { songs: [], collaborators: new Map(), topSongs: [] };

        const allSongs: Song[] = [];
        Object.values(gameState.artistsData).forEach(data => {
            if (data && data.songs) {
                allSongs.push(...data.songs);
            }
        });
        
        // Remove duplicates if any song IDs matched (shouldn't happen, but just in case)
        const uniqueSongs = Array.from(new Map(allSongs.map(s => [s.id, s])).values());
        
        // Find all songs this person worked on
        const theirSongs = uniqueSongs.filter(song => {
            // Need to figure out who the main artist of this song is.
            // The song.artistId tells us whose data it belongs to.
            const songArtist = allPlayerArtists.find(a => a.id === song.artistId);
            const isMain = songArtist ? (songArtist.name === contributorName) : false;
            if (isMain) return true;
            if (song.collaboration && song.collaboration.artistName === contributorName) return true;
            if (song.features && song.features.includes(contributorName)) return true;
            if (song.isFeatureToNpc && song.npcArtistName === contributorName) return true;
            if (song.songwriters?.includes(contributorName)) return true;
            if (song.producers?.includes(contributorName)) return true;
            if (song.engineers?.includes(contributorName)) return true;
            if (song.anr?.includes(contributorName)) return true;
            return false;
        });

        const collabMap = new Map<string, { songs: number, totalCollabs: number }>();

        const getCollabsForPerson = (person: string) => {
            const songsForPerson = uniqueSongs.filter(song => {
                const songArtist = allPlayerArtists.find(a => a.id === song.artistId);
                const isMain = songArtist ? (songArtist.name === person) : false;
                if (isMain) return true;
                if (song.collaboration && song.collaboration.artistName === person) return true;
                if (song.features && song.features.includes(person)) return true;
                if (song.isFeatureToNpc && song.npcArtistName === person) return true;
                if (song.songwriters?.includes(person)) return true;
                if (song.producers?.includes(person)) return true;
                if (song.engineers?.includes(person)) return true;
                if (song.anr?.includes(person)) return true;
                return false;
            });
            
            const uniqueCollabs = new Set<string>();
            songsForPerson.forEach(song => {
                const mainName = activeArtistData.group ? activeArtistData.group.name : activeArtist.name;
                if (mainName) uniqueCollabs.add(mainName);
                if (song.collaboration && song.collaboration.artistName) uniqueCollabs.add(song.collaboration.artistName);
                if (song.features) song.features.forEach(f => uniqueCollabs.add(f));
                if (song.isFeatureToNpc && song.npcArtistName) uniqueCollabs.add(song.npcArtistName);
                song.songwriters?.forEach(s => { if (s) uniqueCollabs.add(s); });
                song.producers?.forEach(p => { if (p) uniqueCollabs.add(p); });
                song.engineers?.forEach(e => { if (e) uniqueCollabs.add(e); });
                song.anr?.forEach(a => { if (a) uniqueCollabs.add(a); });
            });
            // remove self
            if (person) uniqueCollabs.delete(person);

            return {
                songs: songsForPerson.length,
                totalCollabs: uniqueCollabs.size
            };
        };

        const theirCollabs = new Set<string>();
        theirSongs.forEach(song => {
            const mainName = activeArtistData.group ? activeArtistData.group.name : activeArtist.name;
            if (mainName) theirCollabs.add(mainName);
            if (song.collaboration && song.collaboration.artistName) theirCollabs.add(song.collaboration.artistName);
            if (song.features) song.features.forEach(f => theirCollabs.add(f));
            if (song.isFeatureToNpc && song.npcArtistName) theirCollabs.add(song.npcArtistName);
            song.songwriters?.forEach(s => { if (s) theirCollabs.add(s); });
            song.producers?.forEach(p => { if (p) theirCollabs.add(p); });
            song.engineers?.forEach(e => { if (e) theirCollabs.add(e); });
            song.anr?.forEach(a => { if (a) theirCollabs.add(a); });
        });
        theirCollabs.delete(contributorName);

        // Pre-calculate stats for collaborators
        theirCollabs.forEach(collab => {
            collabMap.set(collab, getCollabsForPerson(collab));
        });

        return {
            songs: theirSongs,
            collaborators: collabMap,
            topSongs: [...theirSongs].sort((a, b) => (b.streams || 0) - (a.streams || 0)).slice(0, 10),
            totalUniqueCollabs: theirCollabs.size
        };

    }, [activeArtistData, contributorName]);

    const getImageForContributor = (name: string) => {
        if (!activeArtistData) return null;
        const mainArtistName = activeArtistData.group ? activeArtistData.group.name : activeArtist.name;
        const mainArtistImage = activeArtistData.group ? activeArtistData.group.image : activeArtist.image;

        if (name === mainArtistName) return mainArtistImage;
        const p = allPlayerArtists.find(a => a.name === name);
        if (p) return p.image;
        if (NPC_ARTIST_IMAGES[name]) return NPC_ARTIST_IMAGES[name];
        
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=333&color=fff`;
    };

    const getRolesOnSong = (song: Song, person: string) => {
        const roles = [];
        if (!activeArtistData) return roles;
        const songArtist = allPlayerArtists.find(a => a.id === song.artistId);
        const mainName = songArtist ? songArtist.name : undefined;
        if (mainName === person) roles.push("Main Artist");
        if (song.collaboration && song.collaboration.artistName === person) roles.push("Featured Artist");
        if (song.features && song.features.includes(person)) roles.push("Featured Artist");
        if (song.isFeatureToNpc && song.npcArtistName === person) roles.push("Featured Artist");
        if (song.songwriters?.includes(person)) roles.push("Writer");
        if (song.producers?.includes(person)) roles.push("Producer");
        if (song.engineers?.includes(person)) roles.push("Engineer");
        if (song.anr?.includes(person)) roles.push("A&R");
        
        // Let's add Composer/Vocals for flair if Writer/Main Artist
        if (roles.includes("Writer") && !roles.includes("Composer")) roles.push("Composer");
        if ((roles.includes("Main Artist") || roles.includes("Featured Artist")) && !roles.includes("Vocals")) roles.push("Vocals");

        return roles;
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const profileImage = getImageForContributor(contributorName);

    return (
        <div className="fixed inset-0 bg-[#121212] z-[60] text-white flex flex-col animate-[slideUp_0.3s_ease-out]" style={{ animation: 'slideUp 0.3s ease-out forwards' }}>
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
                    <button onClick={onClose} className="p-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto pb-20 p-4">
                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-8">
                    {profileImage ? (
                        <img src={profileImage} alt={contributorName} className="w-20 h-20 rounded-full object-cover shadow-lg" />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-[#333] flex items-center justify-center text-zinc-500 shadow-lg">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        </div>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold">{contributorName}</h1>
                        <p className="text-zinc-300 text-sm mt-1">{stats.totalUniqueCollabs} collaborators • {stats.songs.length} songs</p>
                    </div>
                </div>

                {/* Collaborators */}
                {stats.collaborators.size > 0 && (
                    <div className="mb-10">
                        <h2 className="text-xl font-bold mb-4">Collaborators</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
                            {Array.from(stats.collaborators.entries()).slice(0, 10).map(([name, data]) => {
                                const img = getImageForContributor(name);
                                return (
                                    <div 
                                        key={name} 
                                        className="flex flex-col items-center text-center cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => onContributorClick && onContributorClick(name)}
                                    >
                                        {img ? (
                                            <img src={img} alt={name} className="w-24 h-24 rounded-full object-cover mb-3" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-[#333] flex items-center justify-center text-zinc-500 mb-3 text-3xl font-bold">
                                                {(name || "?").charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <p className="font-bold text-sm leading-tight mb-1">{name}</p>
                                        <p className="text-xs text-zinc-400 leading-tight">
                                            Collaborator • {data.totalCollabs} collaborators • {data.songs} songs
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Popular songs */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Popular songs</h2>
                        <button className="text-sm font-semibold hover:text-[#1ed760] transition-colors">Save as playlist</button>
                    </div>
                    <div className="space-y-4">
                        {stats.topSongs.map(song => (
                            <div key={song.id} className="flex gap-4 group">
                                <div className="relative flex-shrink-0">
                                    <img src={song.coverArt} alt={song.title} className="w-16 h-16 rounded shadow-md object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <h3 className="font-bold text-lg truncate leading-tight mb-1">{song.title}</h3>
                                    <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
                                        {song.explicit && <span className="text-[10px] w-4 h-4 bg-zinc-400 text-black font-bold rounded-sm flex items-center justify-center flex-shrink-0">E</span>}
                                        <span className="truncate">{formatNumber(song.streams || 0)} plays • {activeArtistData?.group ? activeArtistData.group.name : activeArtist?.name}</span>
                                    </div>
                                    <p className="text-zinc-400 text-sm mt-1 truncate">
                                        <span className="text-zinc-200 font-medium">Roles:</span> {getRolesOnSong(song, contributorName).join(', ')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="hover:text-white"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg></button>
                                    <button className="hover:text-white"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
