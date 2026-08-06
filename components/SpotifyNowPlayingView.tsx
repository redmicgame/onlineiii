import { NPC_ARTIST_IMAGES } from "../constants";
import React, { useState, useRef } from 'react';
import { useGame, formatNumber } from '../context/GameContext';
import type { Song } from '../types';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import VolumeUpIcon from './icons/VolumeUpIcon';
import PlusCircleIcon from './icons/PlusCircleIcon';
import DotsHorizontalIcon from './icons/DotsHorizontalIcon';
import ShareIcon from './icons/ShareIcon';

const SpotifyNowPlayingView: React.FC<{ songs: Song[]; initialSongIndex: number; onBack: () => void; }> = ({ songs, initialSongIndex, onBack }) => {
    const { activeArtist, activeArtistData, allPlayerArtists } = useGame();
    const [isMuted, setIsMuted] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(initialSongIndex);

    const touchStartY = useRef(0);
    const touchEndY = useRef(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartY.current = e.targetTouches[0].clientY;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndY.current = e.targetTouches[0].clientY;
    };

    const handleTouchEnd = () => {
        if (!touchStartY.current || !touchEndY.current) return;
        const distance = touchStartY.current - touchEndY.current;
        const isUpSwipe = distance > 50;
        const isDownSwipe = distance < -50;
        
        if (isUpSwipe) {
            setCurrentIndex(c => (c + 1) % songs.length);
        } else if (isDownSwipe) {
            setCurrentIndex(c => (c - 1 + songs.length) % songs.length);
        }
        
        touchStartY.current = 0;
        touchEndY.current = 0;
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.deltaY > 50) {
            setCurrentIndex(c => (c + 1) % songs.length);
        } else if (e.deltaY < -50) {
            setCurrentIndex(c => (c - 1 + songs.length) % songs.length);
        }
    };

    if (!activeArtist || !activeArtistData || !songs || songs.length === 0) {
        onBack();
        return null;
    }

    const song = songs[currentIndex];

    const artistsToDisplay = [{ name: activeArtist.name, image: activeArtist.image }];
    
    if (song.features && song.features.length > 0) {
        song.features.forEach(f => {
            const collabProfile = allPlayerArtists.find(a => a.name === f);
            if (collabProfile) {
                artistsToDisplay.push({ name: collabProfile.name, image: collabProfile.image });
            } else {
                artistsToDisplay.push({ name: f, image: NPC_ARTIST_IMAGES[f] || `https://ui-avatars.com/api/?name=${encodeURIComponent(f)}&background=random` });
            }
        });
    } else if (song.collaboration) {
        const collabProfile = allPlayerArtists.find(a => a.name === song.collaboration?.artistName);
        if (collabProfile) {
            artistsToDisplay.push({ name: collabProfile.name, image: collabProfile.image });
        } else {
            artistsToDisplay.push({ name: song.collaboration.artistName, image: NPC_ARTIST_IMAGES[song.collaboration.artistName] || `https://ui-avatars.com/api/?name=${encodeURIComponent(song.collaboration.artistName)}&background=random` });
        }
    } else if (song.isFeatureToNpc && song.npcArtistName) {
        artistsToDisplay.unshift({ name: song.npcArtistName, image: NPC_ARTIST_IMAGES[song.npcArtistName] || `https://ui-avatars.com/api/?name=${encodeURIComponent(song.npcArtistName)}&background=random` });
    }

    const defaultHashtags = (song.genre || "").split(/[/,]/).map(g => `#${g.trim().toLowerCase().replace(/\s/g, '')}`);
    const hashtagsToDisplay = song.canvasHashtags && song.canvasHashtags.length > 0 ? song.canvasHashtags : defaultHashtags;
    const artistNamesStr = artistsToDisplay.map(a => a.name).join(', ');

    return (
        <div 
            className="fixed inset-0 bg-black text-white z-50 transition-transform duration-300 ease-in-out"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
        >
            {/* Background */}
            <div className="absolute inset-0">
                {song.canvasVideo ? (
                    <video 
                        key={song.id}
                        src={song.canvasVideo} 
                        className="w-full h-full object-cover" 
                        autoPlay 
                        loop 
                        muted={isMuted} 
                        playsInline 
                    />
                ) : (
                    <>
                        <img key={song.id} src={song.coverArt} alt="" className="w-full h-full object-cover filter blur-2xl scale-110 opacity-70 transition-all duration-500" />
                        <div className="absolute inset-0 bg-black/60"></div>
                    </>
                )}
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col p-4 bg-gradient-to-t from-black/80 via-transparent to-black/30">
                <header className="flex justify-between items-center flex-shrink-0 pt-2">
                    <button onClick={onBack} className="p-2 -m-2">
                        <ArrowLeftIcon className="w-6 h-6 shadow-black drop-shadow-md" />
                    </button>
                    {!song.canvasVideo && <p className="font-bold text-sm shadow-black drop-shadow-md">{artistNamesStr}</p>}
                    <button onClick={() => setIsMuted(m => !m)} className="p-2 -m-2">
                        {isMuted ? (
                            <svg className="w-6 h-6 shadow-black drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                            </svg>
                        ) : (
                            <VolumeUpIcon className="w-6 h-6 shadow-black drop-shadow-md" />
                        )}
                    </button>
                </header>

                <main className="flex-grow flex flex-col items-center justify-center space-y-8 py-8 overflow-hidden pointer-events-none">
                    {!song.canvasVideo && (
                        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex-shrink-0">
                             {/* Animated Bars */}
                            <div className="absolute inset-0 flex items-center justify-center gap-1.5 opacity-30">
                                {[...Array(30)].map((_, i) => (
                                    <span
                                        key={i}
                                        className="bar w-1.5 bg-white/70 rounded-full"
                                        style={{
                                            height: `${Math.random() * 40 + 20}%`,
                                            animationName: 'wave',
                                            animationDuration: `${Math.random() * 1 + 0.8}s`,
                                            animationTimingFunction: 'ease-in-out',
                                            animationIterationCount: 'infinite',
                                            animationDirection: 'alternate',
                                            animationDelay: `${i * 0.03}s`
                                        }}
                                    />
                                ))}
                            </div>
                            <img src={song.coverArt} alt={song.title} className="relative w-full h-full object-cover rounded-lg shadow-2xl shadow-black/50" />
                        </div>
                    )}
                </main>

                <footer className="flex-shrink-0 space-y-3 pb-2 z-10 p-2 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex -space-x-4 relative">
                                {artistsToDisplay.map((a, i) => (
                                    <img key={i} src={a.image} alt={a.name} className="w-12 h-12 rounded-full object-cover border-2 border-black" style={{ zIndex: artistsToDisplay.length - i }} />
                                ))}
                            </div>
                            <div className="flex flex-col">
                                <p className="font-bold text-md shadow-black drop-shadow-md leading-tight">{artistNamesStr}</p>
                            </div>
                            <button className="border border-white/80 rounded-full px-4 py-1 text-sm font-bold hover:border-white hover:bg-white/10 transition-colors shadow-black drop-shadow-md backdrop-blur-sm -ml-1">
                                Follow
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <button>
                                <svg className="w-6 h-6 text-white shadow-black drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            </button>
                            <button><DotsHorizontalIcon className="w-6 h-6 text-white shadow-black drop-shadow-md" /></button>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 pt-1 pb-1">
                        {hashtagsToDisplay.map(g => (
                            <div key={g} className="bg-black/30 backdrop-blur-sm rounded-full px-2.5 py-1 text-sm font-semibold shadow-black drop-shadow-sm border border-white/10">
                                {g}
                            </div>
                        ))}
                    </div>

                    <div className="bg-black/40 backdrop-blur-md p-2 rounded-xl flex items-center gap-3 border border-white/10">
                        <img src={song.coverArt} alt={song.title} className="w-12 h-12 rounded-md" />
                        <div className="flex-grow min-w-0">
                            <p className="font-bold truncate text-sm">{song.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                {song.explicit && <span className="text-[10px] w-4 h-4 bg-zinc-400 text-black font-bold rounded-sm flex items-center justify-center">E</span>}
                                <p className="text-xs text-zinc-300 truncate">{artistNamesStr}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mr-1">
                            <button><PlusCircleIcon className="w-6 h-6 text-zinc-300 hover:text-white" /></button>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default SpotifyNowPlayingView;