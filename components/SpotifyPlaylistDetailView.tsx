import React, { useMemo } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import TrianglePlayIcon from './icons/TrianglePlayIcon';
import PlusCircleIcon from './icons/PlusCircleIcon';
import DotsHorizontalIcon from './icons/DotsHorizontalIcon';
import ShuffleIcon from './icons/ShuffleIcon';
import SpotifyIcon from './icons/SpotifyIcon';
import HeartIcon from './icons/HeartIcon';
import { SpotifyPlaylistCover } from './SpotifyPlaylistCover';
import { NPC_ARTIST_IMAGES } from '../constants';

const SpotifyPlaylistDetailView: React.FC<{ playlistId: string; onBack: () => void }> = ({ playlistId, onBack }) => {
    const { gameState, activeArtist, allPlayerArtists } = useGame();
    
    const playlist = useMemo(() => {
        return gameState.spotifyPlaylists?.find(p => p.id === playlistId);
    }, [gameState.spotifyPlaylists, playlistId]);

    if (!playlist) return null;

    let playlistCover = playlist.coverArt;
    let featuredArtistName = 'Various Artists';
    if (playlist.tracks && playlist.tracks.length > 0) {
        const topTrack = playlist.tracks[0];
        if (topTrack.artistId !== 'unknown') {
            const topPlayerArtist = allPlayerArtists.find(a => a.id === topTrack.artistId);
            if (topPlayerArtist) {
                playlistCover = topPlayerArtist.image;
                featuredArtistName = topPlayerArtist.name;
            }
        } else {
            playlistCover = NPC_ARTIST_IMAGES?.[topTrack.artistName] || topTrack.coverArt || playlist.coverArt;
            featuredArtistName = topTrack.artistName;
        }
    }

    const totalDuration = playlist.tracks.length * 3.5; // placeholder duration

    return (
        <div className="bg-[#121212] text-white h-full overflow-y-auto mb-16 pb-[100px]">
            {/* Header / Full Bleed Cover */}
            <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[21/9] bg-[#121212]">
                <button 
                    onClick={onBack} 
                    className="absolute top-8 left-4 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors z-20"
                    aria-label="Go back"
                >
                    <ChevronLeftIcon className="w-6 h-6" />
                </button>

                <div className="absolute inset-0">
                    <SpotifyPlaylistCover 
                        name={playlist.name} 
                        imageUrl={playlistCover} 
                        artistName={featuredArtistName} 
                        size="large" 
                    />
                </div>
            </div>

            {/* Description & Meta */}
            <div className="px-4 mt-4 space-y-4">
                <p className="text-zinc-300 text-sm font-medium">
                    {playlist.description}. Cover: {featuredArtistName}
                </p>
                <div className="flex items-center gap-2">
                    <SpotifyIcon className="w-6 h-6 text-[#1ed760]" />
                    <span className="text-white font-bold text-sm">Spotify</span>
                </div>
                <div className="text-sm font-medium text-zinc-400">
                    {formatNumber(playlist.followers)} saves • 2h 41m
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-between mt-2 py-2">
                    <div className="flex items-center gap-6">
                        <div className="w-9 h-9 bg-black border border-zinc-500 rounded-sm flex items-center justify-center p-1 text-[8px] text-center font-black uppercase leading-tight overflow-hidden">
                            {playlist.name}
                        </div>
                        <PlusCircleIcon className="w-8 h-8 text-zinc-400 font-light" />
                        <div className="w-8 h-8 text-zinc-400 border-2 border-zinc-400 rounded-full flex items-center justify-center">
                            <span className="text-lg leading-none font-bold pb-1 text-center items-center justify-center -ml-[1px]">↓</span>
                        </div>
                        <DotsHorizontalIcon className="w-8 h-8 text-zinc-400" />
                    </div>
                    <div className="flex items-center gap-6">
                        <span className="text-[#1ed760] font-bold text-xl leading-none">🔀</span>
                        <button className="w-14 h-14 bg-[#1ed760] rounded-full flex items-center justify-center hover:bg-[#1fdf64] hover:scale-105 transition-all text-black shadow-lg">
                            <TrianglePlayIcon className="w-7 h-7 ml-1" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Tracks List */}
            <div className="px-4 md:px-8 mt-6">
                <div className="space-y-4">
                    {playlist.tracks.map((track, index) => {
                        const isPlayerTrack = track.artistName === activeArtist?.name;
                        
                        // Try to find if explicit (lookup from player data if missing from track object)
                        let isExplicit = track.explicit || false;
                        if (!isExplicit && isPlayerTrack && activeArtist) {
                            const artistData = gameState.artistsData[activeArtist.id];
                            const playerSong = artistData?.songs.find(s => s.id === track.songId);
                            if (playerSong?.explicit) isExplicit = true;
                        }

                        return (
                            <div key={`${track.songId}-${index}`} className="group flex justify-between items-center bg-transparent cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-md transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden flex-1 pr-4">
                                    <div className="w-5 text-right flex-shrink-0 text-zinc-400 font-medium group-hover:hidden">{index + 1}</div>
                                    <div className="w-5 text-right flex-shrink-0 text-white font-medium hidden group-hover:flex items-center justify-center">
                                        <TrianglePlayIcon className="w-3 h-3" />
                                    </div>
                                    {track.coverArt && <img src={track.coverArt} className="w-12 h-12 object-cover flex-shrink-0 rounded-sm" alt="" />}
                                    <div className="min-w-0 flex flex-col">
                                        <div className={`font-semibold truncate text-base ${isPlayerTrack ? 'text-[#1ed760]' : 'text-white'}`}>
                                            {track.title}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-zinc-400 text-sm truncate group-hover:text-white transition-colors mt-0.5">
                                            {isExplicit && (
                                                <span className="bg-zinc-400 text-[#121212] text-[9px] font-bold px-1 rounded-sm leading-tight flex-shrink-0">E</span>
                                            )}
                                            <span className="truncate">{track.artistName}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-shrink-0 text-zinc-400 flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-4">
                                    <HeartIcon className="w-5 h-5 hover:text-white" />
                                    <DotsHorizontalIcon className="w-5 h-5 hover:text-white" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SpotifyPlaylistDetailView;
